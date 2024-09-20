import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar_init from './Navbar_init';
import Footer from './Footer';
import { FaUser } from 'react-icons/fa';
import '../Styles/Profile.css';
import UserData from './UserData';
import ChangePWD from './ChangePWD';
import Galery from './Galery';
import Direcciones from './Direcciones';

// Autenticación de token
import AuthToken from '../Auth/AuthToken';
// Asegúrate de obtener datos del usuario
import GetUserInfo from '../Auth/GetUserInfo';

function Profile() {
  const [usuario, setUsuario] = useState(null);
  const [identificacion, setIdentificacion] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('datosPersonales');
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const { identificacion } = await GetUserInfo();
        setIdentificacion(identificacion);

        // Cargar datos relacionados con el usuario
        if (identificacion) {
          const response = await AuthToken.get(`/usuario/list/${identificacion}`);
          setUsuario(response.data.data);
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const originalData = JSON.parse(localStorage.getItem('user'));
    if (usuario && originalData) {
      setHasChanges(JSON.stringify(usuario) !== JSON.stringify(originalData));
    }
  }, [usuario]);

  useEffect(() => {
    // Verificar si hay un estado pasado desde la navegación
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <Navbar_init />
      <div className="container-banner">
        <div className='profile-banner'></div>
        <div className='profile-icon'>
          <FaUser size={100} color="white" />
        </div>
      </div>
      <div className="userName">
        <h1 className='userName'>{usuario.userName || 'UserName'}</h1>
      </div>
      <div className="profile-content">
        <div className="user-nav">
          <h3>Mis Datos</h3>
          <ul>
            <li><i className="bi bi-heart-fill fs-4"></i><a href="#datos" onClick={(e) => { e.preventDefault(); handleTabChange('datosPersonales'); }}>Datos Personales</a></li>
            <li><i className="bi bi-palette-fill fs-4"></i><a href="#galeria" onClick={(e) => { e.preventDefault(); handleTabChange('miGaleria'); }}>Mi Galería</a></li>
            <li><i className="bi bi-house-fill fs-4"></i><a href="#Direcciones" onClick={(e) => { e.preventDefault(); handleTabChange('direcciones'); }}>Mis Direcciones</a></li>
            <li><i className="bi bi-shield-lock-fill fs-4"></i><a href="#clave" onClick={(e) => { e.preventDefault(); handleTabChange('cambiarContrasena'); }}>Cambiar Contraseña</a></li>
            <li><i className="bi bi-cart-fill fs-4"></i><a href="#">Historial de Compras</a></li>
          </ul>
        </div>
        {activeTab === 'datosPersonales' && <UserData />}
        {activeTab === 'cambiarContrasena' && <ChangePWD />}
        {activeTab === 'miGaleria' && <Galery />}
        {activeTab === 'direcciones' && <Direcciones />}
      </div>
      <Footer />
    </div>
  );
}

export default Profile;