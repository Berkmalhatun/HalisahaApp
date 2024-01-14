import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import "./register.css"; // Bu dosyada stilinizi tanımlayın

function RegisterPage() {
  // State hooks to store form data
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [telNo, settelNo] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setrePassword] = useState("");
  const [role, setRole] = useState("USER");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Burada form verileriyle ne yapmak istediğinize dair işlemleri yapabilirsiniz.
    console.log(email, name, surname, telNo, password, rePassword);
    if (password !== rePassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Şifreler uyuşmuyor!',
      });
      return;
    }

    const userData = {
      name,
      surname,
      email,
      telNo,
      password,
      rePassword,
      role,
    };
    try {
      const response = await axios.post(
        "http://localhost:4040/auth/register",
        userData
      );
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Kaydınız başarıyla tamamlandı!',
        confirmButtonText: 'Tamam'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Kayıt işlemi başarısız',
        text: 'Bir sorun oluştu, lütfen tekrar deneyiniz.',
      });
      console.error("Kayıt işlemi sırasında bir hata oluştu", error);
    }
  };
  return (
    <div className="register-container">
      <div className="register-content">
        <header>
           <div className="logo"></div>
        </header>
        <h1>Kayıt</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
            />
          </div>
         
            <div className="form-group">
              <label>İsim</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="İsim"
              />
            </div>
            <div className="form-group ">
              <label>Soyisim</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Soyisim"
              />
            </div>
        
          <div className="form-group">
            <label>Kullanıcı Tipi</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="role-select"
            >
              <option value="USER">Kullanıcı</option>
              <option value="EXECUTIVE">Halı Saha Yöneticisi</option>
            </select>
            <p className="role-description">
              <strong>Kullanıcı:</strong> Eğer amacınız sadece saha kiralamaksa,
              bu seçeneği tercih edin.
              <br />
              <strong>Halı Saha Yöneticisi:</strong> Sahayı sisteme eklemek ve
              yönetmek istiyorsanız, bu rolü seçin.
            </p>
          </div>

          <div className="form-group">
            <label>Telefon Numarası</label>
            <input
              type="tel"
              value={telNo}
              onChange={(e) => settelNo(e.target.value)}
              placeholder="5XXXXXXXXX"
            />
          </div>
      
            <div className="form-group">
              <label>Parola</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parola"
              />
            </div>
            <div className="form-group">
              <label>Parola Onayı</label>
              <input
                type="password"
                value={rePassword}
                onChange={(e) => setrePassword(e.target.value)}
                placeholder="Parola Onayı"
              />
            </div>
        
          <button type="submit" className="register-button">
            Kayıt ol
          </button>
        </form>
        <div className="login-redirect">
          Hesabın var mı? <Link to="/login">Giriş yap</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
