import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link
import Logo from '../Resources/Logo.svg';

function Navbar() {
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
              <a className="nav-link active" aria-current="page" href="#">Soporte</a>
            </li>
            <li className="nav-item">

              <a className="nav-link active" aria-current="page" href="#">Correos</a>
            </li>
 <li className="nav-item">
            </li>
            <li className="nav-item">
              <Link to="/login">
                <button className="btn btn-primary signup-btn">Sign in</button>
              </Link>
            </li>
            <li>
              <Link to="/register">
              <button className="btn btn-primary login-btn" type="button" >Saca A Tu Artista</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
