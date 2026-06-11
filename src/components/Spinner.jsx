import React from "react";
import "../style/Spinner.css";

// Branded loading spinner used for full-view loads where a skeleton doesn't fit
// (e.g. the initial app boot / route gates).
const Spinner = ({ label, fullscreen = false }) => (
  <div className={`spotter-spinner-wrap${fullscreen ? " fullscreen" : ""}`}>
    <div className="spotter-spinner" aria-label="Loading" role="status" />
    {label && <div className="spotter-spinner-label">{label}</div>}
  </div>
);

export default Spinner;
