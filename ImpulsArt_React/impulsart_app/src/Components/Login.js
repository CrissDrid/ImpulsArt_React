import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../Resources/Logo.svg';
import Art from '../Resources/Img-Art.svg';
import Footer from './Footer';

const baseurl = "http://localhost:8086/api/usuario/login";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', contrasena: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null); // Limpiar el error cuando el usuario escribe
  };

  const iniciarSesion = async () => {
    try {
      const response = await axios.post(baseurl, { email: form.email, contrasena: form.contrasena });
      console.log('Server response:', response.data);

      if (response.data.status === "success") {
        console.log('Login successful!');
        const token = response.data.token;
        const tokenType = response.data.tokenType;
        
        // Guardar solo el token en localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('authTokenType', tokenType);

        // Aquí puedes navegar a la página principal o a otra ruta protegida
        navigate('/home');
      } else {
        setError(response.data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Correo o contraseña incorrectos');
        console.error('Email o Contraseña incorrectos', error.message);
      } else {
        console.error('Error del servidor:', error.response?.data?.message || error.message);
        setError('Error del servidor: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe de la manera predeterminada
    iniciarSesion(); // Llamar a la función de inicio de sesión
  };

  return (
    <div className="login-container">
      <div className="login-content row">
        <div className='col-md-6'><img className='login-img' src={Art} alt="" /></div>
        <div className='col-md-6'>
          <div className="login-form">
            <div className="login-image"><img className="logo-login" src={Logo} alt="" /></div>
            <form onSubmit={handleSubmit}>
              <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" name='email' value={form.email} onChange={handleChange} />
                <label htmlFor="floatingInput">Email</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" name='contrasena' value={form.contrasena} onChange={handleChange} />
                <label htmlFor="floatingPassword">Contraseña</label>
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-check text-start my-3">
                <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                <label className="form-check-label" htmlFor="flexCheckDefault">Recordarme</label>
              </div>
              <button className="btn btn-primary w-100 py-2 iniciar-btn" type="submit">Iniciar Sesión</button>
              <div className="Links">
                <p><Link className='link-contraseña link-no-underline'>¿Olvidaste tu contraseña?</Link></p>
                <p>¿Todavía no tienes una cuenta?<Link className='link-no-underline link-cuenta' to="/register"> Crear cuenta nueva</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
