import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import 'bulma/css/bulma.css';
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Location from "./components/Location";
import Material from "./components/Material";
import OutStock from "./components/OutStock";
import RealEstate from "./components/RealEstate";
import Transfert from "./components/Transfert";
import User from "./components/User";
import Maintenance from "./components/Maintenance";
import Depreciation from "./components/Depreciation";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
          <Route path="/location" element={<><Navbar /><Location /></>} />
          <Route path="/material" element={<><Navbar /><Material /></>} />
          <Route path="/outstock" element={<><Navbar /><OutStock /></>} />
          <Route path="/realestate" element={<><Navbar /><RealEstate /></>} />
          <Route path="/transfert" element={<><Navbar /><Transfert /></>} />
          <Route path="/user" element={<><Navbar /><User /></>} />
          <Route path="/maintenance" element={<><Navbar /><Maintenance /></>} />
          <Route path="/depreciation" element={<><Navbar /><Depreciation /></>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
