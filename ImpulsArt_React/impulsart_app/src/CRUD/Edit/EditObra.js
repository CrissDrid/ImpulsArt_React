import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art3.avif';
import { Link } from 'react-router-dom';

export const EditObra = () => {

    let navigate = useNavigate()

    const {pkCod_Producto} = useParams()

    const [obra, setObra] = useState ({

        nombreProducto:"",
        costo: "",
        peso: "",
        tamano: "",
        cantidad: "",
        categoria: "",
        descripcion: ""

    })

    const{nombreProducto, costo, peso, tamano, cantidad, categoria, descripcion } = obra

    const onInputChange = (e) => {
       
        setObra({...obra, [e.target.name]:e.target.value})

    };

    const onSubmit = async (e) => {

        e.preventDefault();
        axios.put(`http://localhost:8086/api/obra/update/${pkCod_Producto}`,obra)
        navigate("/ListObra"); 

    };

    useEffect(() => {
      
        const loadObra = async () => {
          const result = await axios.get(`http://localhost:8086/api/obra/list/${pkCod_Producto}`);
          setObra(result.data.data);
        };
        loadObra();
      }, [pkCod_Producto]);

      return (
        <div className="register-container">
          <div className="register-content row justify-content-center">
            <div className="col-md-6">
              <div className="register-form">
              <div className="register-image">
                <img className="logo-register" src={Logo} alt=""/>
              </div>
                <form onSubmit={(e) => onSubmit(e)}>
                  <div className="form-row">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            className="form-control"
                            onChange={(e) => onInputChange(e)}
                            value={nombreProducto}
                            type="text"
                            name="nombreProducto"
                            placeholder="Ingrese el nombre de la obra"
                            required
                          />
                          <label htmlFor="floatingName">Nombre</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            className="form-control"
                            onChange={(e) => onInputChange(e)}
                            value={peso}
                            type="text"
                            name="peso"
                            placeholder="Ingrese el peso de su obra"
                            required
                          />
                          <label htmlFor="floatingLastName">Peso</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-floating">
                    <input
                      className="form-control"
                      onChange={(e) => onInputChange(e)}
                      value={costo}
                      type="number"
                      name="costo"
                      placeholder="Ingrese cuanto costará su producto"
                      required
                    />
                    <label htmlFor="floatingId">Costo</label>
                  </div>
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => onInputChange(e)}
                      value={tamano}
                      name="tamano"
                      placeholder="Ingrese el tamaño de su obra"
                      required
                    />
                    <label htmlFor="floatingUserName">Tamaño</label>
                  </div>
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) => onInputChange(e)}
                      value={cantidad}
                      name="cantidad"
                      placeholder="Ingrese la cantidad de la obra"
                      required
                    />
                    <label htmlFor="floatingEmail">Cantidad</label>
                  </div>
                  <div className="form-floating">
              <input className="form-control" id="floatingCantidad" placeholder="ID categoria" name="categoria" value={categoria} onChange={(e) => onInputChange(e)} type="number" required />
              <label htmlFor="floatingCantidad">Categoria</label>
              </div>
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => onInputChange(e)}
                      value={descripcion}
                      name="descripcion"
                      placeholder="Ingrese una descripción de su obra"
                      required
                    />
                    <label htmlFor="floatingAddress">Descripción</label>
                  </div>
                  <button className="btn btn-primary w-50 py-2 create-btn" type="submit">Editar obra</button>
              <Link to='/ListObra'><button className="btn btn-danger w-100 py-2 cancel-btn">Cancelar</button></Link>
                </form>
              </div>
            </div>
            <div className='col-md-6'>
              <img className='register-img' src={Art} alt="Imagen de obra" />
            </div>
          </div>
          <div className="footer-register">
          </div>
        </div>
      );
    };

export default EditObra;
