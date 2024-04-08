import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormObra = () => {
  const navigate = useNavigate();

  const [obra, setObra] = useState({
    nombreProducto: "",
    costo: "",
    peso: "",
    tamano: "",
    cantidad: "",
    categoria: "",
    descripcion: "",
    imagen: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setObra({ ...obra, [name]: value });
  };

  const handleFileChange = (e) => {
    setObra({ ...obra, imagen: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    for (const key in obra) {
      formData.append(key, obra[key]);
    }
  
    try {
      const response = await axios.post("http://localhost:8086/api/obra/create", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      navigate("/ListObra");
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="formulario-registro">
            <h1>Crear obra</h1>
            <form onSubmit={handleSubmit}>
              <div className="identificacion">
                <input className="form-control" type="text" name="nombreProducto" value={obra.nombreProducto} onChange={handleInputChange} placeholder="Ingrese el nombre de la obra" required />
              </div>
              <br />
              <div className="imagen">
                <input className="form-control" type="file" name="imagen" accept="image/*" onChange={handleFileChange} />
              </div>
              <br />
              <div className="nombre">
                <input className="form-control" type="number" name="costo" value={obra.costo} onChange={handleInputChange} placeholder="Ingrese cuanto costara su producto" required />
              </div>
              <br />
              <div className="apellido">
                <input className="form-control" type="text" name="peso" value={obra.peso} onChange={handleInputChange} placeholder="Ingrese el peso de su obra" required />
              </div>
              <br />
              <div className="correo">
                <input className="form-control" type="text" name="tamano" value={obra.tamano} onChange={handleInputChange} placeholder="Ingrese el tamaño de su obra" required />
              </div>
              <br />
              <div className="contrasena">
                <input className="form-control" type="text" name="cantidad" value={obra.cantidad} onChange={handleInputChange} placeholder="Ingrese la cantidad de la obra" required />
              </div>
              <br />
              <select className="form-select" name="categoria" value={obra.categoria} onChange={handleInputChange} required>
    <option value="">Selecciona la categoría de su obra</option>
    <option value="Pintura">Pintura</option>
    <option value="Dibujo">Dibujo</option>
    <option value="Maqueta">Maqueta</option>
    <option value="Ceramica">Ceramica</option>
            </select>
              <br />
              <div className="direccion">
                <input className="form-control" type="text" name="descripcion" value={obra.descripcion} onChange={handleInputChange} placeholder="Ingrese una descripcion de su obra" required />
              </div>
              <br />
              <div className="form-check mb-3">
                <button type="submit" className='btn btn-outline-success'>Crear obra</button>
              </div>
            </form>
            <div id="mensajeError" className="mensaje-error"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormObra;
