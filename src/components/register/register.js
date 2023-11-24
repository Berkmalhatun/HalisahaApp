import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './register.css' // Bu dosyada stilinizi tanımlayın

function RegisterPage() {
  // State hooks to store form data
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [telNo, settelNo] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setrePassword] = useState('');

  const handleSubmit = async(event) => {
    event.preventDefault();
    // Burada form verileriyle ne yapmak istediğinize dair işlemleri yapabilirsiniz.
    console.log(email, name, surname, telNo, password, rePassword);
    if(password !==rePassword){
        alert("Şifreler uyuşmuyor.")
        return;
    }
  
  const userData ={
    name,
    surname,
    email,
    telNo,
    password,
    rePassword,
  };
  try{
    const response = await axios.post('http://localhost:4040/auth/register', userData);
      console.log(response.data);
      // Başarılı bir kayıt sonrası yapılacak işlemler
      // Örneğin kullanıcıyı giriş sayfasına yönlendirme vs.
    } catch (error) {
      // Hata durumunda yapılacak işlemler
      console.error('Kayıt işlemi sırasında bir hata oluştu', error);
  }
};
  return (
    <div className="register-container">
      <div className="register-content">
        <div className="logo">Your Logo</div>
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
          <div className="form-row">
            <div className="form-group half-width">
              <label>İsim</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="İsim"
              />
            </div>
            <div className="form-group half-width">
              <label>Soyisim</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Soyisim"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Telefon Numarası</label>
            <input
              type="tel"
              value={telNo}
              onChange={(e) => settelNo(e.target.value)}
              placeholder="Telefon Numarası"
            />
          </div>
          <div className="form-row">
            <div className="form-group half-width">
              <label>Parola</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parola"
              />
            </div>
            <div className="form-group half-width">
              <label>Parola Onayı</label>
              <input
                type="password"
                value={rePassword}
                onChange={(e) =>setrePassword(e.target.value)}
                placeholder="Parola Onayı"
              />
            </div>
          </div>
          <button  type="submit" className="register-button">Kayıt ol</button>
        </form>
        <div className="login-redirect">
          Hesabın var mı? <Link to="/login">Giriş yap</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
