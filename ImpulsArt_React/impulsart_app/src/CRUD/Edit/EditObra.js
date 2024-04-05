import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

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
   
    <div className="container">

    <div className="row">

      <div className="col-12">

        <div className="formulario-registro">

          <h1>Editar obra</h1>
          <form onSubmit = {(e) => onSubmit(e)}>
            <div className="identificacion">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {nombreProducto} type={"text"} name="nombreProducto" placeholder="Ingrese el nombre de la obra" required />
            </div>
            <br />
            <div className="nombre">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {costo} type={"number"} name="costo" placeholder="Ingrese cuanto costara su producto" required />
            </div>
            <br />
            <div className="apellido">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {peso} type={"text"} name="peso" placeholder="Ingrese el peso de su obra" required />
            </div>
            <br />
            <div className="correo">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {tamano} type={"text"} name="tamano" placeholder="Ingrese el tamaño de su obra" required />
            </div>
            <br />
            <div className="contrasena">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {cantidad} type={"number"} name="cantidad" placeholder="Ingrese la cantidad de la obra" required />
            </div>
            <br />
            <div className="fecha_nacimiento">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {categoria} type={"text"} name="categoria" placeholder="Ingresa la categoria de su obra" required />
            </div>
            <br />
            <div className="direccion">
              <input className="form-control" onChange = {(e) => onInputChange(e)} value = {descripcion} type={"text"} name="descripcion" placeholder="Ingrese una descripcion de su obra" required />
            </div>
            <br />
            <div className="form-check mb-3">
              <button type="submit" className='btn btn-outline-success'>Editar obra</button>
            </div>
          </form>
          <div id="mensajeError" className="mensaje-error"></div>

        </div>

      </div>

    </div>

  </div>

  )
}

export default EditObra;
