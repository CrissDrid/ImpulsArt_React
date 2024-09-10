import React, { useState, useEffect, useRef } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '../Styles/Direcciones.css';
import Swal from 'sweetalert2';

// Autenticación de token
import AuthToken from '../Auth/AuthToken';
// Obtener datos del usuario
import GetUserInfo from '../Auth/GetUserInfo';

const API_KEY = 'pk.eyJ1IjoiY3Jpc3NkIiwiYSI6ImNtMHZra2JoMjA0bWUycXB2MXJoaXU0dTYifQ.VgqtW0qDyQmxUpFxkf23sQ';

function CrearDireccion() {
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudadCapital, setCiudadCapital] = useState('');
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [direccion, setDireccion] = useState('');
  const [observacion, setObservacion] = useState('');
  const [error, setError] = useState('');
  const [departamentoNombre, setDepartamentoNombre] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(false);
  const geocoderRef = useRef(null);
  const [identificacion, setIdentificacion] = useState('');

  const handleDepartamentoChange = (e) => {
    const departamentoId = e.target.value;
    setSelectedDepartamento(departamentoId);
  
    // Encuentra el departamento seleccionado en el array
    const departamentoSeleccionado = departamentos.find(depto => depto.id === departamentoId);
    if (departamentoSeleccionado) {
      setDepartamentoNombre(departamentoSeleccionado.name);
    } else {
      setDepartamentoNombre('');
    }
  };

  useEffect(() => {

    //Cargar identificacion
    const { identificacion } = GetUserInfo();
    setIdentificacion(identificacion);
    console.log("Identificación obtenida:", identificacion);

  }, []);

  useEffect(() => {
    fetch('https://api-colombia.com/api/v1/Department')
      .then(response => response.json())
      .then(data => {
        const departamentosFiltrados = data.filter(departamento => departamento.name !== 'Bogotá');
        setDepartamentos(departamentosFiltrados);
      })
      .catch(error => console.error('Error fetching departamentos:', error));
  }, []);

  useEffect(() => {
    if (selectedDepartamento) {
      fetch(`https://api-colombia.com/api/v1/Department/${selectedDepartamento}`)
        .then(response => response.json())
        .then(data => {
          setCiudadCapital(data.cityCapital ? data.cityCapital.name : '');
          if (geocoderRef.current) {
            geocoderRef.current.clear();
          }
          setDireccion('');
          setDireccionSeleccionada(false);
        })
        .catch(error => console.error('Error fetching ciudad capital:', error));
    } else {
      setCiudadCapital('');
    }
  }, [selectedDepartamento]);

  useEffect(() => {
    const container = document.getElementById('direccion-container');
    if (container && ciudadCapital) {
      container.innerHTML = '';

      const geocoder = new MapboxGeocoder({
        accessToken: API_KEY,
        language: 'es',
        placeholder: `Ingresa una dirección en ${ciudadCapital}`,
        countries: 'CO',
        types: 'address',
        localGeocoder: (query) => {
          const fullQuery = `${query}, ${ciudadCapital}`;
          return [{ place_name: fullQuery }];
        },
        getItemValue: (item) => {
          return item.place_name.replace(`, ${ciudadCapital}`, '').trim();
        },
        mapboxgl: null,
      });

      container.style.width = '100%';

      geocoder.addTo(container);
      geocoderRef.current = geocoder;

      geocoder.on('result', (e) => {
        const address = e.result.place_name.split(',')[0].trim();
        setDireccion(address);
        setDireccionSeleccionada(true);
      });

      const originalSearch = geocoder._geocode.bind(geocoder);
      geocoder._geocode = function (query) {
        const fullQuery = `${query}, ${ciudadCapital}, Colombia`;
        originalSearch(fullQuery);
      };

      const handleDepartamentoChange = (e) => {
        const departamentoId = e.target.value;
        setSelectedDepartamento(departamentoId);

        // Encuentra el departamento seleccionado en el array
        const departamentoSeleccionado = departamentos.find(depto => depto.id === departamentoId);
        if (departamentoSeleccionado) {
          setDepartamentoNombre(departamentoSeleccionado.name);
        } else {
          setDepartamentoNombre('');
        }
      };

      return () => {
        if (container) {
          container.innerHTML = '';
        }
      };
    }
  }, [ciudadCapital]);

  const validateAddress = (address) => {
    return true;
  };

  const handleObservacionChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= 150) {
      setObservacion(inputText);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isValid = validateAddress(direccion);
  
    if (isValid) {
      console.log('Datos a enviar:', {
        departamento: selectedDepartamento,
        direccion: direccion,
        ciudad: ciudadCapital,
        observaciones: observacion,
        fkUsuario: identificacion
      });
  
      try {
        const response = await AuthToken.post('direccion/create', {
          departamento: selectedDepartamento,  // Usa departamentoNombre aquí
          direccion: direccion,
          ciudad: ciudadCapital,
          observaciones: observacion,
          fkUsuario: identificacion
        });
  
        if (response.data.status === 'success') {
          setSuccessMessage(response.data.data);
          setError('');
        } else {
          setError(response.data.data);
          setSuccessMessage('');
        }
      } catch (error) {
        console.error('Error al guardar la dirección:', error);
        setError('Hubo un error al guardar la dirección.');
        setSuccessMessage('');
      }
    } else {
      setError(`La dirección ingresada no es válida o no pertenece a ${ciudadCapital}.`);
      setSuccessMessage('');
    }
  };

  const clearForm = () => {
    setSelectedDepartamento('');
    setCiudadCapital('');
    setDireccion('');
    setDireccionSeleccionada(false);
    setObservacion('');
    setError('');
    setSuccessMessage('');
    if (geocoderRef.current) {
      geocoderRef.current.clear();
    }
  };

  const handleCloseModal = () => {
    if (selectedDepartamento || ciudadCapital || direccion || observacion) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Si cierras el modal, perderás todos los datos ingresados.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          clearForm();
          document.getElementById('crearDireccionModal').classList.remove('show');
          document.body.classList.remove('modal-open');
          document.querySelector('.modal-backdrop').remove();
          // Recargar la página
          window.location.reload();
        }
      });
    } else {
      document.getElementById('crearDireccionModal').classList.remove('show');
      document.body.classList.remove('modal-open');
      document.querySelector('.modal-backdrop').remove();
      // Recargar la página
      window.location.reload();
    }
  };

  return (
    <div>
      <Direcciones />
      <div
        className="modal fade"
        id="crearDireccionModal"
        tabIndex="-1"
        aria-labelledby="crearDireccionModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="crearDireccionModalLabel">Crear Dirección</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="Departamento" className="form-label">Departamento:</label>
                  <select
                    id="Departamento"
                    className="form-control"
                    value={selectedDepartamento}
                    onChange={handleDepartamentoChange}
                    required
                  >
                    <option value="">Selecciona un departamento</option>
                    {departamentos.map(departamento => (
                      <option key={departamento.id} value={departamento.name}>
                        {departamento.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="city" className="form-label">Ciudad (Capital):</label>
                  <input
                    type="text"
                    id="city"
                    className="form-control"
                    value={ciudadCapital}
                    readOnly
                    placeholder="Selecciona un departamento"
                  />
                </div>

                {ciudadCapital && (
                  <div className="mb-3">
                    <label htmlFor="direccion-container" className="form-label">Dirección:</label>
                    <div id="direccion-container"></div>
                  </div>
                )}

                {direccionSeleccionada && (
                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección Seleccionada:</label>
                    <input
                      type="text"
                      id="direccion"
                      className="form-control"
                      value={direccion}
                      onChange={e => setDireccion(e.target.value)}
                      placeholder="Dirección seleccionada"
                      required
                      readOnly
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="observacion" className="form-label">Detalles Adicionales:</label>
                  <textarea
                    id="observacion"
                    className="form-control observacion-textarea"
                    value={observacion}
                    onChange={handleObservacionChange}
                    placeholder="Ingresa algun detalle adicional (Opcional)"
                    rows="3"
                    maxLength={150}
                  ></textarea>
                  <small className="text-muted">{observacion.length}/150</small>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Direcciones() {
  return (
    <div className="user-data">
      <h2 className="direcciones-title">Mis Direcciones</h2>
      <button
        type="button"
        className="btn btn-agregarDireccion"
        data-bs-toggle="modal"
        data-bs-target="#crearDireccionModal"
      >
        Agregar Dirección
      </button>
    </div>
  );
}

export default CrearDireccion;