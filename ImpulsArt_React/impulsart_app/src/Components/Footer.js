import React from 'react';
import { Link } from 'react-router-dom'; 
import Logo from '../Resources/Logo.svg'

function Footer() {
  return (
    <div className="footer-container">
    <footer className="d-flex flex-wrap justify-content-between align-items-center border-top">
      <p className="col-md-4 mb-0 text-body-secondary">&copy; 2024 ImpulsArt, Inc</p>
      <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <img className="footer-logo" src={Logo} alt="" />
      </a>
      <ul className="nav col-md-4 justify-content-end">
        <Link to='/' className="link-no-underline">
        <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Inicio</a></li>
        </Link>
        <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Nosotros</a></li>
        <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Soporte</a></li>
        <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Contactanos</a></li>
      </ul>
    </footer>
  </div>
  
  );
}

export default Footer;
