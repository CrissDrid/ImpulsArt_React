import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export const EditSubasta = () => {
  
    const {pkCodSubasta} = useParams()

    let navigate = useNavigate()

    const [subasta, setSubasta] = useState ({

        estadoSubasta: "Activo",
        precioInicial: "",
        fechaInicio: new Date().toISOString().slice(0, 10),

    })

    const{ precioInicial, fechaFinalizacion } = subasta

    const onInputChange = (e) => {
       
        setSubasta({...subasta, [e.target.name]:e.target.value})

    };

    const onSubmit = async (e) => {

        e.preventDefault();
        axios.put(`http://localhost:8086/api/subasta/update/${pkCodSubasta}`,subasta)
        navigate("/ListSubasta");

    };

    useEffect(() => {
      
      const loadSubasta = async () => {
        const result = await axios.get(`http://localhost:8086/api/subasta/list/${pkCodSubasta}`);
        setSubasta(result.data.data);
      };
      loadSubasta();
    }, [pkCodSubasta]);

  return (
   
    <div className="container">

    <div className="row">

      <div className="col-12">

        <div className="formulario-registro">

          <h1>Editar subasta</h1>
          <form onSubmit = {(e) => onSubmit(e)}>
            <div className="identificacion">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {precioInicial} type={"number"} name="precioInicial" placeholder="Ingrese la oferta minima que se debe ingresar" required />
            </div>
            <br />
            <div className="nombre">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {fechaFinalizacion} type={"date"} name="fechaFinalizacion" placeholder="Ingrese cuando terminara su subasta" required />
            </div>
            <br />
            <div className="form-check mb-3">
              <br />
              <button type="submit" className='btn btn-outline-success'>Editar subasta</button>
            </div>
          </form>
          <div id="mensajeError" className="mensaje-error"></div>

        </div>

      </div>

    </div>

  </div>

  )
}

export default EditSubasta;
