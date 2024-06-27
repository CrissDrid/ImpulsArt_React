import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art3.avif';
import { Link } from 'react-router-dom';

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
    <div className="register-container">
      <div className="register-content row justify-content-center">
        <div className='col-md-6'>
          <div className="register-form">
            <div className="register-image">
              <img className="logo-register" src={Logo} alt="Logo" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input className="form-control" id="floatingNombreProducto" placeholder="Nombre de la obra" name="nombreProducto" value={obra.nombreProducto} onChange={handleInputChange} type="text" required />
                      <label htmlFor="floatingNombreProducto">Nombre de la obra</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input className="form-control" id="floatingCosto" placeholder="Costo" name="costo" value={obra.costo} onChange={handleInputChange} type="number" required />
                      <label htmlFor="floatingCosto">Costo</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-floating">
                <input className="form-control" id="floatingPeso" placeholder="Peso" name="peso" value={obra.peso} onChange={handleInputChange} type="text" required />
                <label htmlFor="floatingPeso">Peso</label>
              </div>
              <div className="form-floating">
                <input className="form-control" id="floatingTamano" placeholder="Tamaño" name="tamano" value={obra.tamano} onChange={handleInputChange} type="text" required />
                <label htmlFor="floatingTamano">Tamaño</label>
              </div>
              <div className="form-floating">
                <input className="form-control" id="floatingCantidad" placeholder="Cantidad" name="cantidad" value={obra.cantidad} onChange={handleInputChange} type="text" required />
                <label htmlFor="floatingCantidad">Cantidad</label>
              </div>
              <div className="form-floating">
                <select className="form-select" id="floatingCategoria" name="categoria" value={obra.categoria} onChange={handleInputChange} required>
                  <option value="">Selecciona la categoría de su obra</option>
                  <option value="Pintura">Pintura</option>
                  <option value="Dibujo">Dibujo</option>
                  <option value="Maqueta">Maqueta</option>
                  <option value="Ceramica">Ceramica</option>
                </select>
                <label htmlFor="floatingCategoria">Categoría</label>
              </div>
              <div className="form-floating">
                <input className="form-control" id="floatingDescripcion" placeholder="Descripción" name="descripcion" value={obra.descripcion} onChange={handleInputChange} type="text" required />
                <label htmlFor="floatingDescripcion">Descripción</label>
              </div>
              <div className="form-group">
                <div className="image-upload" onClick={() => document.getElementById('fileInput').click()}>
                  {obra.imagen ? (
                    <img src={URL.createObjectURL(obra.imagen)} alt="Previsualización" className="img-fluid preview-image" />
                  ) : (
                    <div className="image-placeholder">
                      <span className="cross-icon">+</span>
                      <p>Subir Imagen</p>
                    </div>
                  )}
                  <input id="fileInput" type="file" name="imagen" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </div>
              </div>
              <br></br>
              <button className="btn btn-primary w-100 py-2 create-btn" type="submit">Crear obra</button>
              <Link to='/ListObra'><button className="btn btn-danger w-100 py-2 cancel-btn">Cancelar</button></Link>
            </form>
          </div>
        </div>
        <div className='col-md-6'>
          <img className='register-img' src={Art} alt="" />
        </div>
      </div>
      <div className="footer-register">
      </div>
    </div>
  );
};

export default FormObra;
