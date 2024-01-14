import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const checkTokenValidity = async () => {
      try {
        const response = await fetch('http://localhost:4040/auth/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Token is invalid');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    if (token) {
      checkTokenValidity();
    } else {
      navigate('/login');
    }
  }, [navigate]);
  return <>{children}</>;
};

export default ProtectedRoute;
