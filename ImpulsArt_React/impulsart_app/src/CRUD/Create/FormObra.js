import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art3.avif';
import Navbar_init from '../../Components/Navbar_init';
import Footer from '../../Components/Footer';
import { InputTextarea } from "primereact/inputtextarea";
import '../../Styles/CreateObra.css';

const FormObra = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(JSON.parse(localStorage.getItem('userRoles')) || { tipoUsuario: 'usuario común' });
  const [obra, setObra] = useState({
    nombreProducto: "",
    costo: "",
    peso: "",
    alto: "",
    ancho: "",
    cantidad: "",
    categoria: "",
    descripcion: "",
    imagen: null
  });
  const [categorias, setCategorias] = useState([]); // Definir el estado para categorías
  const [isDescriptionOverLimit, setIsDescriptionOverLimit] = useState(false);

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('userRoles'));
    if (storedRoles) {
      setRoles(storedRoles);
    }
    loadCategorias(); // Corregir el llamado a loadCategorias
  }, []);

  const loadCategorias = async () => {
    try {
      const result = await axios.get('http://localhost:8086/api/categoria/all');
      setCategorias(result.data.data);  // Supongo que las categorías están en result.data.data
    } catch (error) {
      console.error('Error al cargar las categorías:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'alto' || name === 'ancho') {
      setObra({ ...obra, [name]: value.replace(/[^\d]/g, '') + "cm" });
    } else {
      setObra({ ...obra, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setObra({ ...obra, imagen: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obraData = { ...obra, costo: obra.costo.replace(/[^\d]/g, '') };
    const formData = new FormData();
    for (const key in obraData) {
      formData.append(key, obraData[key]);
    }
    try {
      const response = await axios.post("http://localhost:8086/api/obra/create", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data);
      navigate("/ListObra");
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  const handleCancel = () => {
    navigate(roles.tipoUsuario === 'Administrador' ? '/ListObra' : '/Profile');
  };

  const formatCurrency = (value) => {
    const number = value.replace(/[^\d]/g, '');
    return `$${new Intl.NumberFormat('es-CO').format(number)}`;
  };

  const handleCostoChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    setObra({ ...obra, costo: formatCurrency(rawValue) });
  };

  const handlePesoChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value !== "") {
      value += "Kg";
    }
    setObra({ ...obra, peso: value });
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setObra({ ...obra, descripcion: value });
    setIsDescriptionOverLimit(value.length > 155);
  };

  return (
    <>
      <Navbar_init />
      <div className="register-container">
        <div className="register-content row justify-content-center">
          <div className='col-md-6'>
            <div className="register-form">
              <div className="register-image">
                <img className="logo-register" src={Logo} alt="Logo" />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-floating">
                  <input className="form-control" id="floatingNombreProducto" placeholder="Nombre de la obra" name="nombreProducto" value={obra.nombreProducto} onChange={handleInputChange} type="text" required />
                  <label htmlFor="floatingNombreProducto">Nombre de la obra</label>
                </div>
                <div className="form-row">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input className="form-control" id="floatingCosto" placeholder="Costo" name="costo" value={obra.costo} onChange={handleCostoChange} type="text" required />
                        <label htmlFor="floatingCosto">Costo</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input className="form-control" id="floatingPeso" placeholder="Peso" name="peso" value={obra.peso} onChange={handlePesoChange} type="text" required />
                        <label htmlFor="floatingPeso">Peso</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="group-tamano">
                        <label htmlFor="tamano">Tamaño</label>
                        <div className="row tamano-group">
                          <div className="col-md-5">
                            <div className="form-floating">
                              <input className="form-control form-tamano" id="floatingAlto" placeholder="Alto" name="alto" value={obra.alto} onChange={handleInputChange} type="text" required />
                              <label htmlFor="floatingAlto">Alto</label>
                            </div>
                          </div>
                          <div className="col-md-1 text-center">
                            <span className="tamano-separator">×</span>
                          </div>
                          <div className="col-md-5">
                            <div className="form-floating">
                              <input className="form-control form-tamano" id="floatingAncho" placeholder="Ancho" name="ancho" value={obra.ancho} onChange={handleInputChange} type="text" required />
                              <label htmlFor="floatingAncho">Ancho</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                    <div className="form-floating form-categoria">
  <select
    className="form-control"
    id="floatingCategoriaId"
    name="categoria"
    value={obra.categoria}
    onChange={handleInputChange}
    required
  >
    <option value="" disabled>Seleccione una categoría</option> {/* Opción predeterminada */}
    {categorias.map(categoria => (
      <option key={categoria.pkCod_Categoria} value={categoria.pkCod_Categoria}>
        {categoria.nombreCategoria}
      </option>
    ))}
  </select>
  <label htmlFor="floatingCategoria">Categoría</label>
</div>
                    </div>
                  </div>
                </div>
                <div className={`form-floating ${isDescriptionOverLimit ? 'input-error' : ''}`}>
                  <InputTextarea 
                    className="form-control" 
                    style={{ resize: 'none', width: '100%', height: '10rem' }} 
                    placeholder="Descripción" 
                    name="descripcion" 
                    value={obra.descripcion} 
                    onChange={handleDescriptionChange}
                    maxLength="155"
                  />
                  <label htmlFor="floatingDescripcion">Descripción</label>
                  <div className="character-counter d-flex justify-content-end">
                    {obra.descripcion.length}/155
                  </div>
                </div>
                <div className="form-group">
                  <div className="image-upload" onClick={() => document.getElementById('fileInput').click()}>
                    {obra.imagen ? (
                      <img src={URL.createObjectURL(obra.imagen)} alt="Previsualización" className="img-fluid preview-image" />
                    ) : (
                      <div className="image-placeholder">
                        <i className="cross-icon bi bi-plus"></i>
                        <p className='text-subirObra'>Subir Imagen</p>
                      </div>
                    )}
                    <input id="fileInput" type="file" name="imagen" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </div>
                </div>
                <div className="btn-group justify-content-center">
                    <button className="btn btn-primary py-2 create-btn" type="submit">Crear obra</button>
                    <button className="btn btn-danger py-2 cancel-btn" type="button" onClick={handleCancel}>Cancelar</button>
                  </div>
              </form>
            </div>
          </div>
          <div className='col-md-6'>
            <img className="imgArt" src={Art} alt="Arte" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FormObra;
