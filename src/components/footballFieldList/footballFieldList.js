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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DatePicker, { registerLocale } from "react-datepicker";
import tr from 'date-fns/locale/tr';
import "react-datepicker/dist/react-datepicker.css";
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
  Paper,
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
registerLocale('tr', tr);
const initialHours = Array.from({ length: 24 }, (_, index) => ({
  label: `${index}:00 - ${index + 1}:00`,
  value: index,
  isOccupied: false, // Bu özellik daha sonra saatlerin dolu olup olmadığını belirlemek için kullanılabilir
}));

const TimeSlotButton = ({ hour, index, onSelect, isSelected, isOccupied }) => {
  const buttonStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: isOccupied ? '#f44336' : isSelected ? '#4caf50' : undefined,
    color: isOccupied ? '#fff' : isSelected ? '#fff' : undefined,
    borderColor: isSelected ? '#4caf50' : undefined,
  };

  return (
    <Button
      variant={isSelected ? "contained" : "outlined"}
      style={buttonStyle}
      disabled={isOccupied}
      onClick={() => onSelect(index)}
    >
      {hour.label}
    </Button>
  );
};
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
  const [openGuestRentDialog, setOpenGuestRentDialog] = useState(false);
  const [selectedFootballFieldId, setSelectedFootballFieldId] = useState(null);
  const [hours, setHours] = useState(initialHours); // Saat aralıkları için state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(hours[0].label);
