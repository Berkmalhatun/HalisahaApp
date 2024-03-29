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


  const formatToLocalTime = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString('tr-TR', { timeZone: 'UTC' });
  };
  const handleViewDetails = async (footballFieldid) => {
    try {

      const response = await fetch(`http://localhost:4042/football-field/find-footballfield?id=${footballFieldid}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setFieldDetails(data);
      setOpenDialog(true);   
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
    console.log('Cancelling rental with ID:', rentalID); 

    const endpoint = `http://localhost:4042/rent-football-field/cancel?id=${rentalID}`;
    const token = localStorage.getItem('token'); 
  
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        // İşlem başarılıysa, kullanıcıya bildir ve listeyi güncelle
        console.log('Kiralama başarıyla iptal edildi');
        setRentals(prevRentals => prevRentals.filter(rental => rental.id !== rentalID));
      }
    } catch (error) {
      console.error('Kiralama iptali başarısız oldu:', error);
    }
  };
  return (
    <div className='start-card2'>
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
                color="secondary" 
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
        color="secondary"
      />
      <Dialog open={openDialog} onClose={handleCloseDialog} >
  <DialogTitle className="dialog-title">Halı Saha Detayları</DialogTitle>
  <DialogContent className="dialog-content">
    <Typography className="detail-item">
      <span className="detail-label">İsim:</span>
      <span className="detail-value">{fieldDetails?.name}</span>
    </Typography>
    <Typography className="detail-item">
      <span className="detail-label">Telefon:</span>
      <span className="detail-value">{fieldDetails?.telephoneNumber}</span>
    </Typography>
    <Typography className="detail-item">
      <span className="detail-label">Şehir:</span>
      <span className="detail-value">{fieldDetails?.city}</span>
    </Typography>
    <Typography className="detail-item">
      <span className="detail-label">İlçe:</span>
      <span className="detail-value">{fieldDetails?.district}</span>
    </Typography>
    <Typography className="detail-item">
      <span className="detail-label">Adres:</span>
      <span className="detail-value">{fieldDetails?.address}</span>
    </Typography>
    <Typography className="detail-item">
      <span className="detail-label">Fiyat:</span>
      <span className="detail-value">{fieldDetails?.price}</span>
    </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" color="primary" className="close-button">Kapat</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RentalHistoryPage;
