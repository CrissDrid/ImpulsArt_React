import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export const EditPQRS = () => {

    let navigate = useNavigate()

    const {pkCod_PQRS} = useParams()

    const [PQRS, setPQRS] = useState ({

         descripcion: "El producto no es lo que me llego",
         motivo: "estafa"
        
    })

    const{ descripcion, motivo } = PQRS

    const onInputChange = (e) => {
       
        setPQRS({...PQRS, [e.target.name]:e.target.value})

    };

    const onSubmit = async (e) => {

        e.preventDefault();
        axios.put(`http://localhost:8086/api/pqrs/update/${pkCod_PQRS}`,PQRS)
        navigate("/ListPQRS"); 

    };

    useEffect(() => {
      
        const loadPQRS = async () => {
          const result = await axios.get(`http://localhost:8086/api/pqrs/list/${pkCod_PQRS}`);
          setPQRS(result.data.data);
        };
        loadPQRS();
      }, [pkCod_PQRS]);

    return (
  
    <div className="container">

    <div className="row">

      <div className="col-12">

        <div className="formulario-registro">

          <h1>Editar PQRS</h1>
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
            <div className="form-check mb-3">
              <br />
              <button type="submit" className='btn btn-outline-success'>Editar</button>
            </div>
          </form>
          <div id="mensajeError" className="mensaje-error"></div>

        </div>

      </div>

    </div>

  </div>

  )

}

export default EditPQRS;