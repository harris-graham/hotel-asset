import React, { useState, useEffect } from "react";
import axios from 'axios';

const initialState = {
  entname: ""
};

const Entity = () => {
  const [data, setData] = useState([]);
  const loadData = async () => {
    const res = await axios.get("http://localhost:5000/entSelect");
    setData(res.data);
  };
  useEffect(() => {
    loadData();
  }, []);
  const [state, setState] = useState(initialState);
  const { entname } = state;
  const entInsert = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/entInsert", {
      entname
    })
    .catch((err) => console.log(err.res.data));
    window.location.reload();
  };
  const entUpdate = (entid) => {
    axios.put(`http://localhost:5000/entUpdate/${entid}`, {
      entname
    })
    .catch((err) => console.log(err.res.data));
    window.location.reload();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  const entDelete = (entid) => {
    axios.delete(`http://localhost:5000/entDelete/${entid}`);
    window.location.reload();
  }
  return (
    <div className="container-fluid">
      <div className="col-md-4 mx-auto">
        <h1 className="my-5">Entit&eacute;</h1><hr></hr>
        <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#entInsert">Ajouter</button>
        <div className="modal fade" id="entInsert" tabIndex="-1">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className=" modal-title text-primary">Ajout d'entit&eacute;</h3>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <form onSubmit={entInsert}>
                <div className="modal-body">
                  <div className="row mb-3">
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
        <table className="table table-striped">
          <thead className="bg-dark text-light">
            <tr>
              <th>Nom</th>
              <th colSpan={4}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              return (
                <tr key={item.EntID}>
                  <td>{item.EntName}</td>
                  <td>
                    <button className="btn btn-warning text-light" data-bs-toggle="modal" data-bs-target={"#entUpdate" + item.EntID}>Modifier</button>
                  </td>
                  <td>
                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target={"#entDelete" + item.EntID}>Supprimer</button>
                  </td>
                  <td>
                    <div className="modal fade" id={"entUpdate" + item.EntID} tabIndex="-1">
                      <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h3 className=" modal-title text-warning">Modification d'entit&eacute;</h3>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <form onSubmit={() => entUpdate(item.EntID)}>
                            <div className="modal-body">
                              <div className="row mb-3">
                                <div className="col-md-4">
                                  <label className="form-label">Nom :</label>
                                </div>
                                <div className="col-md-8">
                                  <input className="form-control" name="entname" value={entname || item.EntName} onChange={handleInputChange} />
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
                    <div className="modal fade" id={"entDelete" + item.EntID} tabIndex="-1">
                      <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h3 className=" modal-title text-danger">Suppression d'entit&eacute;</h3>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body">
                            <h5>Voulez-vous vraiment supprimer l'entit&eacute; "{item.EntName}" ?</h5>
                          </div>
                          <div className="modal-footer">
                            <button className="btn btn-danger" onClick={() => entDelete(item.EntID)}>Supprimer</button>
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
  );
};

export default Entity;