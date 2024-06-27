import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art3.avif';
import { Link } from 'react-router-dom';

export const FormSubasta = () => {
  
    let navigate = useNavigate()

    const [subasta, setSubasta] = useState ({

        estadoSubasta: "Activo",
        precioInicial: "",
        fechaInicio: new Date().toISOString().slice(0, 10),
        fechaFinalizacion: "",
        FkCod_Producto: ""

    })

    const{ precioInicial, fechaFinalizacion, FkCod_Producto} = subasta

    const onInputChange = (e) => {
       
        setSubasta({...subasta, [e.target.name]:e.target.value})

    };

    const onSubmit = async (e) => {

        e.preventDefault();
        axios.post("http://localhost:8086/api/subasta/create",subasta)
        navigate("/ListSubasta"); 

    };

  
    return (
      <div className="register-container">
          <div className="register-content row justify-content-center">
              <div className='col-md-6'>
                  <div className="register-form">
                      <div className="register-image">
                          <img className="logo-register" src={Logo} alt=""/>
                      </div>
                      <form onSubmit={onSubmit}>
                          <div className="form-row">
                              <div className="form-floating">
                                  <input
                                      className="form-control"
                                      id="floatingPrecioInicial"
                                      onChange={onInputChange}
                                      value={precioInicial}
                                      type="number"
                                      name="precioInicial"
                                      placeholder="Ingrese la oferta mínima que se debe ingresar"
                                      required
                                  />
                                  <label htmlFor="floatingPrecioInicial">Precio Inicial</label>
                              </div>
                              <br />
                              <div className="form-floating">
                                  <input
                                      className="form-control"
                                      id="floatingFechaFinalizacion"
                                      onChange={onInputChange}
                                      value={fechaFinalizacion}
                                      type="date"
                                      name="fechaFinalizacion"
                                      placeholder="Ingrese cuando terminará su subasta"
                                      required
                                  />
                                  <label htmlFor="floatingFechaFinalizacion">Fecha de Finalización</label>
                              </div>
                              <br />
                              <div className="form-floating">
                                  <input
                                      className="form-control"
                                      id="floatingFkCod_Producto"
                                      onChange={onInputChange}
                                      value={FkCod_Producto}
                                      type="number"
                                      name="FkCod_Producto"
                                      placeholder="Con qué producto quiere hacer la subasta (foranea de obra)"
                                      required
                                  />
                                  <label htmlFor="floatingFkCod_Producto">Código de Producto</label>
                              </div>
                              <br />
                              <button className="btn btn-primary w-100 py-2 create-btn" type="submit">Crear</button>
                              <Link to='/ListSubasta'><button className="btn btn-danger w-100 py-2 cancel-btn">Cancelar</button></Link>
                          </div>
                      </form>
                      <div id="mensajeError" className="mensaje-error"></div>
                  </div>
              </div>
              <div className='col-md-6'>
                  <img className='register-img' src={Art} alt="" />
              </div>
          </div>
      </div>
  );
};


export default FormSubasta;
