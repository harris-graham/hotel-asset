import React, { useState, useEffect } from "react";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import AssetTag from './AssetTag';
import { downloadCsv } from '../utils/csv';

const initialState = {
  locname: "",
  loccolor: "",
  entid: "",
  entname: ""
};

const Location = () => {
  const [useract, setUserAct] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [ent, setEntity] = useState([]);
  const [loc, setLocation] = useState([]);
  const [tag, setTag] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    locSelect();
    entSelect();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUserAct(decoded.username);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  }

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:5000/token');
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUserAct(decoded.username);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const locSelect = async () => {
    const response = await axiosJWT.get('http://localhost:5000/locSelect', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setLocation(response.data);
  }

  const entSelect = async () => {
    const response = await axiosJWT.get('http://localhost:5000/entSelect', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setEntity(response.data);
  }

  const [state, setState] = useState(initialState);
  const { locname, loccolor, entid, entname } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const locInsert = async (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:5000/locInsert", {
        locname, loccolor, entid
      });
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  const entInsert = async (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:5000/entInsert", {
        entname
      });
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  const locUpdate = async (e, locid) => {
    e.preventDefault();
    try {
      axios.put(`http://localhost:5000/locUpdate/${locid}`, {
        locname, loccolor, entid
      });
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  const entUpdate = async (e, entid) => {
    e.preventDefault();
    try {
      axios.put(`http://localhost:5000/entUpdate/${entid}`, {
        entname
      });
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  const locDelete = async (e, locid) => {
    e.preventDefault();
    try {
      axios.delete(`http://localhost:5000/locDelete/${locid}`);
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  const entDelete = async (e, entid) => {
    e.preventDefault();
    try {
      axios.delete(`http://localhost:5000/entDelete/${entid}`);
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="card col-md-8">
          <div className="mb-3">
            <h1 className="my-5">Localisation</h1><hr></hr>
            <button className="btn btn-primary mr-2" data-bs-toggle="modal" data-bs-target="#locInsert" onClick={() => setState({ ...state, locname: "", loccolor: "", entid: "" })}>Ajouter</button>
            <button className="btn btn-outline-secondary" onClick={() => downloadCsv('rooms.csv', [
              ['ID', 'Name', 'Color', 'Entity'],
              ...loc.map((item) => [item.LocID, item.LocName, item.LocColor, item.entity?.EntName || ''])
            ])}>Exporter CSV</button>
          </div>
          <div className="modal fade" id="locInsert" tabIndex="-1">
            <div className="modal-dialog modal-dialog-scrolable">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className=" modal-title text-primary">Ajout de localisation</h3>
                  <button className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form onSubmit={locInsert}>
                  <div className="modal-body">
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Nom :</label>
                      </div>
                      <div className="col-md-8">
                        <input className="form-control" name="locname" value={locname} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Couleur :</label>
                      </div>
                      <div className="col-md-8">
                        <input className="form-control" name="loccolor" value={loccolor} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label className="form-label">Entit&eacute; :</label>
                      </div>
                      <div className="col-md-8">
                        <select className="form-select" name="entid" value={entid} onChange={handleInputChange}>
                          {ent.map(item => {
                            return (
                              <option key={item.EntID} value={item.EntID}>{item.EntName}</option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">Ajouter</button>
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <table className="table table-bordered table-striped">
            <thead className="bg-dark text-light">
              <tr>
                <th>Nom</th>
                <th>Couleur</th>
                <th>Entit&eacute;</th>
                <th>QR</th>
                <th colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loc.map((item) => {
                return (
                  <tr key={item.LocID}>
                    <td>{item.LocName}</td>
                    <td>{item.LocColor}</td>
                    <td>{item.entity.EntName}</td>
                    <td>
                      <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setTag({ kind: 'room', id: item.LocID, title: item.LocName, subtitle: item.entity?.EntName || '' })}>QR</button>
                    </td>
                    <td>
                      <button className="btn btn-warning text-light" data-bs-toggle="modal" data-bs-target={"#locUpdate" + item.LocID} onClick={() => setState({ ...state, locname: item.LocName, loccolor: item.LocColor, entid: item.EntID })}>Modifier</button>
                      <div className="modal fade" id={"locUpdate" + item.LocID} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-scrolable">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h3 className=" modal-title text-warning">Modification de localisation</h3>
                              <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <form onSubmit={(e) => locUpdate(e, item.LocID)}>
                              <div className="modal-body">
                                <div className="row mb-3">
                                  <div className="col-md-4">
                                    <label className="form-label">Nom :</label>
                                  </div>
                                  <div className="col-md-8">
                                    <input className="form-control" name="locname" value={locname} onChange={handleInputChange} />
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-md-4">
                                    <label className="form-label">Couleur :</label>
                                  </div>
                                  <div className="col-md-8">
                                    <input className="form-control" name="loccolor" value={loccolor} onChange={handleInputChange} />
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-4">
                                    <label className="form-label">Entit&eacute; :</label>
                                  </div>
                                  <div className="col-md-8">
                                    <select className="form-select" name="entid" value={entid} onChange={handleInputChange}>
                                      {ent.map(item => {
                                        return (
                                          <option key={item.EntID} value={item.EntID}>{item.EntName}</option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="modal-footer">
                                <button type="submit" className="btn btn-warning text-light">Modifier</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target={"#locDelete" + item.LocID}>Supprimer</button>
                      <div className="modal fade" id={"locDelete" + item.LocID} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-scrolable">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h3 className=" modal-title text-danger">Suppression de localisation</h3>
                              <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                              <h5>Voulez-vous vraiment supprimer la localisation "{item.LocName}" ?</h5>
                            </div>
                            <div className="modal-footer">
                              <button className="btn btn-danger" onClick={(e) => locDelete(e, item.LocID)}>Supprimer</button>
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card col-md-4">
          <div className="mb-3">
            <h1 className="my-5">Entit&eacute;</h1><hr></hr>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#entInsert" onClick={() => setState({ ...state, entname: "" })}>Ajouter</button>
          </div>
          <div className="modal fade" id="entInsert" tabIndex="-1">
            <div className="modal-dialog modal-dialog-scrolable">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className=" modal-title text-primary">Ajout d'entit&eacute;</h3>
                  <button className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form onSubmit={entInsert}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-4">
                        <label className="form-label">Nom :</label>
                      </div>
                      <div className="col-md-8">
                        <input className="form-control" name="entname" value={entname} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">Ajouter</button>
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <table className="table table-bordered table-striped">
            <thead className="bg-dark text-light">
              <tr>
                <th>Nom</th>
                <th colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ent.map((item) => {
                return (
                  <tr key={item.EntID}>
                    <td>{item.EntName}</td>
                    <td>
                      <button className="btn btn-warning text-light" data-bs-toggle="modal" data-bs-target={"#entUpdate" + item.EntID} onClick={() => setState({ ...state, entname: item.EntName })}>Modifier</button>
                      <div className="modal fade" id={"entUpdate" + item.EntID} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-scrolable">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h3 className=" modal-title text-warning">Modification d'entit&eacute;</h3>
                              <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <form onSubmit={(e) => entUpdate(e, item.EntID)}>
                              <div className="modal-body">
                                <div className="row">
                                  <div className="col-md-4">
                                    <label className="form-label">Nom :</label>
                                  </div>
                                  <div className="col-md-8">
                                    <input className="form-control" name="entname" value={entname} onChange={handleInputChange} />
                                  </div>
                                </div>
                              </div>
                              <div className="modal-footer">
                                <button type="submit" className="btn btn-warning text-light">Modifier</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target={"#entDelete" + item.EntID}>Supprimer</button>
                      <div className="modal fade" id={"entDelete" + item.EntID} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-scrolable">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h3 className=" modal-title text-danger">Suppression d'entit&eacute;</h3>
                              <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                              <h5>Voulez-vous vraiment supprimer l'entit&eacute; "{item.EntName}" ?</h5>
                            </div>
                            <div className="modal-footer">
                              <button className="btn btn-danger" onClick={(e) => entDelete(e, item.EntID)}>Supprimer</button>
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <AssetTag tag={tag} onClose={() => setTag(null)} />
    </div>
  );
};

export default Location;