import React, { useState, useEffect } from 'react';
import Logo from '../Resources/Logo.svg';
import { BsPersonCircle } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { useLocation, useNavigate } from 'react-router-dom';


function Navbar_init() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.userName) {
      setUserName(location.state.userName);
    }
  }, [location.state]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserName('');
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
            <li className="nav-item justify-content-center">
              <form className="d-flex mx-auto search">
                <input className="form-control me-2 search-form" type="search" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-outline-success search-btn" type="submit">
                    <BiSearch />
                </button>
              </form>
            </li>
            <li className="nav-item">
              <div className="dropdown">
                <button className="nav-link active dropdown" onClick={toggleDropdown}>
                  <div className='person-icon'>
                    <BsPersonCircle/>
                  </div>
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-menu show" aria-labelledby="navbarDropdownMenuLink">
                    <li className='username'>{userName}</li>
                    <li><hr className="dropdown-divider"/></li>
                    <li><a className="dropdown-item" href="#">Mis Obras</a></li>
                    <li><hr className="dropdown-divider"/></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesion</button></li>
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
