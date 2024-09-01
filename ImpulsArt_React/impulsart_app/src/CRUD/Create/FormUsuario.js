import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art3.avif';
import { Link } from 'react-router-dom';

//Autenticacion de apis
import '../../Auth/AuthToken';

export const FormUsuario = () => {

    let navigate = useNavigate()

    const [usuario, setUsuario] = useState({
      userName: "",
      identificacion: "",
      nombre: "",
      apellido: "",
      fechaNacimiento: "",
      email: "",
      numCelular: "",
      direccion: "",
      contrasena: "",
      tipoUsuario: "usuario comun"
    });
  
    const { nombre, apellido, fechaNacimiento, email, numCelular, direccion, contrasena, userName, identificacion} = usuario;
  
    const onInputChange = (e) => {
      setUsuario({...usuario, [e.target.name]: e.target.value});
    };
  
    const onSubmit = async (e) => {
      e.preventDefault();
      try {
  
        await axios.post("http://localhost:8086/api/usuario/create", usuario);
        navigate("/ListUsuario"); 
  
      } catch (error) {
        console.error(error);
        // Manejo de errores aquí
      }
    };
  
    return (
      <div className="register-container">
        <div className="register-content row justify-content-center">
          <div className='col-md-6'>
            <div className="register-form">
              <div className="register-image">
                <img className="logo-register" src={Logo} alt=""/>
              </div>
              <form onSubmit={(e) => onSubmit(e)}>
                <div className="form-row">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input className="form-control" id="floatingName" placeholder="Nombre" onChange={(e) => onInputChange(e)} value={nombre} type="text" name="nombre" required/>
                        <label htmlFor="floatingName">Nombre</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input className="form-control" id="floatingLastName" onChange={(e) => onInputChange(e)} value={apellido} type="text" name="apellido" placeholder="Apellido" required/>
                        <label htmlFor="floatingLastName">Apellido</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-floating">
                  <input className="form-control" id="floatingId" onChange={(e) => onInputChange(e)} value={identificacion} type="number" name="identificacion" placeholder="Numero de Documento" required/>
                  <label htmlFor="floatingId">Numero de Documento</label>
                </div>
                <div className="form-floating">
                  <input type="text" className="form-control" id="floatingUserName" onChange={(e) => onInputChange(e)} value={userName} name="userName" placeholder="User Name" required/>
                  <label htmlFor="floatingUserName">User Name</label>
                </div>
                <div className="form-floating">
                  <input type="email" className="form-control" id="floatingEmail" onChange={(e) => onInputChange(e)} value={email} name="email" placeholder="name@example.com" required/>
                  <label htmlFor="floatingEmail">Email</label>
                </div>
                <div className="form-floating">
                  <input type="date" className="form-control" id="floatingDOB" onChange={(e) => onInputChange(e)} value={fechaNacimiento} name="fechaNacimiento" placeholder="Fecha de Nacimiento" required/>
                  <label htmlFor="floatingDOB">Fecha de Nacimiento</label>
                </div>
                <div className="form-floating">
                  <input type="number" className="form-control" id="floatingPhone" onChange={(e) => onInputChange(e)} value={numCelular} name="numCelular" placeholder="Numero de Celular" required/>
                  <label htmlFor="floatingPhone">Numero de Celular</label>
                </div>
                <div className="form-floating">
                  <input type="text" className="form-control" id="floatingAddress" onChange={(e) => onInputChange(e)} value={direccion} name="direccion" placeholder="Direccion" required/>
                  <label htmlFor="floatingAddress">Direccion</label>
                </div>
                <div className="form-floating">
                  <input type="password" className="form-control" id="floatingPassword" onChange={(e) => onInputChange(e)} value={contrasena} name="contrasena" placeholder="Password" required/>
                  <label htmlFor="floatingPassword">Contraseña</label>
                </div>
                <button className="btn btn-primary w-100 py-2 create-btn" type="submit">Crear usuario</button>
                <Link to='/ListSubasta'><button className="btn btn-danger w-100 py-2 cancel-btn">Cancelar</button></Link>
              </form>
            </div>
          </div>
          <div className='col-md-6'>
            <img className='register-img' src={Art} alt="" />
          </div>
        </div>
        <div className="footer-register">
        </div>
      </div>
    );
  };


export default FormUsuario;