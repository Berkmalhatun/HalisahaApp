import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  IconButton,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EditIcon from "@mui/icons-material/Edit";
import image from "./indir.jpg";
const FootballFieldsPage = () => {
  const [footballFields, setFootballFields] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingField, setEditingField] = useState({});


  
  useEffect(() => {
    const fetchFootballFields = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        try {
          const response = await axios.get(
            "http://localhost:4042/football-field/get-footballfield",
            {
              params: { userid: decoded.userid },
            }
          );
          setFootballFields(response.data);
        } catch (error) {
          console.error("Halı saha bilgileri alınırken bir hata oluştu", error);
        }
      }
    };

    fetchFootballFields();
  }, []);

  const handleEditClick = (fieldId) => {
    // footballFields dizisinden seçilen sahanın tüm bilgilerini bul
    const fieldToEdit = footballFields.find((field) => field.id === fieldId);
    if (fieldToEdit) {
      setEditingField({ ...fieldToEdit });
      setOpenModal(true);
    } else {
      // Hata işleme: Seçilen saha bulunamadı
      console.error("Seçilen saha bulunamadı");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    setEditingField({ ...editingField, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:4042/football-field/update-footballfield",
        {
          method: "PUT", // veya 'POST', API'nizin beklediği yönteme göre
          headers: {
            "Content-Type": "application/json",
            // Gerekirse diğer başlıklar veya yetkilendirme token'ı
          },
          body: JSON.stringify(editingField),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Güncelleme başarılı:", data);
      // Başarılı işlem uyarısı
      setOpenModal(false); // Modalı kapat
    } catch (error) {
      console.error("Güncelleme sırasında hata:", error);
      // Başarısız işlem uyarısı
    }
  };
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
      Halı Sahalarım
    </Typography>
    <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
      {footballFields.map((field) => (
        <Grid item xs={12} sm={6} md={4} lg={6} key={field.id} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ maxWidth: 345, mb: 4, boxShadow: 3 }}>
            <CardMedia
              component="img"
              height="140"
              image={image} // Sahaya ait resim URL'si ile değiştirin
              alt={field.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
                {field.name}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                {field.city}, {field.district}
              </Typography>
            </CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
              <IconButton onClick={() => handleEditClick(field.id)}
              sx={{ml: "auto"}}>
                <EditIcon />
              </IconButton>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Halı Saha Bilgilerini Düzenle</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Saha Adı"
              name="name"
              value={editingField.name || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Telefon Numarası"
              name="telephoneNumber"
              value={editingField.telephoneNumber || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Şehir"
              name="city"
              value={editingField.city || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="İlçe"
              name="district"
              value={editingField.district || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Adres"
              name="address"
              value={editingField.address || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Fiyat"
              name="price"
              type="number"
              value={editingField.price || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="E-mail"
              name="email"
              value={editingField.email || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Güncelle
            </Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default FootballFieldsPage;
