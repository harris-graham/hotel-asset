/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const [useract, setUserAct] = useState('');
  const [usertype, setUserType] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalAssetValue: 0,
    totalUnits: 0,
    totalLocations: 0,
    totalEntities: 0,
    activeMaintenance: 0,
    totalTransfers: 0,
    totalOutStocks: 0,
    allocationByLocation: [],
    categoryBreakdown: [],
    recentTransfers: []
  });
  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    fetchStats();
    fetchValuation();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUserAct(decoded.username);
      setUserType(decoded.usertype);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboardStats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading stats:", error);
      setLoading(false);
    }
  };

  const fetchValuation = async () => {
    try {
      const response = await axios.get('http://localhost:5000/depreciationReport');
      setValuation(response.data.summary);
    } catch (error) {
      console.error("Error loading valuation:", error);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  };

  return (
    <div className="container-fluid py-4 px-md-5">
      {/* Header and Welcome */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="h3 font-weight-bold text-gray-800 mb-1">
            <i className="fas fa-chart-pie text-primary mr-2"></i>Tableau de Bord des Immobilisations
          </h2>
          <p className="text-muted small mb-0">
            Bienvenue, <strong>{useract}</strong> &bull; Rôle : <span className="badge badge-primary">{usertype}</span> &bull; Système de suivi d'actifs hôteliers.
          </p>
        </div>
        <div className="mt-3 mt-sm-0">
          <Link to="/material" className="btn btn-sm btn-primary shadow-sm mr-2 font-weight-bold">
            <i className="fas fa-plus mr-1"></i>Nouvel Équipement
          </Link>
          <Link to="/transfert" className="btn btn-sm btn-success shadow-sm mr-2 font-weight-bold">
            <i className="fas fa-exchange-alt mr-1"></i>Transférer
          </Link>
          <Link to="/maintenance" className="btn btn-sm btn-warning shadow-sm font-weight-bold">
            <i className="fas fa-tools mr-1"></i>Maintenance
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row mb-4">
        {/* Total Assets Catalog */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow-sm h-100 py-3" style={{ borderLeft: '4px solid #4e73df' }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Catalogue Matériels</div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">{stats.totalMaterials} modèles</div>
                  <small className="text-muted">{stats.totalUnits} unités en inventaire</small>
                </div>
                <div className="col-auto">
                  <i className="fas fa-boxes fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Valuation */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow-sm h-100 py-3" style={{ borderLeft: '4px solid #1cc88a' }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Valeur Totale d'Acquisition</div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">{formatCurrency(stats.totalAssetValue)}</div>
                  <small className="text-muted"><Link to="/depreciation" className="text-success">Voir amortissements &rarr;</Link></small>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Locations / Rooms */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow-sm h-100 py-3" style={{ borderLeft: '4px solid #36b9cc' }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Chambres & Emplacements</div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">{stats.totalLocations} pièces</div>
                  <small className="text-muted">{stats.totalEntities} bâtiments / pavillons</small>
                </div>
                <div className="col-auto">
                  <i className="fas fa-door-open fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Maintenance */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow-sm h-100 py-3" style={{ borderLeft: '4px solid #f6c23e' }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Maintenance Active</div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">{stats.activeMaintenance} interventions</div>
                  <small className="text-muted"><Link to="/maintenance" className="text-warning">Gérer réparations &rarr;</Link></small>
                </div>
                <div className="col-auto">
                  <i className="fas fa-tools fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {valuation && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h6 className="font-weight-bold text-primary">Coût d'origine vs valeur nette comptable</h6>
            <div className="small text-muted mb-2">
              Origine {formatCurrency(valuation.totalInitialCost)} · VNC {formatCurrency(valuation.totalCurrentBookValue)}
            </div>
            <div className="progress mb-2" style={{ height: "16px" }}>
              <div className="progress-bar" style={{ width: "100%" }}>Coût</div>
            </div>
            <div className="progress" style={{ height: "16px" }}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${valuation.totalInitialCost > 0 ? Math.max(4, (valuation.totalCurrentBookValue / valuation.totalInitialCost) * 100) : 0}%` }}
              >
                VNC
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tables and Distributions */}
      <div className="row">
        {/* Rooms Inventory Density */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-hotel mr-2"></i>Répartition des Actifs par Chambre / Emplacement
              </h6>
              <Link to="/realestate" className="btn btn-sm btn-outline-primary">
                Inventaire Complet
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="thead-light">
                    <tr>
                      <th>Emplacement</th>
                      <th className="text-center">Quantité d'Équipements</th>
                      <th className="text-right">Valeur Estimée</th>
                      <th className="text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.allocationByLocation.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          Aucun actif alloué pour l'instant.
                        </td>
                      </tr>
                    ) : (
                      stats.allocationByLocation.map((loc, idx) => (
                        <tr key={idx}>
                          <td className="font-weight-bold align-middle">
                            <span className="badge mr-2" style={{ backgroundColor: loc.LocColor, width: '12px', height: '12px', display: 'inline-block', borderRadius: '50%' }}></span>
                            {loc.LocName}
                          </td>
                          <td className="text-center font-weight-bold align-middle">
                            <span className="badge badge-light border px-2 py-1">{loc.totalItems} articles</span>
                          </td>
                          <td className="text-right font-weight-bold text-dark align-middle">
                            {formatCurrency(loc.roomValue)}
                          </td>
                          <td className="text-center align-middle">
                            <span className={`badge ${loc.totalItems > 0 ? 'badge-success' : 'badge-secondary'}`}>
                              {loc.totalItems > 0 ? 'Équipée' : 'Inoccupée'}
                            </span>
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

        {/* Categories Breakdown and Quick Stats */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-tags mr-2"></i>Répartition par Catégories
              </h6>
            </div>
            <div className="card-body">
              {stats.categoryBreakdown.length === 0 ? (
                <p className="text-muted text-center my-3">Aucune catégorie répertoriée.</p>
              ) : (
                stats.categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="d-flex justify-content-between small font-weight-bold text-dark mb-1">
                      <span>{cat.Category} ({cat.count})</span>
                      <span>{formatCurrency(cat.value)}</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${Math.min(100, (cat.count / Math.max(1, stats.totalMaterials)) * 100)}%` }}
                        aria-valuenow={cat.count}
                        aria-valuemin="0"
                        aria-valuemax={stats.totalMaterials}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Operations Helper */}
          <div className="card shadow-sm border-left-info" style={{ borderLeft: '4px solid #36b9cc' }}>
            <div className="card-body">
              <h6 className="font-weight-bold text-dark mb-2">
                <i className="fas fa-info-circle text-info mr-1"></i>Audit & Traçabilité
              </h6>
              <p className="small text-muted mb-2">
                Total des transferts inter-pièces enregistrés : <strong>{stats.totalTransfers}</strong>.<br />
                Total des sorties et mises au rebut : <strong>{stats.totalOutStocks}</strong>.
              </p>
              <ul className="list-unstyled small mb-3">
                {(stats.recentTransfers || []).slice(0, 4).map((move) => (
                  <li key={move.TransID} className="mb-1">
                    <strong>{move.MatName}</strong> ×{move.TransQty}<br />
                    <span className="text-muted">{move.FromRoom} → {move.ToRoom}</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between">
                <Link to="/transfert" className="btn btn-sm btn-outline-info font-weight-bold">Historique Transferts</Link>
                <Link to="/outstock" className="btn btn-sm btn-outline-danger font-weight-bold">Historique Rebuts</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
