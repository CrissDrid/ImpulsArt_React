import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

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
   
    <div className="container">

    <div className="row">

      <div className="col-12">

        <div className="formulario-registro">

          <h1>Crear usuario</h1>
          <form onSubmit = {(e) => onSubmit(e)}>
            <div className="identificacion">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {precioInicial} type={"number"} name="precioInicial" placeholder="Ingrese la oferta minima que se debe ingresar" required />
            </div>
            <br />
            <div className="nombre">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {fechaFinalizacion} type={"date"} name="fechaFinalizacion" placeholder="Ingrese cuando terminara su subasta" required />
            </div>
            <br />
            <div className="apellido">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {FkCod_Producto} type={"number"} name="FkCod_Producto" placeholder="Con que producto quiere hacer la subasta (foranea de obra)" required />
            </div>
            <br />
            <div className="form-check mb-3">
              <br />
              <button type="submit">Crear subasta</button>
            </div>
          </form>
          <div id="mensajeError" className="mensaje-error"></div>

        </div>

      </div>

    </div>

  </div>

  )
}

export default FormSubasta;