const [openDialog, setOpenDialog] = useState(false);
const [activeHourIndex, setActiveHourIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const fieldsPerPage = 6; // Her sayfada gösterilecek saha sayısı

  const indexOfLastField = currentPage * fieldsPerPage;
  const indexOfFirstField = indexOfLastField - fieldsPerPage;
  const currentFields = footballFields.slice(
    indexOfFirstField,
    indexOfLastField
  );
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    telNo: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const handleHourClick = (index) => {
    const hour = hours[index];
    if (!hour.isOccupied) {
      setSelectedHour(hour.label);
      setActiveHourIndex(index); // Seçili olan saat diliminin index'ini state'e kaydet
    } else {
      alert('Bu saat aralığı doludur. Lütfen başka bir saat seçin.');
    }
  };
  const handleDateTimeChange = (dateTime) => {
    setSelectedDateTime(dateTime);
  };
  const handleOpenGuestRentDialog = (fieldId) => {
    console.log("Diyalog açılıyor, saha ID:", fieldId);
    setSelectedFootballFieldId(fieldId);
    fetchAndMarkOccupiedHours(fieldId, selectedDate);
    setOpenGuestRentDialog(true);
};

  const handleCloseGuestRentDialog = () => {
    setOpenGuestRentDialog(false);
  };
  const fetchAndMarkOccupiedHours = async (fieldId, date) => {
    try {
      const response = await fetch(
        `http://localhost:4042/rent-football-field/rent-football-field-hours-filter-filled?footballFieldId=${fieldId}`
      );
      if (response.ok) {
        const occupiedHours = await response.json();
        markOccupiedHours(occupiedHours, date);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    // selectedDate değiştiğinde bu fonksiyon çalışır
    const fetchOccupiedHours = async () => {
      if (selectedFootballFieldId) {
        try {
          const response = await fetch(
            `http://localhost:4042/rent-football-field/rent-football-field-hours-filter-filled?footballFieldId=${selectedFootballFieldId}`
          );
          if (response.ok) {
            const occupiedHours = await response.json();
            markOccupiedHours(occupiedHours, selectedDate);
          } else {
            console.error("Error:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
  
    fetchOccupiedHours();
  }, [selectedDate, selectedFootballFieldId]); // Bu useEffect, selectedDate veya selectedFootballFieldId değiştiğinde çalışır
  
  
  const convertToLocaleTime = (dateString) => {
    const dateUTC = new Date(dateString);
    return new Date(dateUTC.getTime() + dateUTC.getTimezoneOffset() * 60000);
  };
  const markOccupiedHours = (occupiedHours, selectedDate) => {
    const updatedHours = initialHours.map((hour) => {
      const hourRange = hour.label.split(" - ");
      const startHour = parseInt(hourRange[0], 10);

      const isOccupied = occupiedHours.some((occupiedHour) => {
        const startDateLocal = convertToLocaleTime(occupiedHour.startDate);
        // const endDateLocal = convertToLocaleTime(occupiedHour.endDate);

        return (
          startDateLocal.getDate() === selectedDate.getDate() &&
          startDateLocal.getMonth() === selectedDate.getMonth() &&
          startDateLocal.getFullYear() === selectedDate.getFullYear() &&
          startDateLocal.getHours() === startHour
        );
      });

      return {
        ...hour,
        isOccupied: isOccupied,
      };
    });

    setHours(updatedHours);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setActiveHourIndex(null); // Tarih değiştiğinde seçili saati sıfırlayalım
    fetchAndMarkOccupiedHours(selectedFootballFieldId, date);
  };
  const renderTimeSlots = () => {
    return (
      <Grid container spacing={2}>
        {hours.map((hour, index) => (
          <Grid item xs={4} sm={2} key={hour.label}>
            <TimeSlotButton
              hour={hour}
              index={index}
              isSelected={activeHourIndex === index}
              isOccupied={hour.isOccupied}
              onSelect={handleHourClick}
            />
          </Grid>
        ))}
      </Grid>
    );
  };
  // Saat Aralığı Seçimi
const handleHourSelection = (index) => {
  const newHours = [...hours];
  newHours[index].isOccupied = !newHours[index].isOccupied; // Bu örnek sadece dolu/boş durumunu değiştirir
  setHours(newHours);
};
const renderGuestRentDialog = () => (
  <Dialog open={openGuestRentDialog} onClose={handleCloseGuestRentDialog} fullWidth maxWidth="md">
    <DialogTitle>Misafir Kiralama</DialogTitle>
    <form onSubmit={handleGuestRentSubmit}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              value={formData.name}
              onChange={handleChange}
              label="İsim"
              fullWidth
              margin="normal"
              required
              error={!formData.name}
              helperText={!formData.name ? "İsim alanı zorunludur." : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              label="Soyisim"
              fullWidth
              margin="normal"
              required
              error={!formData.surname}
              helperText={!formData.surname ? "Soyisim alanı zorunludur." : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="telNo"
              value={formData.telNo}
              onChange={handleChange}
              label="Telefon Numarası"
              fullWidth
              margin="normal"
              error={!formData.telNo && !formData.email}
              helperText={!formData.telNo && !formData.email ? "Telefon veya email zorunludur." : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              value={formData.email}
              onChange={handleChange}
              label="Email"
              fullWidth
              margin="normal"
              error={!formData.telNo && !formData.email}
              helperText={!formData.telNo && !formData.email ? "Telefon veya email zorunludur." : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              selected={selectedDate} onDateChange={handleDateChange}
              onChange={handleDateChange}
              locale="tr"
              dateFormat="dd/MM/yyyy"
              customInput={<TextField fullWidth required />}
              wrapperClassName="datePicker"
            />
          </Grid>
          <Grid item xs={12}>
            {renderTimeSlots()}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseGuestRentDialog} color="primary">İptal</Button>
        <Button type="submit" variant="contained" color="primary">Kiralama Yap</Button>
      </DialogActions>
    </form>
  </Dialog>
);
// footballFieldid: selectedFootballFieldId, // Bu ID'yi nasıl elde ettiğinize göre ayarlayın
const handleGuestRentSubmit = async (e) => {
  e.preventDefault();
  // Telefon veya email alanlarından en az biri doldurulmuş mu diye kontrol et
  if (!formData.telNo && !formData.email) {
    alert('Telefon numarası veya email adresi alanlarından en az birini doldurmalısınız.');
    return;
  }

  // Seçilen saat aralığını ve tarihi kullanarak UTC'de startDate ve endDate oluşturun
  const [startHour, endHour] = selectedHour.split(' - ').map(h => parseInt(h, 10));
  const startDateUTC = new Date(Date.UTC(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    startHour,
    0,
    0
  ));
  const endDateUTC = new Date(Date.UTC(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    endHour,
    0,
    0
  ));
  // API isteği için payload oluşturma
  const payload = {
    startDate: startDateUTC.toISOString(),
    endDate: endDateUTC.toISOString(),
    footballFieldid: selectedFootballFieldId,
    ...formData
  };

  // Gönderilecek verileri konsolda göster
  console.log("Gönderilecek payload:", payload);
  console.log("Kiralanan saat:", selectedHour, "Tarih:", selectedDate.toLocaleString());

  // API isteği yapma
  try {
    const response = await fetch("http://localhost:4042/rent-football-field/rent-football-field-guest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      await fetchAndMarkOccupiedHours(selectedFootballFieldId, selectedDate);
      const responseData = await response.json();
      console.log("Kiralama başarılı:", responseData);
      alert("Kiralama başarılı!");
    } else {
      throw new Error(`API hatası: ${response.status}`);
    }
  } catch (error) {
    console.error("Kiralama işlemi sırasında hata oluştu:", error);
    alert("Kiralama sırasında bir hata oluştu.");
  }
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
  // Userid boş ise bu methoddan donen veriler kullanılacak.
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
  const handleGuestRentClick = (fieldId) => {
    // Misafir kiralama formunu açma veya başka bir işlem yapma
    console.log("Misafir olarak kiralama işlemi için saha ID:", fieldId);
    setOpenDialog(true);
    // İşlemler...
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
              <IconButton onClick={() => handleOpenGuestRentDialog(field.id)} sx={{ ml: "auto" }}>
      <PersonAddIcon />
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
         {renderGuestRentDialog()}
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
