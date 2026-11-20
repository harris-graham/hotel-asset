/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { downloadCsv } from "../utils/csv";

const Depreciation = () => {
  const [report, setReport] = useState({ summary: {}, assets: [] });
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    fetchReport();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      jwt_decode(response.data.accessToken);
    } catch (error) {
      if (error.response) navigate("/");
    }
  };

  const fetchReport = async () => {
    try {
      const response = await axios.get("http://localhost:5000/depreciationReport");
      setReport(response.data);
    } catch (error) {
      console.error("Error loading depreciation report:", error);
    }
  };

  const money = (value) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD" }).format(value || 0);

  const assets = (report.assets || []).filter((asset) =>
    asset.MatName.toLowerCase().includes(filter.toLowerCase())
  );

  const exportReport = () => {
    downloadCsv("depreciation-report.csv", [
      ["ID", "Asset", "Category", "Acquired", "Cost", "Salvage", "LifeYears", "AgeYears", "Annual", "Accumulated", "BookValue", "Status"],
      ...assets.map((asset) => [
        asset.MatID,
        asset.MatName,
        asset.Category,
        asset.MatDate ? String(asset.MatDate).slice(0, 10) : "",
        asset.InitialPrice,
        asset.SalvageValue,
        asset.UsefulLifeYears,
        asset.AgeYears,
        asset.AnnualDepreciation,
        asset.AccumulatedDepreciation,
        asset.CurrentBookValue,
        asset.Status
      ])
    ]);
  };

  const summary = report.summary || {};
  const cost = summary.totalInitialCost || 0;
  const book = summary.totalCurrentBookValue || 0;
  const bookWidth = cost > 0 ? Math.max(4, (book / cost) * 100) : 0;

  return (
    <div className="container-fluid py-4 px-md-5">
      <div className="d-sm-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="h3 font-weight-bold mb-1">Amortissement linéaire</h2>
          <p className="text-muted small mb-0">
            Valeur nette comptable = coût d'acquisition − amortissement cumulé, plancher à la valeur résiduelle.
          </p>
        </div>
        <div className="mt-3 mt-sm-0">
          <button className="btn btn-sm btn-outline-secondary mr-2" onClick={() => window.print()}>Imprimer</button>
          <button className="btn btn-sm btn-primary" onClick={exportReport}>Exporter CSV</button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100"><div className="card-body">
            <div className="text-muted small text-uppercase">Coût d'acquisition</div>
            <div className="h4 mb-0">{money(summary.totalInitialCost)}</div>
          </div></div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100"><div className="card-body">
            <div className="text-muted small text-uppercase">Amortissement cumulé</div>
            <div className="h4 mb-0">{money(summary.totalAccumulatedDepreciation)}</div>
          </div></div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100"><div className="card-body">
            <div className="text-muted small text-uppercase">Valeur nette comptable</div>
            <div className="h4 mb-0 text-success">{money(summary.totalCurrentBookValue)}</div>
          </div></div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="small font-weight-bold mb-1">Valeur nette / coût d'origine</div>
          <div className="progress" style={{ height: "18px" }}>
            <div className="progress-bar bg-success" style={{ width: `${bookWidth}%` }}>
              {cost > 0 ? `${Math.round((book / cost) * 100)}%` : "0%"}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <strong>Plan d'amortissement</strong>
          <input
            className="form-control form-control-sm"
            style={{ maxWidth: 240 }}
            placeholder="Filtrer un équipement"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-sm mb-0">
            <thead className="thead-light">
              <tr>
                <th>Équipement</th>
                <th>Acquis</th>
                <th className="text-right">Coût</th>
                <th className="text-right">Annuel</th>
                <th className="text-right">Cumulé</th>
                <th className="text-right">VNC</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted py-4">Aucun équipement.</td></tr>
              ) : assets.map((asset) => (
                <tr key={asset.MatID}>
                  <td>
                    <div className="font-weight-bold">{asset.MatName}</div>
                    <small className="text-muted">{asset.Category || "General"} · {asset.UsefulLifeYears} ans · âge {asset.AgeYears}</small>
                  </td>
                  <td>{asset.MatDate ? String(asset.MatDate).slice(0, 10) : "—"}</td>
                  <td className="text-right">{money(asset.InitialPrice)}</td>
                  <td className="text-right">{money(asset.AnnualDepreciation)}</td>
                  <td className="text-right">{money(asset.AccumulatedDepreciation)}</td>
                  <td className="text-right font-weight-bold">{money(asset.CurrentBookValue)}</td>
                  <td>
                    <span className={`badge ${asset.Status === "Fully Depreciated" ? "badge-secondary" : "badge-success"}`}>
                      {asset.Status === "Fully Depreciated" ? "Amorti" : "En cours"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Depreciation;
