import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Resources/Logo.svg';
import Art from '../Resources/Img-Art2.svg';
import Footer from './Footer';
import axios from 'axios';
import { Password } from 'primereact/password';
import Swal from 'sweetalert2';
import { Toast } from 'primereact/toast';

const Register = () => {
  let navigate = useNavigate();
  const toast = useRef(null);

  const [usuario, setUsuario] = useState({
    userName: "",
    identificacion: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    email: "",
    numCelular: "",
    contrasena: "",
    tipoUsuario: "usuario comun",
    fk_Rol: 1
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const { nombre, apellido, fechaNacimiento, email, numCelular, contrasena, userName, identificacion } = usuario;

  const onInputChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@(hotmail|gmail|yahoo|outlook)\.com$/;
    return emailRegex.test(email);
  };

  const isOnlyLetters = (str) => /^[A-Za-z]+$/.test(str);

  const isPhoneValid = (phone) => /^3\d{9}$/.test(phone);

  const isIdentificationValid = (id) => /^\d{7,10}$/.test(id);

  const isDateOfBirthValid = (date) => {
    const today = new Date();
    const dob = new Date(date);
    const age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    const dayDifference = today.getDate() - dob.getDate();
    return today >= dob && age > 18 && (age > 18 || (monthDifference > 0 || (monthDifference === 0 && dayDifference >= 0)));
  };

  const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[./@$!%*?&])[A-Za-z\d./@$!%*?&]{8,}$/.test(password);
  };

  const getWeakPasswordMessage = (password) => {
    const messages = [];
    if (!/[a-z]/.test(password)) { messages.push('una letra minúscula'); }
    if (!/[A-Z]/.test(password)) { messages.push('una letra mayúscula'); }
    if (!/\d/.test(password)) { messages.push('un número'); }
    if (!/[./@$!%*?&]/.test(password)) { messages.push('un carácter especial'); }
    if (password.length < 8) { messages.push('al menos 8 caracteres'); }
    return `La contraseña debe contener ${messages.join(', ')}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !identificacion || !nombre || !apellido || !fechaNacimiento || !email || !numCelular || !contrasena) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Todos los campos son obligatorios', life: 3000 });
        return;
    }

    if (!isOnlyLetters(nombre)) {
        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El nombre solo debe contener letras', life: 3000 });
        return;
    }

    if (!isOnlyLetters(apellido)) {
        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El apellido solo debe contener letras', life: 3000 });
        return;
    }

    if (!isIdentificationValid(identificacion)) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Número de documento inválido', life: 3000 });
        return;
    }

    if (!isEmailValid(email)) {
        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, ingrese un correo electrónico válido', life: 3000 });
        return;
    }

    if (!isDateOfBirthValid(fechaNacimiento)) {
        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: fechaNacimiento ? 'Debe ser mayor de edad para registrarse' : 'Fecha de nacimiento inválida', life: 3000 });
        return;
    }

    if (!isPhoneValid(numCelular)) {
        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Número de celular inválido. Debe contener 10 dígitos y comenzar con 3', life: 3000 });
        return;
    }

    if (contrasena !== confirmPassword) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Las contraseñas deben coincidir', life: 3000 });
        return;
    }

    if (!isStrongPassword(contrasena)) {
        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: getWeakPasswordMessage(contrasena), life: 3000 });
        return;
    }

    try {
      const response = await axios.get(`http://localhost:8086/api/usuario/list/${identificacion}`);
      if (response.data.status === 'success') {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'El usuario con ese número de identificación ya está registrado', life: 3000 });
        return;
      }
    } catch (error) {
      console.error('Error al verificar el número de identificación:', error);
    }

    try {
        const response = await axios.post("http://localhost:8086/api/usuario/create", usuario);
        if (response.status === 200) {
            Swal.fire({
                title: '¡Felicidades!',
                text: 'Se ha registrado exitosamente en ImpulsArt.',
                icon: 'success'
            }).then(() => {
                navigate("/login");
            });
        } else {
            console.error('Error al registrar:', response.data);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
};

  return (
    <div className="register-container">
      <div className="register-content row justify-content-center">
        <div className='col-md-6'>
          <div className="register-form">
            <div className="register-image">
              <img className="logo-register" src={Logo} alt="" />
            </div>
            <form onSubmit={onSubmit}>
              <div className="form-row">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input className="form-control" id="floatingName" placeholder="Nombre" onChange={onInputChange} value={nombre} type="text" name="nombre" />
                      <label htmlFor="floatingName">Nombre</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input className="form-control" id="floatingLastName" onChange={onInputChange} value={apellido} type="text" name="apellido" placeholder="Apellido" />
                      <label htmlFor="floatingLastName">Apellido</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-floating">
                <input className="form-control" id="floatingId" onChange={onInputChange} value={identificacion} type="number" name="identificacion" placeholder="Numero de Documento" />
                <label htmlFor="floatingId">Numero de Documento</label>
              </div>
              <div className="form-floating">
                <input type="text" className="form-control" id="floatingUserName" onChange={onInputChange} value={userName} name="userName" placeholder="User Name" />
                <label htmlFor="floatingUserName">User Name</label>
              </div>
              <div className="form-floating">
                <input type="email" className="form-control" id="floatingEmail" onChange={onInputChange} value={email} name="email" placeholder="name@example.com" />
                <label htmlFor="floatingEmail">Email</label>
              </div>
              <div className="form-floating">
                <input type="date" className="form-control" id="floatingDOB" onChange={onInputChange} value={fechaNacimiento} name="fechaNacimiento" placeholder="Fecha de Nacimiento" />
                <label htmlFor="floatingDOB">Fecha de Nacimiento</label>
              </div>
              <div className="form-floating">
                <input type="number" className="form-control" id="floatingPhone" onChange={onInputChange} value={numCelular} name="numCelular" placeholder="Numero de Celular" />
                <label htmlFor="floatingPhone">Numero de Celular</label>
              </div>
              <div className="form-floating">
                <Password className="form-contraseña" id="floatingPassword" onChange={onInputChange} value={contrasena} name="contrasena" toggleMask placeholder="Contraseña"
                promptLabel="Ingrese la contraseña"
                weakLabel='Contraseña Débil' 
                mediumLabel='Contraseña Media' 
                strongLabel='Contraseña Fuerte' />
              </div>
              <div className="form-floating">
                <Password className='form-contraseña' name='confirmPassword' toggleMask feedback={false} placeholder="Confirmar Contraseña" onChange={(e) => setConfirmPassword(e.target.value)} />
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
        <Footer />
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default Register;