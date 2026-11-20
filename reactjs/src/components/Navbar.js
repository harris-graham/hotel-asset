import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unameact, setUNameAct] = useState('');
  const [utypeact, setUTypeAct] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');

  useEffect(() => {
    refreshToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUNameAct(decoded.username);
      setUTypeAct(decoded.usertype);
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
      setUNameAct(decoded.username);
      setUTypeAct(decoded.usertype);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const Logout = async () => {
    try {
      await axios.delete('http://localhost:5000/logout');
      navigate("/");
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path ? 'active font-weight-bold text-white' : 'text-white-50';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top px-3">
      <Link className="navbar-brand font-weight-bold d-flex align-items-center" to="/dashboard">
        <i className="fas fa-hotel fa-lg mr-2"></i>
        <span>HOTEL ASSET</span>
        <span className="badge badge-light text-primary ml-2 small" style={{ fontSize: '0.65rem' }}>PRO v2.0</span>
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navContent" aria-controls="navContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">
              <i className="fas fa-chart-line mr-1"></i>Tableau de Bord
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/material')}`} to="/material">
              <i className="fas fa-boxes mr-1"></i>Matériels
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/location')}`} to="/location">
              <i className="fas fa-door-open mr-1"></i>Chambres & Emplacements
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/realestate')}`} to="/realestate">
              <i className="fas fa-warehouse mr-1"></i>Inventaire par Pièce
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/transfert')}`} to="/transfert">
              <i className="fas fa-exchange-alt mr-1"></i>Transferts
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/outstock')}`} to="/outstock">
              <i className="fas fa-trash-alt mr-1"></i>Mise au Rebut
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/maintenance')}`} to="/maintenance">
              <i className="fas fa-tools mr-1"></i>Maintenance
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/depreciation')}`} to="/depreciation">
              <i className="fas fa-calculator mr-1"></i>Amortissement
            </Link>
          </li>
          {utypeact === 'Admin' && (
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/user')}`} to="/user">
                <i className="fas fa-users-cog mr-1"></i>Utilisateurs
              </Link>
            </li>
          )}
        </ul>

        <ul className="navbar-nav ml-auto align-items-center">
          <li className="nav-item mr-3">
            <span className="badge badge-light text-primary px-3 py-2 font-weight-bold">
              <i className="fas fa-user-circle mr-1"></i>
              {unameact || 'Utilisateur'} ({utypeact || 'Staff'})
            </span>
          </li>
          <li className="nav-item">
            <button onClick={Logout} className="btn btn-sm btn-outline-light font-weight-bold shadow-sm">
              <i className="fas fa-sign-out-alt mr-1"></i>Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
