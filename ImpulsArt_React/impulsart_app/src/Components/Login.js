import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../Resources/Logo.svg';
import Art from '../Resources/Img-Art.svg';
import Footer from './Footer';

const baseurl = "http://localhost:8086/api/usuario/login";
const validarEmpleadoUrl = "http://localhost:8086/api/usuario/validarEmpleado";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const iniciarSesion = async () => {
    try {
      const response = await axios.post(baseurl, {
        email: form.email,
        contrasena: form.password,
      });
  
      console.log('Server response:', response.data);
  
      if (response.data.success) {
       
        console.log('Login successful!');
        const { userName, identificacion } = response.data;

        // Validar si el usuario es un empleado
        const validarResponse = await axios.get(`${validarEmpleadoUrl}/${identificacion}`);
        const esEmpleado = validarResponse.data.success;

        navigate('/home', { state: { userName, identificacion, esEmpleado } });

        } else {
            const errorMessage = response.data.data;
            if (errorMessage === "Credenciales inválidas") {
                setError('Contraseña o Correo erroneos');
            } else {
                setError('Error al iniciar sesion');
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            setError('Contraseña o Correo incorrectos');
            console.error('Email o Contraseña incorrectos', error.message);
        } else {
            console.error('Error del servidor:', error.response.data.message);
            setError('Error del servidor: ' + error.response.data.message);
        }
    }
};
  

  return (
    <div className="login-container">
      <div className="login-content row">
        <div className='col-md-6'>
          <img className='login-img' src={Art} alt="" />
        </div>
        <div className='col-md-6'>
          <div className="login-form">
            <div className="login-image">
              <img className="logo-login" src={Logo} alt="" />
            </div>
            <form>
              <div className="form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">Email</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                />
                <label htmlFor="floatingPassword">Contraseña</label>
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-check text-start my-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="remember-me"
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Recordarme
                </label>
              </div>
              <button
                className="btn btn-primary w-100 py-2 iniciar-btn"
                type="button"
                onClick={iniciarSesion}
              >
                Iniciar Sesión
              </button>
              <div className="Links">
                <p>
                  <Link className='link-contraseña link-no-underline'>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </p>
                <p>
                  ¿Todavía no tienes una cuenta?
                  <Link className='link-no-underline link-cuenta' to="/register">
                    Crear cuenta nueva
                  </Link>
                </p>
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
