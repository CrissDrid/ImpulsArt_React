import React from 'react';
import { Link } from 'react-router-dom'; 
import Logo from '../Resources/Logo.svg';
import Art from '../Resources/Img-Art2.svg';
import Footer from './Footer';

function Register() {
  return (
    <div className="register-container">
      <div className="register-content row justify-content-center">
        <div className='col-md-6'>
          <div className="register-form">
            <div className="register-image">
              <img className="logo-register" src={Logo} alt=""/>
            </div>
            <form>
              <div className="form-row">
                <div className="row">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="floatingName" placeholder="Nombre"/>
                    <label htmlFor="floatingName">Nombre</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="floatingLastName" placeholder="Apellido"/>
                    <label htmlFor="floatingLastName">Apellido</label>
                  </div>
                </div>
                </div>
              </div>
              <div className="form-floating">
                <input type="text" className="form-control" id="floatingId" placeholder="Numero de Documento"/>
                <label htmlFor="floatingId">Numero de Documento</label>
              </div>
              <div className="form-floating">
                <input type="text" className="form-control" id="floatingUserName" placeholder="User Name"/>
                <label htmlFor="floatingUserName">User Name</label>
              </div>
              <div className="form-floating">
                <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com"/>
                <label htmlFor="floatingEmail">Email</label>
              </div>
              <div className="form-floating">
                <input type="date" className="form-control" id="floatingDOB" placeholder="Fecha de Nacimiento"/>
                <label htmlFor="floatingDOB">Fecha de Nacimiento</label>
              </div>
              <div className="form-floating">
                <input type="text" className="form-control" id="floatingPhone" placeholder="Numero de Celular"/>
                <label htmlFor="floatingPhone">Numero de Celular</label>
              </div>
              <div className="form-floating">
                <input type="text" className="form-control" id="floatingAddress" placeholder="Direccion"/>
                <label htmlFor="floatingAddress">Direccion</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
                <label htmlFor="floatingPassword">Contraseña</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" id="floatingPasswordConfirmation" placeholder="Password"/>
                <label htmlFor="floatingPasswordConfirmation">Confirmar Contraseña</label>
              </div>
              <button className="btn btn-primary w-100 py-2 create-btn" type="submit">Crear Cuenta</button>
              <div className="Links">
                <p>¿Ya tienes una cuenta? <Link className='link-no-underline link-cuenta' to="/login">Iniciar Sesión</Link></p>  
              </div>
            </form>
          </div>
        </div>
        <div className='col-md-6'>
          <img className='register-img' src={Art} alt="" />
        </div>
      </div>
      <div className="footer-register">
        <Footer/>
      </div>
    </div>
  );
}

export default Register;
