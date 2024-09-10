import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Resources/Logo.svg';
import { BsPersonCircle } from 'react-icons/bs';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Autenticación de token
import AuthToken from '../Auth/AuthToken';
// Obtener datos del usuario
import GetUserInfo from '../Auth/GetUserInfo';

function Navbar_init({ onSupportClick, onAboutClick }) {
  const [showAboutButton, setShowAboutButton] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [usuario, setUsuario] = useState({});
  const [rol, setRol] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
        try {
          const { rol, identificacion } = await GetUserInfo();
          setRol(rol || []);
          if (identificacion) {
            const result = await AuthToken.get(`usuario/list/${identificacion}`);
            setUsuario(result.data.data);
          }
        } catch (error) {
          console.error('Error al cargar los datos del usuario:', error);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setRol([]);
    setIsAuthenticated(false);
    setDropdownOpen(false);
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    // Show the "Nosotros" button only on the landing page
    setShowAboutButton(location.pathname === '/');
  }, [location]); // location ahora está definido correctamente

  // Nueva función para manejar el soporte
  const handleSupportClick = () => {
    if (location.pathname === '/') {
      onSupportClick(); // Ejecuta el click de soporte si está en la página de inicio
    } else {
      navigate('/Help'); // Si no está en la página de inicio, redirige a /Help
    }
  };


  return (
    <nav className="navbar navbar-expand-lg">
      {isAuthenticated && rol.includes('ADMIN') && (
        <div className="d-flex align-items-center">
          <Button
            icon="pi pi-bars"
            onClick={() => setVisible(true)}
            className="p-button-text custom-sidebar-toggle"
            style={{ backgroundColor: 'transparent', border: 'none' }}
          />
        </div>
      )}

      {isAuthenticated && (
        <Sidebar visible={visible} onHide={() => setVisible(false)} className="p-sidebar">
          <div className="sidebar-content">
            <h2 className="header">ImpulsArt</h2>

            <Link to="/Dashboard" style={{ textDecoration: 'none' }}>
              <Button
                label="Dashboard"
                icon="pi pi-home"
                className="p-button-text"
                style={{ color: 'black', justifyContent: 'flex-start', textAlign: 'left', fontSize: '1.2rem' }}
              />
            </Link>

            {/* Añade más enlaces aquí según el rol */}
          </div>
        </Sidebar>
      )}

      <style jsx>{`
        .p-sidebar {
          width: 250px;
        }
        .sidebar-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 1rem;
        }
        .header {
          margin-bottom: 1rem;
          color: black;
          font-size: 1.5rem;
        }
        .dropdown-container {
          position: relative;
          display: inline-block;
        }
        .dropdown-menu {
          position: absolute;
          right: 0;
          min-width: 150px;
        }
        .custom-sidebar-toggle {
          z-index: 1050;
        }
        .pi {
          font-size: 1.5rem;
        }
      `}</style>

      <div className="container-fluid">
        <Link to='/Home'><img className='nav-logo' src={Logo} alt="Logo" /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
            <li className="nav-item">
              <Link to="/Home" style={{ textDecoration: 'none' }}>
                <a className="nav-link active" aria-current="page" href="#">Inicio</a>
              </Link>
            </li>

            {isAuthenticated && rol.includes('ADMIN') && (
              <li className="nav-item">
                <Link to='/Dashboard' className='nav-link active' aria-current="page">Dashboard</Link>
              </li>
            )}

            {showAboutButton && (
              <li className="nav-item">
                <button className="nav-link active" onClick={onAboutClick}>Nosotros</button>
              </li>
            )}

            <li className="nav-item">
              <button className="nav-link active" onClick={handleSupportClick}>Soporte</button>
            </li>

            {isAuthenticated && rol.includes('DOMICILIARIO') && (
              <>
                <li className="nav-item">
                  <Link to='/DashboardDomiciliario' className='nav-link active' aria-current="page">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to='/CrearDireccion' className='nav-link active' aria-current="page">Crear Direcciones</Link>
                </li>
              </>
            )}

            {isAuthenticated && (
              <li className="nav-item">
                <Link to='/ContactUs' className='nav-link active' aria-current="page">Contactanos</Link>
              </li>
            )}

            {isAuthenticated && rol.includes('ASESOR') && (
              <li className="nav-item">
                <Link to='/DashboardAsesor' className="nav-link active" aria-current="page">PQRS y reportes</Link>
              </li>
            )}

            {isAuthenticated && (
              <li className="nav-item">
                <Link to='/SeccionSubasta' className="nav-link active" aria-current="page">Seccion Subasta</Link>
              </li>
            )}

            {isAuthenticated && (
              <li className="nav-item">
                <div className="dropdown">
                  <button className="nav-link active dropdown" onClick={toggleDropdown}>
                    <div className='person-icon'>
                      <BsPersonCircle />
                    </div>
                  </button>
                  {dropdownOpen && (
                    <ul className="dropdown-menu show" aria-labelledby="navbarDropdownMenuLink">
                      <li className='username'>{usuario.userName}</li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><Link to='/Profile' className='dropdown-item'>Mi perfil</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
                    </ul>
                  )}
                </div>
              </li>
            )}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/login">
                    <button className="btn btn-primary signup-btn">Sign in</button>
                  </Link>
                </li>
                <li>
                  <Link to="/register">
                    <button className="btn btn-primary login-btn" type="button">Saca A Tu Artista</button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar_init;


