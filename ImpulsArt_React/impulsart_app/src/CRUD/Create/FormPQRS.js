import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const FormPQRS = () => {
  
    let navigate = useNavigate()

    const [PQRS, setPQRS] = useState({

        descripcion: "",
        motivo: "",
        respuesta: "No hay respuesta aun",
        estado: "Pendiente",
        fechaPQRS: new Date().toISOString().slice(0, 10),
        FkCod_TipoPQRS: ""
  
      });

    const{ descripcion, motivo, FkCod_TipoPQRS } = PQRS

    const onInputChange = (e) => {
       
        setPQRS({...PQRS, [e.target.name]:e.target.value})

    };

    const onSubmit = async (e) => {

        e.preventDefault();
        axios.post("http://localhost:8086/api/pqrs/create",PQRS)
        navigate("/ListPQRS"); 

    };

  return (
   
    <div className="container">

    <div className="row">

      <div className="col-12">

        <div className="formulario-registro">

          <h1>Crear usuario</h1>
          <form onSubmit = {(e) => onSubmit(e)}>
            <div className="identificacion">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {descripcion} type={"text"} name="descripcion" placeholder="Ingrese sus observacion" required />
            </div>
            <br />
            <select className="form-select" name="motivo" onChange = {(e) => onInputChange(e)} value = {motivo} required>
    <option value="">Ingrese el motivo de su PQRS</option>
    <option value="Producto en mal estado">Producto en mal estado</option>
    <option value="Estafa">Estafa</option>
    <option value="Tiempos de entrega">Tiempos de entrega</option>
            </select>
            <br />
            <div className="apellido">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {FkCod_TipoPQRS} type={"number"} name="FkCod_TipoPQRS" placeholder="Ingresa el tipo de PQRS" required />
            </div>
            <br />
            <div className="form-check mb-3">
              <br />
              <button type="submit" className='btn btn-outline-success'>Crear subasta</button>
            </div>
          </form>
          <div id="mensajeError" className="mensaje-error"></div>

        </div>

      </div>

    </div>

  </div>

  )
}

export default FormPQRS;
