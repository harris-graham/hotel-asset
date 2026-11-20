import React, { useState, useEffect } from "react";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import AssetTag from './AssetTag';
import { downloadCsv } from '../utils/csv';

const initialState = {
  matname: "",
  matprice: ""
};

const Material = () => {
  const [useract, setUserAct] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [mat, setMat] = useState([]);
  const [matunu, setMatUnu] = useState([]);
  const [matimg, setMatImg] = useState('');
  const [tag, setTag] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    matSelect();
    matUnuSelect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const matSelect = async () => {
    const response = await axiosJWT.get('http://localhost:5000/matSelect', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setMat(response.data);
  }

  const matUnuSelect = async () => {
    const response = await axiosJWT.get('http://localhost:5000/matUnuSelect', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setMatUnu(response.data);
  }

  const [state, setState] = useState(initialState);
  const { matname, matprice } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const matInsert = async (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:5000/matInsert", {
        matname, matprice, matimg
      });
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  const matUpdate = async (e, matid) => {
    e.preventDefault();
    try {
      axios.put(`http://localhost:5000/matUpdate/${matid}`, {
        matname, matprice, matimg
      });
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  const matDelete = async (e, matid) => {
    e.preventDefault();
    try {
      axios.delete(`http://localhost:5000/matDelete/${matid}`);
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  const fileread = async (e) => {
    const file = e.target.files[0];
    const base64 = await conb64(file);
    setMatImg(base64);
  };

  const conb64 = (file) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        res(reader.result);
      }
      reader.onerror = (err) => {
        rej(err);
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="card col-md-8">
          <div className="mb-3">
            <h1 className="my-5">Objet</h1><hr></hr>
            <button className="btn btn-primary mr-2" data-bs-toggle="modal" data-bs-target="#matInsert" onClick={() => setState({ ...state, matname: "", matprice: "" })}>Ajouter</button>
            <button className="btn btn-outline-secondary" onClick={() => downloadCsv('assets.csv', [
              ['ID', 'Name', 'Price', 'Date'],
              ...mat.map((item) => [item.MatID, item.MatName, item.MatPrice, item.MatDate])
            ])}>Exporter CSV</button>
          </div>
          <div className="modal fade" id="matInsert" tabIndex="-1">
            <div className="modal-dialog modal-dialog-scrolable">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className=" modal-title text-primary">Ajout d'objet</h3>
                  <button className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form onSubmit={matInsert}>
                  <div className="modal-body">
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Nom :</label>
                      </div>
                      <div className="col-md-8">
                        <input className="form-control" name="matname" value={matname} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Prix :</label>
                      </div>
                      <div className="col-md-8">
                        <div className="input-group">
                          <input className="form-control" name="matprice" value={matprice} onChange={handleInputChange} />
                          <span className="input-group-text">Ar</span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label className="form-label">Image :</label>
                      </div>
                      <div className="col-md-8">
                        <input type="file" className="form-control" name="matimg" onChange={e => fileread(e)} accept=".jpeg, .png, .jpg" />
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
                <th>Prix</th>
                <th>Date d'ajout</th>
                <th>QR</th>
                <th colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {mat.map((item) => {
                return (
                  <tr key={item.MatID}>
                    <td>{item.MatName}</td>
                    <td>{item.MatPrice} Ar</td>
                    <td>{(new Date(item.MatDate)).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setTag({ kind: 'asset', id: item.MatID, title: item.MatName, subtitle: `MAT-${item.MatID}` })}>QR</button>
                    </td>
                    <td>
                      <button className="btn btn-warning text-light" data-bs-toggle="modal" data-bs-target={"#matUpdate" + item.MatID} onClick={() => setState({ ...state, matname: item.MatName, matprice: item.MatPrice })}>Modifier</button>
                      <div className="modal fade" id={"matUpdate" + item.MatID} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-scrolable">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h3 className=" modal-title text-warning">Modification d'objet</h3>
                              <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <form onSubmit={(e) => matUpdate(e, item.MatID)}>
                              <div className="modal-body">
                                <div className="row mb-3">
                                  <div className="col-md-4">
                                    <label className="form-label">Nom :</label>
                                  </div>
                                  <div className="col-md-8">
                                    <input className="form-control" name="matname" value={matname} onChange={handleInputChange} />
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-md-4">
                                    <label className="form-label">Prix :</label>
                                  </div>
                                  <div className="col-md-8">
                                    <div className="input-group">
                                      <input className="form-control" name="matprice" value={matprice} onChange={handleInputChange} />
                                      <span className="input-group-text">Ar</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-4">
                                    <label className="form-label">Image :</label>
                                  </div>
                                  <div className="col-md-8">
                                    <input type="file" className="form-control" name="matimg" onChange={e => fileread(e)} accept=".jpeg, .png, .jpg" />
                                  </div>
                                </div>
                              </div>
                              <div className="mb-3" width="50%">
                                <img src={item.MatImg != "" ? item.MatImg : "favicon.ico"} alt={item.MatImg != null ? item.MatName : "Aucune Image!"}></img>
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
                      <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target={"#matDelete" + item.MatID}>Supprimer</button>
                      <div className="modal fade" id={"matDelete" + item.MatID} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-scrolable">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h3 className=" modal-title text-danger">Suppression d'objet</h3>
                              <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                              <h5>Voulez-vous vraiment supprimer l'objet "{item.MatName}" ?</h5>
                            </div>
                            <div className="modal-footer">
                              <button className="btn btn-danger" onClick={(e) => matDelete(e, item.MatID)}>Supprimer</button>
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
          <h3 className="text-primary my-5">Objet non utilis&eacute;</h3><hr></hr>
          <table className="table table-bordered table-striped">
            <thead className="bg-primary text-light">
              <tr>
                <th>Objet</th>
                <th>Date d'ajout</th>
              </tr>
            </thead>
            <tbody>
              {matunu.map((item) => {
                return (
                  <tr key={item.MatID}>
                    <td>{item.MatName}</td>
                    <td>{(new Date(item.MatDate)).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
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

export default Material;