import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../Resources/Logo.svg';
import { BsPersonCircle } from 'react-icons/bs';

// Autenticacion de token
import AuthToken from '../Auth/AuthToken';
// Asegúrate Obtener datos del usuario
import GetUserInfo from '../Auth/GetUserInfo'; 

function Navbar_init() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [identificacion, setIdentificacion] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [rol, setRol] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const { rol, identificacion } = await GetUserInfo();
        setIdentificacion(identificacion);
        setRol(rol || []);

        // Cargar datos relacionados con el usuario
        if (identificacion) {
          const result = await AuthToken.get(`usuario/list/${identificacion}`);
          setUsuario(result.data.data);
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    fetchData();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setRol([]);
    setDropdownOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link to='/Home'><img className='nav-logo' src={Logo} alt="" /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
            <li className="nav-item">
              <Link to="/Home" style={{ textDecoration: 'none' }}><a className="nav-link active" aria-current="page" href="#">Inicio</a></Link>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Categorias</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Soporte</a>
            </li>
            <li className="nav-item">
              <Link to='/ContactUs' className='nav-link active' aria-current="page">Contactanos</Link>
            </li>
            <li className="nav-item">
              <Link to='/SeccionSubasta' className="nav-link active" aria-current="page">Seccion Subasta</Link>
            </li>
            <li className="nav-item">
              <Link to='/Simulacion' className="nav-link active" aria-current="page">Simulacion</Link>
            </li>
            <li className="nav-item">
              <Link to="/ContactUs" className="nav-link active" aria-current="page">Correos</Link>
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
                    <li className='username'>{usuario.userName}</li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link to='/Profile' className='dropdown-item'>Mi perfil</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    {rol.includes('ADMIN') && (
                      <>
                        <li><Link to='/ListObra' className="dropdown-item">CRUD obras</Link></li>
                        <li><Link to='/ListSubasta' className="dropdown-item">CRUD subasta</Link></li>
                        <li><Link to='/ListDespacho' className="dropdown-item">CRUD despacho</Link></li>
                        <li><Link to='/ListPQRS' className="dropdown-item">CRUD PQRS</Link></li>
                        <li><Link to='/ListUsuario' className="dropdown-item">CRUD Usuarios</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                      </>
                    )}
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


