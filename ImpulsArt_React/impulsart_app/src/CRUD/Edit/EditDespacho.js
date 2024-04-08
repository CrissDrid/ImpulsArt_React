import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export const EditDespacho = () => {
  
    let navigate = useNavigate()

    const {pkCod_Despacho} = useParams()

    const [despacho, setDespacho] = useState ({

        estado: "",
        comprobante: "",
        fechaEntrega: new Date().toISOString().slice(0, 10),
        fecha_venta: new Date().toISOString().slice(0, 10)

    })

    const{ estado, comprobante } = despacho

    const onInputChange = (e) => {
       
        setDespacho({...despacho, [e.target.name]:e.target.value})

    };

    const onSubmit = async (e) => {

        e.preventDefault();
        axios.put(`http://localhost:8086/api/despacho/update/${pkCod_Despacho}`,despacho)
        navigate("/ListDespacho"); 

    };

    useEffect(() => {
      
        const loadObra = async () => {
          const result = await axios.get(`http://localhost:8086/api/despacho/list/${pkCod_Despacho}`);
          setDespacho(result.data.data);
        };
        loadObra();
      }, [pkCod_Despacho]);

  return (
   
    <div className="container">

    <div className="row">

      <div className="col-12">

        <div className="formulario-registro">

          <h1>Editar despacho</h1>
          <form onSubmit = {(e) => onSubmit(e)}>
            <div className="identificacion">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {estado} type={"text"} name="estado" placeholder="Ingrese el estado actual del despacho" required />
            </div>
            <br />
            <div className="nombre">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {comprobante} type={"text"} name="comprobante" placeholder="Ingrese el comprobante" required />
            </div>
            <br />
            <div className="form-check mb-3">
              <button type="submit" className='btn btn-outline-success'>Editar despacho</button>
            </div>
          </form>
          <div id="mensajeError" className="mensaje-error"></div>

        </div>

      </div>

    </div>

  </div>

  )
}

export default EditDespacho;
