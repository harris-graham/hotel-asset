import React, { useState, useEffect } from "react";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const initialState = {
  username: "",
  userpword: "",
  usertype: ""
};

const User = () => {
  const [useract, setUserAct] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    userSelect();
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

  const userSelect = async () => {
    const response = await axiosJWT.get('http://localhost:5000/userSelect', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUser(response.data);
  }

  const [state, setState] = useState(initialState);
  const { username, userpword, usertype } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const userInsert = async (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:5000/userInsert", {
        username, userpword, usertype
      });
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  const userUpdate = async (e, userid) => {
    e.preventDefault();
    try {
      axios.put(`http://localhost:5000/userUpdate/${userid}`, {
        username, userpword, usertype
      });
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  const userDelete = async (e, userid) => {
    e.preventDefault();
    try {
      axios.delete(`http://localhost:5000/userDelete/${userid}`);
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="card col-md-6">
          <h1 className="my-5">Utilisateur</h1><hr></hr>
          <div className="mb-3">
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#userInsert" onClick={() => setState({ ...state, username: "", userpword: "", usertype: "" })}>Ajouter</button>
          </div>
          <div className="modal fade" id="userInsert" tabIndex="-1">
            <div className="modal-dialog modal-dialog-scrolable">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className=" modal-title text-primary">Ajout d'utilisateur</h3>
                  <button className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form onSubmit={userInsert}>
                  <div className="modal-body">
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Nom :</label>
                      </div>
                      <div className="col-md-8">
                        <input className="form-control" name="username" value={username} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Mot de passe :</label>
                      </div>
                      <div className="col-md-8">
                        <input type="password" className="form-control" name="userpword" value={userpword} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label className="form-label">Type :</label>
                      </div>
                      <div className="col-md-8">
                        <select className="form-select" name="usertype" value={usertype} onChange={handleInputChange}>
                          {/* <option selected hidden>Choisir le type de compte</option> */}
                          <option value="Admin">Admin</option>
                          <option value="Normal">Normal</option>
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
                <th>Utilisateur</th>
                <th>Type</th>
                <th colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {user.map((item) => {
                return (
                  <tr key={item.UserID}>
                    <td>{item.UserName}</td>
                    <td>{item.UserType}</td>
                    <td>
                      <button className="btn btn-warning text-light" data-bs-toggle="modal" data-bs-target={"#userUpdate" + item.UserID} onClick={() => setState({ ...state, username: item.UserName, userpword: "", usertype: item.UserType })}>Modifier</button>
                      <div className="modal fade" id={"userUpdate" + item.UserID} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-scrolable">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h3 className=" modal-title text-warning">Modification d'utilisateur</h3>
                              <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <form onSubmit={(e) => userUpdate(e, item.UserID)}>
                              <div className="modal-body">
                                <div className="row mb-3">
                                  <div className="col-md-4">
                                    <label className="form-label">Nom :</label>
                                  </div>
                                  <div className="col-md-8">
                                    <input className="form-control" name="username" value={username} onChange={handleInputChange} />
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-md-4">
                                    <label className="form-label">Mot de passe :</label>
                                  </div>
                                  <div className="col-md-8">
                                    <input type="password" className="form-control" name="userpword" value={userpword} onChange={handleInputChange} />
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-4">
                                    <label className="form-label">Type :</label>
                                  </div>
                                  <div className="col-md-8">
                                    <select className="form-select" name="usertype" value={usertype} onChange={handleInputChange}>
                                      <option value="Admin">Admin</option>
                                      <option value="Normal">Normal</option>
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
                      <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target={"#userDelete" + item.UserID}>Supprimer</button>
                      <div className="modal fade" id={"userDelete" + item.UserID} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-scrolable">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h3 className=" modal-title text-danger">Suppression d'utilisateur</h3>
                              <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                              <h5>Voulez-vous vraiment supprimer l'utilisateur "{item.UserName}" ?</h5>
                            </div>
                            <div className="modal-footer">
                              <button className="btn btn-danger" onClick={(e) => userDelete(e, item.UserID)}>Supprimer</button>
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
        <div className="card col-md-6">
          <h3 className="text-primary my-5">Nombre d'action</h3><hr></hr>
          <table className="table table-bordered table-striped">
            <thead className="bg-primary text-light">
              <tr>
                <th>Utilisateur</th>
                <th>Transfert</th>
                <th>Sortie de stock</th>
              </tr>
            </thead>
            <tbody>
              {user.map((item) => {
                return (
                  <tr key={item.UserID}>
                    <td>{item.UserName}</td>
                    <td>{item.UTCount}</td>
                    <td>{item.UOCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;