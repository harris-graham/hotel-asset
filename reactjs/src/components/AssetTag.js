import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

const AssetTag = ({ tag, onClose }) => {
  const cardRef = useRef(null);
  if (!tag) return null;

  const payload = `hotel-asset:${tag.kind}:${tag.id}`;

  const printTag = () => {
    const svg = cardRef.current?.querySelector("svg");
    const win = window.open("", "_blank", "noopener,noreferrer,width=420,height=560");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>${tag.title}</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; margin: 24px; }
        .card { border: 2px solid #1f2937; border-radius: 12px; padding: 16px; display: inline-block; }
        h1 { font-size: 18px; margin: 8px 0 4px; }
        p { margin: 0; color: #4b5563; font-size: 13px; }
        .id { margin-top: 8px; font-weight: bold; letter-spacing: 0.04em; }
      </style></head><body>
      <div class="card">
        <p>HOTEL ASSET</p>
        ${svg ? svg.outerHTML : ""}
        <h1>${tag.title}</h1>
        <p>${tag.subtitle || ""}</p>
        <div class="id">${payload}</div>
      </div>
      <script>window.onload = function () { window.print(); };</script>
      </body></html>`);
    win.document.close();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Étiquette QR</h5>
            <button type="button" className="btn-close" aria-label="Fermer" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center" ref={cardRef}>
            <QRCodeSVG value={payload} size={180} includeMargin />
            <h6 className="mt-3 mb-1">{tag.title}</h6>
            <p className="text-muted small mb-0">{tag.subtitle}</p>
            <p className="small font-weight-bold mt-2 mb-0">{payload}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={printTag}>Imprimer</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Fermer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetTag;
