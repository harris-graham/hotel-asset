import React, { useState, useEffect } from "react";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const initialState = {
  matid: "",
  locid: "",
  resqty: ""
};

const RealEstate = () => {
  const [useract, setUserAct] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [res, setRes] = useState([]);
  const [mat, setMat] = useState([]);
  const [loc, setLoc] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    resSelect();
    matSelect();
    locSelect();
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

  const resSelect = async () => {
    const response = await axiosJWT.get('http://localhost:5000/resSelect', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setRes(response.data);
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
  const { matid, locid, resqty } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const resInsert = async (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:5000/resInsert", {
        matid, locid, resqty
      });
    } catch (err) { console.log(err.res.data) };
    window.location.reload();
  };

  const exportInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inventoryExport', { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'room-inventory.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid card">
      <h1 className="my-5">Immobilier</h1><hr></hr>
      <div className="mb-3">
        <button className="btn btn-primary mr-2" data-bs-toggle="modal" data-bs-target="#resInsert">Ajouter</button>
        <button className="btn btn-outline-secondary" onClick={exportInventory}>Exporter inventaire CSV</button>
      </div>
      <div className="modal fade" id="resInsert" tabIndex="-1">
        <div className="modal-dialog modal-dialog-scrolable">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className=" modal-title text-primary">Ajout d'objet</h3>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form onSubmit={resInsert}>
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
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Quantit&eacute; :</label>
                  </div>
                  <div className="col-md-8">
                    <input className="form-control" name="resqty" value={resqty} onChange={handleInputChange} />
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
            <th>Objet</th>
            <th>Prix</th>
            <th>Date d'ajout</th>
            <th>Localisation</th>
            <th>Quantit&eacute;</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          {res.map((item) => {
            return (
              <tr key={[item.MatID, item.LocID]}>
                <td>{item.material.MatName}</td>
                <td>{item.material.MatPrice} Ar</td>
                <td>{(new Date(item.material.MatDate)).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                <td>{item.location.LocName}</td>
                <td>{item.ResQty}</td>
                <td>{item.material.MatPrice * item.ResQty} Ar</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RealEstate;