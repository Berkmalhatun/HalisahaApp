import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import './login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  }); 
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const loginData = {
        email,
        password,
      };
      const response = await fetch('http://localhost:4040/auth/dologin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), 
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setSnackbar({ open: true, message: 'Giriş başarılı' });
        setTimeout(() => {
          setSnackbar({ open: false, message: '' });
          navigate('/home');
        }, 2000);
      } else {
        setSnackbar({ open: true, message: 'Kullanıcı adı veya parola hatalı' });
        setTimeout(() => {
          setSnackbar({ open: false, message: '' });
        }, 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setSnackbar({ open: true, message: 'Giriş işlemi sırasında bir hata oluştu' });
      setTimeout(() => {
        setSnackbar({ open: false, message: '' });
      }, 2000);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  return (
    <div className="login-container">
      <div className="login-content">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">login</button>
          <div className="register-redirect">
          Henüz hesabın yok mu? <Link to="/register" className="register-link">Üye ol</Link>
        </div>
        </form>

      </div>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </div>
  );
}

export default LoginPage;
