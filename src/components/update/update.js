import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Paper, Typography } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';
const UpdateUserPage = () => {
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    surname: '',
    email: '',
    telNo: '',
    role: ''
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        try {
          const response = await fetch(`http://localhost:4040/auth/user-details?id=${decodedToken.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new TypeError("Sunucudan gelen yanıt JSON formatında değil");
            }
  
            const data = await response.json();
            setUserData({ ...data, id: jwtDecode(token).id, role: jwtDecode(token).role });
          } else {
            throw new Error('Kullanıcı bilgileri alınamadı.');
          }
        } catch (error) {
          console.error('Hata:', error);
          alert('Hata: ' + error.message);
        }
      }
    };
  
    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4040/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Güncelleme işlemi başarısız.');
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: data.message || 'Bilgileriniz başarıyla güncellendi.',
        confirmButtonText: 'Tamam'
      });
    } catch (error) {
      // Hata popup
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Güncelleme işlemi sırasında bir hata oluştu: ' + error.message,
        confirmButtonText: 'Tamam'
      });
    }
  };

  return (
    <Container component={Paper} maxWidth="m" sx={{ p: 4, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Kullanıcı Bilgilerini Güncelle
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Ad"
          name="name"
          value={userData.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Soyad"
          name="surname"
          value={userData.surname}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="E-posta"
          name="email"
          value={userData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Telefon Numarası"
          name="telNo"
          value={userData.telNo}
          onChange={handleChange}
          margin="normal"
        />
        {/* ID ve Rol bilgileri kullanıcıdan alınmamalı ve değiştirilememeli */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, "&:hover": { bgcolor: "secondary.dark" },
          }}
        >
          Güncelle
        </Button>
      </form>
    </Container>
  );
};

export default UpdateUserPage;
