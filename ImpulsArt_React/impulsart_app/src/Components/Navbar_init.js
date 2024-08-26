import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Logo from '../Resources/Logo.svg';
import { BsPersonCircle } from 'react-icons/bs';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import 'bootstrap-icons/font/bootstrap-icons.css';


function Navbar_init() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [roles, setRoles] = useState(JSON.parse(localStorage.getItem('userRoles')) || {
    esAsesor: false,
    esDomiciliario: false,
    tipoUsuario: 'usuario común',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      if (location.state.userName) {
        setUserName(location.state.userName);
      }

      const newRoles = {
        esAsesor: location.state.roles?.esAsesor || false,
        esDomiciliario: location.state.roles?.esDomiciliario || false,
        tipoUsuario: location.state.roles?.tipoUsuario || 'usuario común',
      };

      setRoles(newRoles);
      localStorage.setItem('userRoles', JSON.stringify(newRoles));
    }
  }, [location.state]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRoles');
    setUserName('');
    setRoles({
      esAsesor: false,
      esDomiciliario: false,
      tipoUsuario: 'usuario común',
    });
    setDropdownOpen(false);
    navigate('/login', { replace: true });

  };

  return (
    <nav className="navbar navbar-expand-lg">
      {roles.tipoUsuario === 'Administrador' && (
        <>
          <div className="d-flex align-items-center">
            <Button
              icon="pi pi-bars"
              onClick={() => setVisible(true)}
              className="p-button-text custom-sidebar-toggle"
              style={{ backgroundColor: 'transparent', border: 'none' }}
            />
          </div>
        </>
      )}


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

          <Link to="/ListUsuario" style={{ textDecoration: 'none' }}>
            <Button
              label="Usuarios"
              icon="pi pi-users"
              className="p-button-text"
              style={{ color: 'black', justifyContent: 'flex-start', textAlign: 'left', fontSize: '1.2rem' }}
            />
          </Link>

          <Link to="#" style={{ textDecoration: 'none' }}>
            <Button
              label="Ventas"
              icon="pi pi-shopping-cart"
              className="p-button-text"
              style={{ color: 'black', justifyContent: 'flex-start', textAlign: 'left', fontSize: '1.2rem' }}
            />
          </Link>

          <Link to="/ListObra" style={{ textDecoration: 'none' }}>
            <Button
              label="Productos"
              icon="pi pi-box"
              className="p-button-text"
              style={{ color: 'black', justifyContent: 'flex-start', textAlign: 'left', fontSize: '1.2rem' }}
            />
          </Link>

          <Link to="/ListSubasta" style={{ textDecoration: 'none' }}>
            <Button
              label="Subastas"
              icon="pi pi-tag"
              className="p-button-text"
              style={{ color: 'black', justifyContent: 'flex-start', textAlign: 'left', fontSize: '1.2rem' }}
            />
          </Link>

          <Link to="/ListPQRS" style={{ textDecoration: 'none' }}>
            <Button
              label="PRQs"
              icon="pi pi-question-circle"
              className="p-button-text"
              style={{ color: 'black', justifyContent: 'flex-start', textAlign: 'left', fontSize: '1.2rem' }}
            />
          </Link>

        </div>
      </Sidebar>

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
        <Link to='/Home'><img className='nav-logo' src={Logo} alt="" /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
            <li className="nav-item">
              <Link to="/Home" style={{ textDecoration: 'none' }}><a className="nav-link active" aria-current="page" href="#" >Inicio</a></Link>
            </li>
            {roles.tipoUsuario === 'Administrador' && (
                      <>
                       <li className="nav-item">
              <Link to='/Dashboard' className='nav-link active' aria-current="page">Dashboard</Link>
            </li>
                      </>
                    )} 
            
            <li className="nav-item">
              <Link to='/Help' className='nav-link active' aria-current="page">Soporte</Link>
            </li>
            <li className="nav-item">
              <Link to='/ContactUs' className='nav-link active' aria-current="page">Contactanos</Link>
            </li>
            <li className="nav-item">
              <Link to='/SeccionSubasta' className="nav-link active" aria-current="page">Seccion Subasta</Link>
            </li>
            <li className="nav-item">
              <div className="dropdown">
                <button className="nav-link active dropdown" onClick={toggleDropdown}>
                  <div className='person-icon'>
                    <BsPersonCircle />
                  </div>
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-menu show" aria-labelledby="navbarDropdownMenuLink">
                    <li className='username'>{userName}</li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link to='/Profile' className='dropdown-item'>Mi perfil</Link></li>
                    {roles.esAsesor && (
                      <li><Link to='/Dashboard' className="dropdown-item">Dashboard Asesor</Link></li>
                    )}
                    {roles.esDomiciliario && (
                      <li><Link to='/DomiciliarioDashboard' className="dropdown-item">Dashboard Domiciliario</Link></li>
                    )}
                    {roles.tipoUsuario === 'Administrador' && (
                      <>

                      </>
                    )}
                    <li><Link to='/Simulacion' className="dropdown-item">Simulacion</Link></li>
                    <li><Link to="/ContactUs" className="dropdown-item">Correos</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
                  </ul>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar_init;


