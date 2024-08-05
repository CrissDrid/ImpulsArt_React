import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Logo from '../Resources/Logo.svg';
import { BsPersonCircle } from 'react-icons/bs';

function Navbar_init() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      <div className="container-fluid">
        <img className='nav-logo' src={Logo} alt="" />
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Categorias</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Soporte</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Contactanos</a>
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
                    {roles.esAsesor && (
                      <li><Link to='/AsesorDashboard' className="dropdown-item">Dashboard Asesor</Link></li>
                    )}
                    {roles.esDomiciliario && (
                      <li><Link to='/DomiciliarioDashboard' className="dropdown-item">Dashboard Domiciliario</Link></li>
                    )}
                    {roles.tipoUsuario === 'administrador' && (
                      <>
                        <li><Link to='/ListObra' className="dropdown-item">CRUD obras</Link></li>
                        <li><Link to='/ListSubasta' className="dropdown-item">CRUD subasta</Link></li>
                        <li><Link to='/ListDespacho' className="dropdown-item">CRUD despacho</Link></li>
                        <li><Link to='/ListPQRS' className="dropdown-item">CRUD PQRS</Link></li>
                        <li><Link to='/ListUsuario' className="dropdown-item">CRUD Usuarios</Link></li>
                      </>
                    )}
                    <li><Link to="/ContactUs" className="dropdown-item">Correos</Link></li>
                    <Link to='/Profile' className='dropdown-item'>Mi perfil</Link>
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


