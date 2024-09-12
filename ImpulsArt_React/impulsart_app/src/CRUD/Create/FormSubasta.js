import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art4.jpg';
import Navbar_init from '../../Components/Navbar_init';
import Footer from '../../Components/Footer';
import { Toast } from 'primereact/toast';
import Swal from 'sweetalert2';
import '../../Styles/CreateSubasta.css';

//Autenticacion de apis
import AuthToken from '../../Auth/AuthToken';
// Asegúrate Obtener datos del usuario
import GetUserInfo from '../../Auth/GetUserInfo';

export const FormSubasta = () => {

  let navigate = useNavigate();
  const toast = useRef(null);
  const [identificacion, setIdentificacion] = useState('');
  const [subasta, setSubasta] = useState({
    nombreProducto: "",
    peso: "",
    costo: 0,
    tamano: "",
    alto: "",
    ancho: "",
    categoriaId: "",
    cantidad: 1,
    descripcion: "",
    estadoSubasta: "Activo",
    precioInicial: "",
    fechaFinalizacion: "",
    fechaInicio: "",
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

  //Actualizar el id user
  useEffect(() => {
    if (identificacion) {
      setSubasta(prevSubasta => ({
        ...prevSubasta,
        usuarioIds: identificacion
      }));
    }
  }, [identificacion]);

  useEffect(() => {
    // Establecer fechaInicio a la fecha y hora actual
    const now = new Date();
    const fechaInicio = now.toISOString().slice(0, 16);  // Formato datetime-local
    setSubasta(prevSubasta => ({ ...prevSubasta, fechaInicio }));
  }, []);

  const validateFechaFinalizacion = (fechaFinalizacion) => {
    const fechaSeleccionada = new Date(fechaFinalizacion);
    const fechaActual = new Date();
    const unDia = new Date(fechaActual.getTime() + 24 * 60 * 60 * 1000);
    const cincoDias = new Date(fechaActual.getTime() + 5 * 24 * 60 * 60 * 1000);

    if (fechaSeleccionada < unDia) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La fecha de finalización debe ser al menos 1 día a partir de hoy.'
      });
      return false;
    }

    if (fechaSeleccionada > cincoDias) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La fecha de finalización no puede ser más de 5 días a partir de hoy.'
      });
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'alto' || name === 'ancho') {
      // Eliminar caracteres no numéricos
      const rawValue = value.replace(/[^\d]/g, '');
      // Convertir el valor a número
      const numberValue = parseInt(rawValue, 10);
      // Limitar el valor a 150 si supera el límite
      const limitedValue = numberValue > 150 ? 150 : numberValue;
      // Actualizar el valor con la unidad 'cm'
      const updatedValue = limitedValue ? `${limitedValue}cm` : '';

      setSubasta(prevSubasta => {
        const updatedObra = { ...prevSubasta, [name]: updatedValue };
        // Actualizar el campo 'tamano'
        if (updatedObra.alto && updatedObra.ancho) {
          updatedObra.tamano = `${updatedObra.alto} x ${updatedObra.ancho}`;
        } else {
          updatedObra.tamano = updatedObra.alto || updatedObra.ancho ? `${updatedObra.alto} x ${updatedObra.ancho}` : '';
        }
        return updatedObra;
      });
    } else if (name === 'ofertaInicial') {
      // Actualizar el valor sin formatear
      const rawValue = value.replace(/[^0-9]/g, ''); // Eliminar todo excepto números
      setSubasta(prevObra => ({ ...prevObra, [name]: rawValue }));
    } else {
      setSubasta(prevObra => ({ ...prevObra, [name]: value }));
    }
  };

  const handlePesoChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, ''); // Elimina caracteres no numéricos

    if (value === "") {
      setSubasta({ ...subasta, peso: "" }); // Si está vacío, no establecer valor
      return;
    }

    let numericValue = Number(value);

    if (numericValue === 0) {
      // No permitir valor 0
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El peso debe ser mayor que 0.' });
      return;
    }

    if (numericValue > 50) {
      value = "50Kg"; // Limitar a 50Kg si se supera el límite
    } else {
      value += "Kg";
    }

    setSubasta({ ...subasta, peso: value });
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setSubasta({ ...subasta, descripcion: value });
    setIsDescriptionOverLimit(value.length > 155);
  };

  const handleFileChange = (e) => {
    setSubasta({ ...subasta, imagen: e.target.files[0] });
  };

  const isOnlyLettersWithValidSpaces = (str) => {
    // Permitir solo letras y un solo espacio entre palabras, sin espacios al inicio o al final
    return /^[A-Za-z]+( [A-Za-z]+)*$/.test(str);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!subasta.nombreProducto || !subasta.precioInicial || !subasta.peso || !subasta.tamano || !subasta.categoriaId || !subasta.descripcion || !subasta.imagen || !subasta.fechaFinalizacion) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos deben estar completos' });
      return;
    }

    if (subasta.nombreProducto.length > 50) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El nombre de la obra debe contener un máximo de 50 caracteres' });
      return;
    }

    if (!isOnlyLettersWithValidSpaces(subasta.nombreProducto)) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El nombre de la obra solo debe contener letras y un solo espacio entre palabras, sin espacios al inicio o al final', life: 3000 });
      return;
    }

    if (!isOnlyLettersWithValidSpaces(subasta.descripcion)) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La descripcion de la obra solo debe contener letras y un solo espacio entre palabras, sin espacios al inicio o al final', life: 3000 });
      return;
    }

    // Validar fecha de finalización
    if (!validateFechaFinalizacion(subasta.fechaFinalizacion)) {
      return;  // Si la validación falla, no continuar
    }


    if (subasta.alto === "0cm" || subasta.ancho === "0cm") {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El tamaño no puede ser 0cm' });
      return;
    }

    if (subasta.peso === "0Kg") {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El peso no puede ser 0Kg' });
      return;
    }

    // Validar el precio inicial
    const rawPrice = subasta.precioInicial.replace(/[^0-9]/g, '');
    if (parseInt(rawPrice, 10) > 1500000) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La oferta inicial no puede superar $1,500,000' });
      return;
    }

    if (subasta.precioInicial === "$0") {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La oferta inicial no puede ser $0' });
      return;
    }

    // Muestra el SweetAlert de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8D33FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear obra!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('nombreProducto', subasta.nombreProducto);
        formData.append('peso', subasta.peso);
        formData.append('costo', subasta.costo);
        formData.append('tamano', subasta.tamano);
        formData.append('alto', subasta.alto);
        formData.append('ancho', subasta.ancho);
        formData.append('categoriaId', subasta.categoriaId);
        formData.append('cantidad', subasta.cantidad);
        formData.append('descripcion', subasta.descripcion);
        formData.append('estadoSubasta', subasta.estadoSubasta);
        formData.append('precioInicial', subasta.precioInicial.replace(/[^0-9]/g, ''));
        formData.append('fechaInicio', subasta.fechaInicio);
        formData.append('fechaFinalizacion', subasta.fechaFinalizacion);  // Ajustar fechaFinalizacion
        formData.append('usuarioIds', subasta.usuarioIds);
        if (subasta.imagen) {
          formData.append('imagen', subasta.imagen);
        }

        try {
          const response = await AuthToken.post("subasta/create", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log(response.data);

          // Muestra el SweetAlert de éxito
          Swal.fire(
            '¡Felicidades!',
            'Has iniciado una subasta con éxito.',
            'success'
          );

          navigate(-1);

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
    const hasData = Object.values(subasta).some(value => value !== "" && value !== null);

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

  const handlePrecioInicialChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos

    if (value === "") {
      setSubasta({ ...subasta, precioInicial: "" }); // Si está vacío, no establecer valor
      return;
    }

    setSubasta({ ...subasta, precioInicial: formatCurrency(value) });
  };


  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  };

  return (
    <>
      <Navbar_init />
      <div className="register-container">
        <div className="subasta-content row">
          <div className="col-md-6 image-wrapper">
            <img className="createSubasta-img" src={Art} alt="Art" />
          </div>
          <div className='col-md-6 '>
            <div className="form-subasta-container">
              <div className="register-image">
                <img className="logo-register" src={Logo} alt="Logo" />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-floating">
                  <input className="form-control" id="floatingNombreProducto" placeholder="Nombre del producto" name="nombreProducto" value={subasta.nombreProducto} onChange={handleInputChange} type="text" />
                  <label htmlFor="floatingNombreProducto">Nombre del producto</label>
                </div>
                <div className="form-row">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="group-tamano">
                        <label htmlFor="tamano">Tamaño</label>
                        <div className="row tamano-group">
                          <div className="col-md-5">
                            <div className="form-floating">
                              <input className="form-control form-tamano" id="floatingAlto" placeholder="Alto" name="alto" value={subasta.alto} onChange={handleInputChange} type="text" />
                              <label htmlFor="floatingAlto">Alto</label>
                            </div>
                          </div>
                          <div className="col-md-1 text-center">
                            <span className="tamano-separator">×</span>
                          </div>
                          <div className="col-md-5">
                            <div className="form-floating">
                              <input className="form-control form-tamano" id="floatingAncho" placeholder="Ancho" name="ancho" value={subasta.ancho} onChange={handleInputChange} type="text" />
                              <label htmlFor="floatingAncho">Ancho</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating form-cantidad">
                        <input className="form-control" id="floatingPeso" placeholder="Peso" name="peso" value={subasta.peso} onChange={handlePesoChange} type="text" />
                        <label htmlFor="floatingPeso">Peso</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-floating">
                  <select
                    className="form-control"
                    id="floatingCategoriaId"
                    name="categoriaId"
                    value={subasta.categoriaId}
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
                <div className="form-row">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          className="form-control"
                          id="floatingPrecioInicial"
                          placeholder="Precio Inicial"
                          name="precioInicial"
                          maxLength="9"
                          value={subasta.precioInicial}
                          onChange={handlePrecioInicialChange}
                          type="text"
                        />
                        <label htmlFor="floatingPrecioInicial">Precio Inicial</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          className="form-control"
                          id="floatingFechaFinalizacion"
                          placeholder="Fecha de Finalización"
                          name="fechaFinalizacion"
                          value={subasta.fechaFinalizacion}
                          onChange={handleInputChange}
                          type="datetime-local"
                        />
                        <label htmlFor="floatingFechaFinalizacion">Fecha de Finalización</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-floating">
                  <textarea
                    className="form-control"
                    style={{ resize: 'none', width: '100%', height: '10rem' }}
                    placeholder="Descripción"
                    name="descripcion"
                    value={subasta.descripcion}
                    onChange={handleInputChange}
                    maxLength="155"
                  />
                  <label htmlFor="floatingDescripcion">Descripción</label>
                  <div className="character-counter d-flex justify-content-end">
                    {subasta.descripcion.length}/155
                  </div>
                </div>
                <div className="form-group">
                  <div className="image-upload" onClick={() => document.getElementById('fileInput').click()}>
                    {subasta.imagen ? (
                      <img src={URL.createObjectURL(subasta.imagen)} alt="Previsualización" className="img-fluid preview-image" />
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
                  <button className="btn btn-create btn-primary py-2 create-btn" type="submit">Crear Subasta</button>
                  <button className="btn btn-cancel btn-secondary py-2 cancel-btn" type="button" onClick={handleCancel}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Toast ref={toast} />
    </>
  );
};

export default FormSubasta;
