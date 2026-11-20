/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const initialTask = {
  matid: "",
  locid: "",
  mainttype: "Corrective",
  maintdesc: "",
  maintcost: "0.00",
  scheduleddate: new Date().toISOString().slice(0, 10),
  technician: ""
};

const Maintenance = () => {
  const [uidact, setUIDAct] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [tasks, setTasks] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [locations, setLocations] = useState([]);
  const [taskData, setTaskData] = useState(initialTask);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    fetchMaintenance();
    fetchMaterials();
    fetchLocations();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUIDAct(decoded.userid);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:5000/token');
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUIDAct(decoded.userid);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const fetchMaintenance = async () => {
    try {
      const res = await axios.get('http://localhost:5000/maintSelect');
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching maintenance:", error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('http://localhost:5000/matSelect');
      setMaterials(res.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/locSelect');
      setLocations(res.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.post('http://localhost:5000/maintInsert', {
        ...taskData,
        uidact
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaskData(initialTask);
      fetchMaintenance();
      alert("Intervention de maintenance planifiée avec succès !");
    } catch (error) {
      console.error("Error creating maintenance:", error);
      alert("Erreur lors de la planification de l'intervention.");
    }
  };

  const updateStatus = async (maintid, newStatus) => {
    try {
      await axiosJWT.put(`http://localhost:5000/maintUpdate/${maintid}`, {
        maintstatus: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMaintenance();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteTask = async (maintid) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement de maintenance ?")) {
      try {
        await axiosJWT.delete(`http://localhost:5000/maintDelete/${maintid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMaintenance();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const filteredTasks = filterStatus === 'ALL'
    ? tasks
    : tasks.filter(t => t.MaintStatus === filterStatus);

  const getStatusBadge = (status) => {
    if (status === 'Completed') return <span className="badge badge-success px-2 py-1"><i className="fas fa-check mr-1"></i>Terminée</span>;
    if (status === 'In Progress') return <span className="badge badge-primary px-2 py-1"><i className="fas fa-wrench mr-1"></i>En cours</span>;
    return <span className="badge badge-warning px-2 py-1"><i className="fas fa-clock mr-1"></i>Planifiée</span>;
  };

  return (
    <div className="container-fluid py-4 px-md-5">
      <div className="d-sm-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
        <div>
          <h2 className="h3 font-weight-bold text-gray-800 mb-1">
            <i className="fas fa-tools text-primary mr-2"></i>Gestion de la Maintenance & Réparations
          </h2>
          <p className="text-muted small mb-0">Suivi des interventions préventives, curatives et contrôles qualité des équipements de l'hôtel.</p>
        </div>
        <div className="btn-group">
          <button className={`btn btn-sm ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilterStatus('ALL')}>Tous ({tasks.length})</button>
          <button className={`btn btn-sm ${filterStatus === 'Scheduled' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => setFilterStatus('Scheduled')}>Planifiées</button>
          <button className={`btn btn-sm ${filterStatus === 'In Progress' ? 'btn-info' : 'btn-outline-info'}`} onClick={() => setFilterStatus('In Progress')}>En cours</button>
          <button className={`btn btn-sm ${filterStatus === 'Completed' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilterStatus('Completed')}>Terminées</button>
          <button className="btn btn-sm btn-secondary ml-2 font-weight-bold" onClick={() => window.print()}><i className="fas fa-print mr-1"></i>Imprimer</button>
        </div>
      </div>

      <div className="row">
        {/* Left Form: Schedule Maintenance */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white py-3">
              <h6 className="m-0 font-weight-bold"><i className="fas fa-calendar-plus mr-1"></i>Planifier une intervention</h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                  <label className="small font-weight-bold">Équipement concerné * :</label>
                  <select className="form-control form-control-sm" name="matid" value={taskData.matid} onChange={handleInputChange} required>
                    <option value="" disabled>Sélectionner le matériel</option>
                    {materials.map(m => (
                      <option key={m.MatID} value={m.MatID}>#{m.MatID} - {m.MatName}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-2">
                  <label className="small font-weight-bold">Emplacement / Chambre * :</label>
                  <select className="form-control form-control-sm" name="locid" value={taskData.locid} onChange={handleInputChange} required>
                    <option value="" disabled>Sélectionner l'emplacement</option>
                    {locations.map(l => (
                      <option key={l.LocID} value={l.LocID}>{l.LocName}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-2">
                  <label className="small font-weight-bold">Type d'intervention :</label>
                  <select className="form-control form-control-sm" name="mainttype" value={taskData.mainttype} onChange={handleInputChange}>
                    <option value="Corrective">Curative (Panne / Réparation)</option>
                    <option value="Preventive">Préventive (Entretien régulier)</option>
                    <option value="Inspection">Contrôle / Audit de conformité</option>
                  </select>
                </div>

                <div className="form-group mb-2">
                  <label className="small font-weight-bold">Description du problème / Travaux * :</label>
                  <textarea className="form-control form-control-sm" name="maintdesc" value={taskData.maintdesc} onChange={handleInputChange} rows="2" placeholder="ex: Dépoussiérage filtre climatisation, remplacement télécommande" required></textarea>
                </div>

                <div className="form-row mb-2">
                  <div className="col-6">
                    <label className="small font-weight-bold">Date prévue :</label>
                    <input type="date" className="form-control form-control-sm" name="scheduleddate" value={taskData.scheduleddate} onChange={handleInputChange} required />
                  </div>
                  <div className="col-6">
                    <label className="small font-weight-bold">Coût estimé ($) :</label>
                    <input type="number" step="0.01" className="form-control form-control-sm" name="maintcost" value={taskData.maintcost} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="small font-weight-bold">Technicien / Prestataire :</label>
                  <input type="text" className="form-control form-control-sm" name="technician" value={taskData.technician} onChange={handleInputChange} placeholder="ex: SAV Samsung, Jean Service" />
                </div>

                <button type="submit" className="btn btn-primary btn-block font-weight-bold py-2 shadow-sm">
                  <i className="fas fa-check mr-1"></i>Enregistrer l'intervention
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Table: Active Interventions */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-clipboard-list mr-1"></i>Historique des interventions ({filteredTasks.length})
              </h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0">
                  <thead className="thead-light">
                    <tr>
                      <th>Équipement</th>
                      <th>Emplacement</th>
                      <th>Type & Description</th>
                      <th>Date</th>
                      <th>Coût</th>
                      <th>Statut</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">
                          Aucune intervention de maintenance enregistrée.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map(task => (
                        <tr key={task.MaintID}>
                          <td className="font-weight-bold align-middle">
                            {task.material ? task.material.MatName : `Matériel #${task.MatID}`}
                          </td>
                          <td className="align-middle">
                            <span className="badge badge-light border">
                              {task.location ? task.location.LocName : `Empl. #${task.LocID}`}
                            </span>
                          </td>
                          <td className="align-middle small">
                            <strong>{task.MaintType}</strong> : {task.MaintDesc}
                            {task.Technician && <div className="text-muted"><i className="fas fa-user-cog mr-1"></i>Tech: {task.Technician}</div>}
                          </td>
                          <td className="align-middle small">{task.ScheduledDate}</td>
                          <td className="align-middle font-weight-bold">${parseFloat(task.MaintCost || 0).toFixed(2)}</td>
                          <td className="align-middle">{getStatusBadge(task.MaintStatus)}</td>
                          <td className="align-middle text-right">
                            <div className="btn-group btn-group-sm">
                              {task.MaintStatus !== 'Completed' && (
                                <button className="btn btn-outline-success" onClick={() => updateStatus(task.MaintID, 'Completed')} title="Marquer comme terminée">
                                  <i className="fas fa-check"></i>
                                </button>
                              )}
                              {task.MaintStatus === 'Scheduled' && (
                                <button className="btn btn-outline-primary" onClick={() => updateStatus(task.MaintID, 'In Progress')} title="Démarrer l'intervention">
                                  <i className="fas fa-play"></i>
                                </button>
                              )}
                              <button className="btn btn-outline-danger" onClick={() => deleteTask(task.MaintID)} title="Supprimer">
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
