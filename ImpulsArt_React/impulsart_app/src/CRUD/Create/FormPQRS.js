import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art3.avif';
import { Link } from 'react-router-dom';

//Autenticacion de apis
import '../../Auth/AuthToken';

export const FormPQRS = () => {
  
    let navigate = useNavigate()

    const [PQRS, setPQRS] = useState({

        descripcion: "",
        motivo: "",
        respuesta: "No hay respuesta aun",
        estado: "Pendiente",
        fechaPQRS: new Date().toISOString().slice(0, 10),
        fkCod_TipoReclamo: ""
  
      });

    const{ descripcion, motivo, fkCod_TipoReclamo } = PQRS

    const onInputChange = (e) => {
       
        setPQRS({...PQRS, [e.target.name]:e.target.value})

    };

    const onSubmit = async (e) => {

        e.preventDefault();
        axios.post("http://localhost:8086/api/reclamo/create",PQRS)
        navigate("/ListPQRS"); 

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
                          <div className="form-floating">
                              <input
                                  className="form-control"
                                  id="floatingDescripcion"
                                  onChange={onInputChange}
                                  value={descripcion}
                                  type="text"
                                  name="descripcion"
                                  placeholder="Ingrese sus observaciones"
                                  required
                              />
                              <label htmlFor="floatingDescripcion">Descripción</label>
                          </div>
                          <br />
                          <div className="form-floating">
                              <select
                                  className="form-control"
                                  id="floatingMotivo"
                                  onChange={onInputChange}
                                  value={motivo}
                                  name="motivo"
                                  required
                              >
                                  <option value="">Seleccione el motivo de su queja</option>
                                  <option value="Producto en mal estado">Producto en mal estado</option>
                                  <option value="Estafa">Estafa</option>
                                  <option value="Tiempos de entrega">Tiempos de entrega</option>
                              </select>
                              <label htmlFor="floatingMotivo">Motivo</label>
                          </div>
                          <br />
                          <div className="form-floating">
                              <input
                                  className="form-control"
                                  id="floatingTipoPQRS"
                                  onChange={onInputChange}
                                  value={fkCod_TipoReclamo}
                                  type="number"
                                  name="fkCod_TipoReclamo"
                                  placeholder="Ingrese el tipo de queja"
                                  required
                              />
                              <label htmlFor="floatingTipoPQRS">Tipo de queja</label>
                          </div>
                          <br />
                          <button className="btn btn-primary w-100 py-2 create-btn" type="submit">Crear</button>
                          <Link to='/ListPQRS'><button className="btn btn-danger w-100 py-2 cancel-btn">Cancelar</button></Link>
                      </form>
                  </div>
              </div>
              <div className='col-md-6'>
                  <img className='register-img' src={Art} alt="" />
              </div>
          </div>
          <div className="footer-register">
              {/* Agrega el componente de Footer si es necesario */}
          </div>
      </div>
  );
};

export default FormPQRS;
