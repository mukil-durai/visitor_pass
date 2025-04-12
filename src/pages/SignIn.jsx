import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = (e) => {
    e.preventDefault();
    if (email === 'mukild.22it@kongu.edu' && password === 'mukil@16') {
      login();
      alert('Sign-in successful!');
      navigate('/');
    } else {
      alert('Invalid email or password.');
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-lg-4 col-md-6 col-sm-10">
          <div className="card shadow border-0 rounded-lg">
            <div className="card-header text-center py-3 bg-primary text-white">
              <h2 className="mb-0">Sign In</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSignIn}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="Enter your password"
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">Sign In</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;