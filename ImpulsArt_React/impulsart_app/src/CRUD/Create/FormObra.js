import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art3.avif';
import Navbar_init from '../../Components/Navbar_init';
import Footer from '../../Components/Footer';
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from 'primereact/toast';
import Swal from 'sweetalert2';
import '../../Styles/CreateObra.css';

//Autenticacion de apis
import AuthToken from '../../Auth/AuthToken';
// Asegúrate Obtener datos del usuario
import GetUserInfo from '../../Auth/GetUserInfo'; 


const FormObra = () => {
  const navigate = useNavigate();
  const [identificacion, setIdentificacion] = useState('');
  const toast = useRef(null); // Definición de la referencia para el Toast

  const [obra, setObra] = useState({
    nombreProducto: "",
    costo: "",
    peso: "",
    tamano: "",
    alto: "",
    ancho: "", 
    cantidad: "",
    categoriaId: "",  // Cambiado a "categoria"
    descripcion: "",
    usuarioIds: identificacion,
    imagen: null
  });
  const [categorias, setCategorias] = useState([]); 
  const [isDescriptionOverLimit, setIsDescriptionOverLimit] = useState(false);

  useEffect(() => {

    //Cargar identificacion
    const { identificacion } = GetUserInfo();
    setIdentificacion(identificacion);
    
    const loadCategorias = async () => {
      try {
        const result = await AuthToken.get('categoria/all');
        setCategorias(result.data.data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    loadCategorias();
  }, []);  // Asegúrate de que el efecto se ejecute cuando identificacion cambie


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'alto' || name === 'ancho') {
      const rawValue = value.replace(/[^\d]/g, '');
      const updatedValue = rawValue ? `${rawValue}cm` : ''; // Solo agrega "cm" si hay un número
      setObra(prevObra => {
        const updatedObra = { ...prevObra, [name]: updatedValue };
        if (updatedObra.alto && updatedObra.ancho) {
          updatedObra.tamano = `${updatedObra.alto} x ${updatedObra.ancho}`;
        } else {
          updatedObra.tamano = updatedObra.alto || updatedObra.ancho ? `${updatedObra.alto} x ${updatedObra.ancho}` : '';
        }
        return updatedObra;
      });
    } else {
      setObra(prevObra => ({ ...prevObra, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar si algún campo está vacío
    if (!obra.nombreProducto || !obra.costo || !obra.peso || !obra.tamano || !obra.cantidad || !obra.categoriaId || !obra.descripcion || !obra.imagen) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos deben estar completos' });
      return;
    }
  
    if (obra.nombreProducto.length > 50) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El nombre de la obra debe contener un máximo de 50 caracteres' });
      return;
    }
    
    if (obra.costo === "$0") {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El costo no puede ser 0' });
      return;
    }
  
    if (obra.peso === "0Kg") {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El peso no puede ser 0Kg' });
      return;
    }
  
    if (obra.alto === "0cm" || obra.ancho === "0cm") {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El tamaño no puede ser 0cm' });
      return;
    }
  
    if (obra.cantidad === "0") {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La cantidad no puede ser 0' });
      return;
    }
  
    // Mostrar SweetAlert2 para confirmación
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8D33FF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, crear obra!",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Si se confirma, envía los datos del formulario
        try {
          const formData = new FormData();
          for (const key in obra) {
            formData.append(key, obra[key]);
          }
  
          const result = await AuthToken.post("http://localhost:8086/api/obra/create", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
  
          Swal.fire(
            'Felicidades!',
            'Has subido una nuvea obra con exito.',
            'success'
          ).then(() => {
            // Redirigir según el rol del usuario
            if (result.isConfirmed) {
              navigate(-1);
            } else {
              navigate(-1);
            }
          });
        } catch (error) {
          console.error('Error al enviar el formulario:', error.response ? error.response.data : error.message);
          Swal.fire(
            'Error!',
            'Hubo un problema al crear la obra.',
            'error'
          );
        }
      }
    });
  };  

  const handleCancel = () => {
    // Verificar si algún campo del formulario tiene datos
    const hasData = Object.values(obra).some(value => value !== "" && value !== null);
  
    if (hasData) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se perderán los datos no guardados!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8D33FF',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          navigate(-1);
        }
      });
    } else {
      navigate(-1);
    }
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

  const handleFileChange = (e) => {
    setObra({ ...obra, imagen: e.target.files[0] });
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
                  <input className="form-control" id="floatingNombreProducto" placeholder="Nombre de la obra" name="nombreProducto" value={obra.nombreProducto} onChange={handleInputChange} type="text"/>
                  <label htmlFor="floatingNombreProducto">Nombre de la obra</label>
                </div>
                <div className="form-row">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input className="form-control" id="floatingCosto" placeholder="Costo" name="costo" value={obra.costo} onChange={handleCostoChange} type="text"/>
                        <label htmlFor="floatingCosto">Costo</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input className="form-control" id="floatingPeso" placeholder="Peso" name="peso" value={obra.peso} onChange={handlePesoChange} type="text"/>
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
                              <input className="form-control form-tamano" id="floatingAlto" placeholder="Alto" name="alto" value={obra.alto} onChange={handleInputChange} type="text"/>
                              <label htmlFor="floatingAlto">Alto</label>
                            </div>
                          </div>
                          <div className="col-md-1 text-center">
                            <span className="tamano-separator">×</span>
                          </div>
                          <div className="col-md-5">
                            <div className="form-floating">
                              <input className="form-control form-tamano" id="floatingAncho" placeholder="Ancho" name="ancho" value={obra.ancho} onChange={handleInputChange} type="text"/>
                              <label htmlFor="floatingAncho">Ancho</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-cantidad">
                        <input className="form-control" id="floatingCantidad" placeholder="Nombre de la obra" name="cantidad" value={obra.cantidad} onChange={(e) => {const value = e.target.value; if (value === '' || (Number(value) >= 0)) {setObra(prevObra => ({ ...prevObra, cantidad: value })); }}} min="0"  type="number"/>
                        <label htmlFor="floatingCantidad">Cantidad</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-floating">
                    <select
                      className="form-control"
                      id="floatingCategoriaId"
                      name="categoriaId"  // Cambiado a "categoria"
                      value={obra.categoriaId}
                      onChange={handleInputChange}
                                        >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map(categoria => (
                            <option key={categoria.pkCod_Categoria} value={categoria.pkCod_Categoria}>
                                {categoria.nombreCategoria}
                            </option>
                        ))}
                    </select>

                        <label htmlFor="floatingCategoriaId">Categoría</label>
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
                <div className="btn-group d-flex justify-content-center" >
                    <button className="btn btn-create btn-primary py-2 create-btn" type="submit">Crear Obra</button>
                    <button className="btn btn-cancel btn-secondary py-2 cancel-btn" type="button" onClick={handleCancel}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 image-wrapper">
            <img className="createObra-img" src={Art} alt="Art" />
          </div>
        </div>
      </div>
      <Footer />
      <Toast ref={toast} /> 
    </>
  );
};

export default FormObra;