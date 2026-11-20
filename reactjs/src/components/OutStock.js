import React, { useState, useEffect } from "react";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const initialState = {
  outqty: "",
  outmotiv: "",
  matid: "",
  locid: ""
};

const OutStock = () => {
  const [uidact, setUIDAct] = useState('');
  const [useract, setUserAct] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [out, setOut] = useState([]);
  const [mat, setMat] = useState([]);
  const [loc, setLoc] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    outSelect();
    matSelect();
    locSelect();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUIDAct(decoded.userid);
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
      setUIDAct(decoded.userid);
      setUserAct(decoded.username);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const outSelect = async () => {
    const response = await axiosJWT.get('http://localhost:5000/outSelect', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setOut(response.data);
  }

  const matSelect = async () => {
    const response = await axiosJWT.get('http://localhost:5000/matSelect', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setMat(response.data);
  }

  const locSelect = async () => {
    const response = await axiosJWT.get('http://localhost:5000/locSelect', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setLoc(response.data);
  }

  const [state, setState] = useState(initialState);
  const { outqty, outmotiv, matid, locid } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const outInsert = async (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:5000/outInsert", {
        outqty, outmotiv, matid, locid, uidact
      });
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  return (
    <div className="container-fluid card">
      <h1 className="my-5">Sortie de stock</h1><hr></hr>
      <div className="mb-3">
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#outInsert">Ajouter</button>
      </div>
      <div className="modal fade" id="outInsert" tabIndex="-1">
        <div className="modal-dialog modal-dialog-scrolable">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className=" modal-title text-danger">Sortie d'objet</h3>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form onSubmit={outInsert}>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Objet :</label>
                  </div>
                  <div className="col-md-8">
                    <select className="form-select" name="matid" value={matid} onChange={handleInputChange}>
                      {/* <option selected hidden>Choisir l'objet</option> */}
                      {mat.map(item => {
                        return (
                          <option key={item.MatID} value={item.MatID}>{item.MatName}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Localisation :</label>
                  </div>
                  <div className="col-md-8">
                    <select className="form-select" name="locid" value={locid} onChange={handleInputChange}>
                      {/* <option selected hidden>Choisir le lieu</option> */}
                      {loc.map(item => {
                        return (
                          <option key={item.LocID} value={item.LocID}>{item.LocName}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Quantit&eacute; :</label>
                  </div>
                  <div className="col-md-8">
                    <input className="form-control" name="outqty" value={outqty} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Motivation :</label>
                  </div>
                  <div className="col-md-8">
                    <input className="form-control" name="outmotiv" value={outmotiv} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">Faire sortir</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <table className="table table-bordered table-striped">
        <thead className="bg-dark text-light">
          <tr>
            <th>Date</th>
            <th>Objet</th>
            <th>Localisation</th>
            <th>Quantit&eacute;</th>
            <th>Motivation</th>
            <th>Responsable</th>
          </tr>
        </thead>
        <tbody>
          {out.map((item) => {
            return (
              <tr key={item.OutID}>
                <td>{(new Date(item.OutDate)).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                <td>{item.material.MatName}</td>
                <td>{item.location.LocName}</td>
                <td>{item.OutQty}</td>
                <td>{item.OutMotiv}</td>
                <td>{item.user.UserName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OutStock;