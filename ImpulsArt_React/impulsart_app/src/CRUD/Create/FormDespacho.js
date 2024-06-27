import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art3.avif';
import { Link } from 'react-router-dom';

export const FormDespacho = () => {
  
    let navigate = useNavigate()

    const [despacho, setDespacho] = useState ({

        estado: "",
        comprobante: "Sin comprobante ahora",
        fechaEntrega: "",
        fecha_venta: new Date().toISOString().slice(0, 10)

    })

    const{ estado, fechaEntrega } = despacho

    const onInputChange = (e) => {
       
        setDespacho({...despacho, [e.target.name]:e.target.value})

    };

    const onSubmit = async (e) => {

        e.preventDefault();
        axios.post("http://localhost:8086/api/despacho/create",despacho)
        navigate("/ListDespacho"); 

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
                                  <select
                                      className="form-select"
                                      id="floatingEstado"
                                      name="estado"
                                      onChange={onInputChange}
                                      value={estado}
                                      required
                                  >
                                      <option value="">Ingrese el estado actual del despacho</option>
                                      <option value="En camino">En camino</option>
                                      <option value="Entregado">Entregado</option>
                                      <option value="No entregado">No entregado</option>
                                      <option value="No se pudo entregar">No se pudo entregar</option>
                                  </select>
                                  <label htmlFor="floatingEstado">Estado del Despacho</label>
                              </div>
                              <br />
                              <div className="form-floating">
                                  <input
                                      className="form-control"
                                      id="floatingFechaEntrega"
                                      onChange={onInputChange}
                                      value={fechaEntrega}
                                      type="date"
                                      name="fechaEntrega"
                                      placeholder="Ingrese el comprobante"
                                      required
                                  />
                                  <label htmlFor="floatingFechaEntrega">Fecha de Entrega</label>
                              </div>
                              <br />
                              <button className="btn btn-primary w-100 py-2 create-btn" type="submit">Crear</button>
                              <Link to='/ListDespacho'><button className="btn btn-danger w-100 py-2 cancel-btn">Cancelar</button></Link>
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

export default FormDespacho;
