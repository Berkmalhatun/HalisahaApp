import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { TextField, Button, Container, Typography, Box, Card, CardContent } from '@mui/material';

const FootballFieldForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    telephoneNumber: '',
    city: '',
    district: '',
    address: '',
    price: '',
    email: '', 
    userid: '', // Token'dan alınacak
    image: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setFormData(prevFormData => ({
        ...prevFormData,
        userid: decoded.id
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://localhost:4041/user/create-football-field', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      alert('Halı saha başarıyla eklendi!');
    } catch (error) {
      console.error('Halı saha eklerken bir hata oluştu', error);
      alert('Halı saha eklenirken bir hata oluştu.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4,p:3, bgcolor:"white" }}>
        <Typography variant="h4" gutterBottom>
          Halı Saha Ekle
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Saha Adı"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={handleInputChange}
          />
          <TextField
            label="Telefon Numarası"
            name="telephoneNumber"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={handleInputChange}
          />
                    <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={handleInputChange}
          />
          <TextField
            label="Şehir"
            name="city"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={handleInputChange}
          />
          <TextField
            label="İlçe"
            name="district"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={handleInputChange}
          />
          <TextField
            label="Adres"
            name="address"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={handleInputChange}
          />
          <TextField
            label="Fiyat"
            name="price"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={handleInputChange}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Ekle
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default FootballFieldForm;