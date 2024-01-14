import React, { useState } from "react";
import { TextField, Button, Container, Typography, Alert,Paper } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

const ChangePasswordPage = () => {
  const [passwords, setPasswords] = useState({
    password: "",
    newPassword: "",
    reNewPassword: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, newPassword, reNewPassword } = passwords;

    // Check if new passwords match
    if (newPassword !== reNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Yeni şifreler uyuşmuyor.',
      });
      return;
    }

    // Clear error message
    setError("");

    // Get user ID from token
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    try {
      const response = await fetch(
        "http://localhost:4040/auth/update-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: decoded.id,
            password: password,
            newPassword: newPassword,
            reNewPassword: reNewPassword,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Şifreniz başarıyla güncellendi.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: error.message,
      });
    }
  };

  return (
    <Container component={Paper} maxWidth="m" sx={{mt:4, bgcolor:"main"}}>
      <Typography variant="h5" sx={{ mt: 4, mb: 2, textAlign: "center"}}>
        Parola Değiştir
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Mevcut Parola"
          type="password"
          name="password"
          fullWidth
          margin="normal"
          onChange={handleInputChange}
          value={passwords.password}
          required
        />
        <TextField
          label="Yeni Parola"
          type="password"
          name="newPassword"
          fullWidth
          margin="normal"
          onChange={handleInputChange}
          value={passwords.newPassword}
          required
        />
        <TextField
          label="Yeni Parolayı Onayla"
          type="password"
          name="reNewPassword"
          fullWidth
          margin="normal"
          onChange={handleInputChange}
          value={passwords.reNewPassword}
          required
        />
        <Button
          type="submit"
        //   fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            // bgcolor: "secondary.main",
            "&:hover": { bgcolor: "secondary.dark" },
          }}
        >
          Güncelle
        </Button>
      </form>
    </Container>
  );
};

export default ChangePasswordPage;
