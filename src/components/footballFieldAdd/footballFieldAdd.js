import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const FootballFieldForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    telephoneNumber: "",
    city: "",
    district: "",
    address: "",
    price: "",
    email: "",
    userid: "", // Token'dan alınacak
    image: null,
  });
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  useEffect(() => {
    fetch("http://localhost:4042/city/{cities}/city")
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);
  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:4042/city/${selectedCity}/districts`)
        .then((response) => response.json())
        .then((data) => {
          setDistricts(data); 
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    }

    setSelectedDistrict("");
  }, [selectedCity]);
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setFormData({ ...formData, city: event.target.value });
    setSelectedDistrict(""); 
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setFormData({ ...formData, district: event.target.value });
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setFormData((prevFormData) => ({
        ...prevFormData,
        userid: decoded.id,
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
      const response = await fetch(
        "http://localhost:4041/user/create-football-field",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Halı saha başarıyla eklendi!',
        confirmButtonText: 'Harika!'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Halı saha eklenirken bir hata oluştu.',
        confirmButtonText: 'Tamam'
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4, p: 3, bgcolor: "white" }}>
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Şehir</InputLabel>
            <Select
              value={selectedCity}
              onChange={handleCityChange}
              label="Şehir"
              name="city"
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>İlçe</InputLabel>
            <Select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              label="İlçe"
              name="district"
            >
              {districts.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
