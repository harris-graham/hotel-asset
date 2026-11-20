import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUserName] = useState('');
  const [userpword, setUserPword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/login`, {
        username,
        userpword
      });
      navigate("/realestate");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  }

  return (
    <div className="container-fluid">
      <div className="card col-md-4 mx-auto mt-5">
        <div className="card-header">
          <h1 className="text-primary">CONNEXION</h1>
        </div>
        <form onSubmit={Auth} className="box">
          <div className="card-body">
            <div className="col-md-9 mx-auto mb-3">
              <input type="text" className="form-control" placeholder="Utilisateur" value={username} onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div className="col-md-9 mx-auto">
              <input type="password" className="form-control" placeholder="Mot de passe" value={userpword} onChange={(e) => setUserPword(e.target.value)} />
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary">Se connecter</button>
          </div>
          <p className="text-danger">{msg}</p>
        </form>
      </div>
    </div>
  )
}

export default Login;