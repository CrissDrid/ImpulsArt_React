import React from 'react'
import { Link } from 'react-router-dom'; 
import Logo from '../Resources/Logo.svg'
import Art from '../Resources/Img-Art.svg'
import Footer from './Footer'

function Login() {
  return (
    <div className="login-container">
      <div className="login-content row">
        <div className='col-md-6'>
          <img className='cuadro-img' src={Art} alt="" />
        </div>
        <div className='col-md-6'>
          <div className="login-form">
            <div className="login-image">
              <img className="logo-login" src={Logo} alt=""/>
            </div>
            <form>
              <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
                <label htmlFor="floatingInput">Email</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
                <label htmlFor="floatingPassword">Contraseña</label>
              </div>
    
              <div className="form-check text-start my-3">
                <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault"/>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Recordarme
                </label>
              </div>
              <button className="btn btn-primary w-100 py-2 iniciar-btn" type="submit">Iniciar Sesion</button>
              <div className="Links">
                <p><Link className='link-contraseña link-no-underline'>¿Olvidaste tu contraseña?</Link></p>
                <p>¿Todavía no tienes una cuenta? <Link className='link-no-underline link-cuenta'>Crear cuenta nueva</Link></p>  
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Login
