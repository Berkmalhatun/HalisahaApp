import React, { useState, useEffect } from 'react';
import {Card, CardContent, CardActions, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions , Pagination,IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; 
import {jwtDecode} from 'jwt-decode';
import './history.css';

const RentalHistoryPage = () => {
  const [rentals, setRentals] = useState([]);
  const [fieldDetails, setFieldDetails] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userid = decodedToken.id;

        const response = await fetch(`http://localhost:4042/rent-football-field/rent-football-field-history?userid=${userid}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRentals(data);
      } catch (error) {
        console.error("Rental history fetch error:", error);
      }
    };

    fetchRentals();
  }, []);

//   bu method db deb dogru gelen verıyı 3 saat ılerı sekılde ekrana yazdırdıgı ıcın yazıldı .
  const formatToLocalTime = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString('tr-TR', { timeZone: 'UTC' });
  };
  const handleViewDetails = async (footballFieldid) => {
    try {
      // footballFieldid kullanarak detayları çek
      const response = await fetch(`http://localhost:4042/football-field/find-footballfield?id=${footballFieldid}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setFieldDetails(data); // Alınan detayları state'e kaydet
      setOpenDialog(true);    // Detayları göstermek için modalı aç
    } catch (error) {
      console.error("Football field details fetch error:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  const currentRentals = rentals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCancel = async (rentalID) => {
    console.log('Cancelling rental with ID:', rentalID); // ID'yi kontrol etmek için
  
    // Query parametresi olarak ID'yi ekleyin
    const endpoint = `http://localhost:4042/rent-football-field/cancel?id=${rentalID}`;
    const token = localStorage.getItem('token'); // Token'ı localStorage'dan al
  
    try {
      const response = await fetch(endpoint, {
        method: 'PUT', // API'nin beklediği method tipi DELETE olabilir, kontrol edin.
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Token'ı Authorization header'ına ekle
        },
        // Body'ye ihtiyaç duymadan sadece URL üzerinden ID'yi gönderiyoruz
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        // İşlem başarılıysa, kullanıcıya bildir ve listeyi güncelle
        console.log('Kiralama başarıyla iptal edildi');
        // Burada state'i güncelleyerek UI'da değişiklikleri yansıtabilirsiniz...
        // Örneğin:
        setRentals(prevRentals => prevRentals.filter(rental => rental.id !== rentalID));
      }
    } catch (error) {
      console.error('Kiralama iptali başarısız oldu:', error);
    }
  };
  return (
    <>
      {currentRentals.map((rental, index) => {
        const rentalStartDate = new Date(rental.startDate);
        const now = new Date();
        
        return (
          <div key={index} className="card2">
            <div className="card-content2">
              <div className="card-title2">Kiralama Tarihi: {formatToLocalTime(rental.startDate)}</div>
              <div className="card-text2">Bitiş Tarihi: {formatToLocalTime(rental.endDate)}</div>
              <Button 
                variant="contained" 
                color="primary" 
                className="select-button2"
                onClick={() => handleViewDetails(rental.footballFieldid)}
              >
                Detayları Gör
              </Button>
            </div>
            {rentalStartDate > now && (
              <IconButton 
                className="delete-button" 
                onClick={() => handleCancel(rental.id)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            )}
          </div>
        );
      })}
          <Pagination
        count={Math.ceil(rentals.length / ITEMS_PER_PAGE)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Halı Saha Detayları</DialogTitle>
        <DialogContent>
          <Typography variant="h6">İsim: {fieldDetails?.name}</Typography>
          <Typography>Telefon: {fieldDetails?.telephoneNumber}</Typography>
          <Typography>Şehir: {fieldDetails?.city}</Typography>
          <Typography>İlçe: {fieldDetails?.district}</Typography>
          <Typography>Adres: {fieldDetails?.address}</Typography>
          <Typography>Fiyat: {fieldDetails?.price} TL</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RentalHistoryPage;
