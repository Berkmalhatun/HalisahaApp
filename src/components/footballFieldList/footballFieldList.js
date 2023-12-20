import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Pagination from "@mui/material/Pagination";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
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
import InfoIcon from "@mui/icons-material/Info";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import image from "./indir.jpg";
import "moment/locale/tr"; // Türkçe yerelleştirmeyi import edin
moment.locale("tr"); // Global olarak Türkçe yerelleştirmeyi ayarlayın
const FootballFieldsPage = () => {
  const [footballFields, setFootballFields] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingField, setEditingField] = useState({});
  const [openInspectModal, setOpenInspectModal] = useState(false);
  const [currentFieldId, setCurrentFieldId] = useState(null);
  const [rentTimes, setRentTimes] = useState([]);
  const localizer = momentLocalizer(moment);
  const [userDetails, setUserDetails] = useState({});
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fieldsPerPage = 6; // Her sayfada gösterilecek saha sayısı

  const indexOfLastField = currentPage * fieldsPerPage;
  const indexOfFirstField = indexOfLastField - fieldsPerPage;
  const currentFields = footballFields.slice(
    indexOfFirstField,
    indexOfLastField
  );

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  useEffect(() => {
    const fetchFootballFields = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        try {
          const response = await axios.get(
            `http://localhost:4042/football-field/get-footballfield?userid=${decoded.id}`,
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
  const handleInspectClick = async (fieldId) => {
    setCurrentFieldId(fieldId);
    try {
      const response = await fetch(
        `http://localhost:4042/rent-football-field/rent-football-field-hours-filter-filled?footballFieldId=${fieldId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API'den gelen veriler:", data);
      setRentTimes(data);
      setOpenInspectModal(true);
    } catch (error) {
      console.error("Doluluk bilgileri alınırken bir hata oluştu", error);
    }
  };
  const convertUTCtoTurkeyTime = (utcDate) => {
    const date = new Date(utcDate);
    // Türkiye için UTC+3 saat ekleyelim
    date.setUTCHours(date.getUTCHours() - 3);
    return date;
  };
  console.log("rentTimes:", rentTimes);
  const rentEvents = rentTimes.map((rentTime) => ({
    title: "Dolu",
    start: convertUTCtoTurkeyTime(rentTime.startDate),
    end: convertUTCtoTurkeyTime(rentTime.endDate),
    allDay: false,
    userId: rentTime.userid,
  }));
  const CustomAgendaEvent = ({ event }) => (
    <div>
      <span>{event.title}</span>{" "}
      <IconButton onClick={() => handleEventClick(event)}>
        <InfoIcon /> {/* Örnek: Bilgi ikonu */}
      </IconButton>
    </div>
  );
  const UserDetailsDialog = ({ open, onClose, userDetails }) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Kullanıcı Detayları</DialogTitle>
        <DialogContent>
          {/* Kullanıcı detaylarını burada gösterebilirsiniz */}
          <Typography>{userDetails?.name}</Typography>
          <Typography>{userDetails?.surname}</Typography>
          <Typography>{userDetails?.telNo}</Typography>
          <Typography>{userDetails?.email}</Typography>
          {/* Diğer kullanıcı detayları... */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Kapat</Button>
        </DialogActions>
      </Dialog>
    );
  };
  const handleEventClick = async (event) => {
    const userId = event.userId;
    if (userId) {
      try {
        const response = await axios.get(
          `http://localhost:4041/user/user-details?userid=${userId}`
        );
        setUserDetails({
          name: response.data.name,
          surname: response.data.surname,
          email: response.data.email,
          telNo: response.data.telNo,
        }); // Dönen tüm kullanıcı detaylarını state'e kaydedin
        setUserDetailsOpen(true); // Dialog'u açın
      } catch (error) {
        console.error("Kullanıcı detayları alınamadı:", error);
      }
    } else {
      console.error("Event objesinde userId tanımlı değil");
    }
  };

  // Dialog'u kapatmak için fonksiyon
  const handleUserDetailsClose = () => {
    setUserDetailsOpen(false);
  };
  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
      let s = localizer.format(start, "HH:mm", culture);
      let e = localizer.format(end, "HH:mm", culture);
      return `${s} - ${e}`;
    },
    agendaTimeRangeFormat: ({ start, end }, culture, localizer) => {
      let s = localizer.format(start, "HH:mm", culture);
      let e = localizer.format(end, "HH:mm", culture);
      return `${s} - ${e}`;
    },
    // Diğer formatlar gerekiyorsa buraya eklenebilir...
  };
  const messages = {
    agenda: "Ajanda",
    date: "Tarih",
    time: "Saat",
    event: "Uygunluk",
    today: 'Bugün',
   previous: 'Önce',
  next: 'Sonra',
    showMore: (total) => `+${total} daha göster`,
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Halı Sahalarım
      </Typography>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: "flex-start", alignItems: "stretch" }}
      >
        {currentFields.map((field) => (
          <Grid item xs={12} sm={6} md={4} key={field.id}>
           <Card sx={{ minWidth: 300, mb: 4, boxShadow: 3, minHeight: 200 }}>
              <IconButton
                onClick={() => handleInspectClick(field.id)}
                sx={{ ml: "auto" }}
              >
                <VisibilityIcon />
              </IconButton>
              <CardMedia
  component="img"
  sx={{ height: 140, width: '100%', objectFit: 'cover' }}
  image={image}
  alt={field.name}
/>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center" }}
                >
                  {field.name}
                </Typography>
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  {field.city}, {field.district}
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                <IconButton
                  onClick={() => handleEditClick(field.id)}
                  sx={{ ml: "auto" }}
                >
                  <EditIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'left', mt: 2 }}>
  <Pagination
    count={Math.ceil(footballFields.length / fieldsPerPage)}
    page={currentPage}
    onChange={handleChangePage}
    color="secondary"
  />
</Box>
      <Modal open={openInspectModal} onClose={() => setOpenInspectModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">{`Saha ID: ${currentFieldId} - Doluluk Bilgileri`}</Typography>
          <Calendar
            localizer={localizer}
            events={rentEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            messages={messages}
            views={["agenda"]}
            culture="tr"
            formats={formats}
            components={{
              agenda: {
                event: CustomAgendaEvent,
              },
            }}
            defaultView="agenda"
          />
        </Box>
      </Modal>
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
      <Dialog
        open={userDetailsOpen}
        onClose={handleUserDetailsClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Kullanıcı Detayları</DialogTitle>
        <DialogContent>
          <Card
            variant="outlined"
            sx={{ p: 2, display: "flex", alignItems: "center", mb: 2 }}
          >
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              {userDetails.name ? userDetails.name[0] : ""}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {userDetails.name} {userDetails.surname}
              </Typography>
              <Typography color="textSecondary">{userDetails.email}</Typography>
            </Box>
          </Card>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="E-posta" secondary={userDetails.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText
                primary="Telefon Numarası"
                secondary={userDetails.telNo}
              />
            </ListItem>
            {/* Buraya diğer bilgileri ekleyebilirsiniz */}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUserDetailsClose} color="primary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default FootballFieldsPage;
