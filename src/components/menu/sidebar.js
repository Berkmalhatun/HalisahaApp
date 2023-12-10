import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import logo from './logo.png'
import './sidebar.css';

const Sidebar = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
      setRole(decoded.role);
    }
  }, []);

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Profile" className="sidebar-profile-image" />
        <h3>{email}</h3>
        <p>{role}</p>
      </div>
      <nav className="sidebar-nav">
        {/* Rol kontrolü */}
        {role === 'EXECUTIVE' ? (
          // Halı saha yöneticisi için menü öğeleri
          <>
            <Link to="/home/fields/add" className="sidebar-nav-item">Halı Saha Ekle</Link>
            <Link to="/home/fields/manage" className="sidebar-nav-item">Halı Sahalarım</Link>
            <Link to="/home/fields/update" className="sidebar-nav-item">Bilgileri Güncelle</Link>
          </>
        ) : (
          // Kullanıcı için menü öğeleri
          <>
            <Link to="/home/search" className="sidebar-nav-item">Saha Ara</Link>
            <Link to="/home/history" className="sidebar-nav-item">Geçmiş</Link>
          </>
        )}
        {/* Ayarlar ve Çıkış Yap menüsü */}
        <div className="sidebar-nav-item" onClick={toggleSettings}>
          AYARLAR {settingsOpen ? <ExpandLessIcon className="expand-icon" /> : <ExpandMoreIcon className="expand-icon" />}
        </div>
        {settingsOpen && (
          <div className="sidebar-settings">
            <Link to="/home/settings/user" className="sidebar-settings-item">Kullanıcı Bilgileri</Link>
            <Link to="/home/settings/password" className="sidebar-settings-item">Parola Değiştir</Link>
            {role === 'kullanıcı' && <Link to="/home/settings/authority" className="sidebar-settings-item">Halısaha Yetkisi Al</Link>}
          </div>
        )}
        <Link to="/login" className="sidebar-logout">ÇIKIŞ YAP</Link>
      </nav>
    </div>
  );
};

export default Sidebar;