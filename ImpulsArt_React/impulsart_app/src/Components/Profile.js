import React, { useEffect, useState } from 'react';
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
  const [activeTab, setActiveTab] = useState(() => {
    const storedTab = localStorage.getItem('activeTab');
    return storedTab || 'datosPersonales';
  });

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
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace('floating', '').charAt(0).toLowerCase() + id.replace('floating', '').slice(1);
    setUsuario(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthToken(`usuario/update/${identificacion}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Datos actualizados:', result);
        localStorage.setItem('user', JSON.stringify(usuario));
        setHasChanges(false);
      } else {
        console.error('Error al actualizar:', result);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
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
            <li><i className="bi bi-heart-fill fs-4"></i><a href="#datos" onClick={() => setActiveTab('datosPersonales')}>Datos Personales</a></li>
            <li><i className="bi bi-palette-fill fs-4"></i><a href="#galeria" onClick={() => setActiveTab('miGaleria')}>Mi Galería</a></li>
            <li><i className="bi bi-house-fill fs-4"></i><a href="#Direcciones" onClick={() => setActiveTab('direcciones')}>Mis Direcciones</a></li>
            <li><i className="bi bi-shield-lock-fill fs-4"></i><a href="#clave" onClick={() => setActiveTab('cambiarContrasena')}>Cambiar Contraseña</a></li>
            <li><i className="bi bi-cart-fill fs-4"></i><a href="#">Historial de Compras</a></li>
          </ul>
        </div>
        {activeTab === 'datosPersonales' && <UserData />}
        {activeTab === 'cambiarContrasena' && <ChangePWD />}
        {activeTab === 'miGaleria' && <Galery/>}
        {activeTab === 'direcciones' && <Direcciones />}

      </div>
      <Footer />
    </div>
  );
}

export default Profile;