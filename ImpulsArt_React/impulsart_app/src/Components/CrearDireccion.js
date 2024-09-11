import React, { useState, useEffect, useRef } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '../Styles/Direcciones.css';
import Swal from 'sweetalert2';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';

const API_KEY = 'pk.eyJ1IjoiY3Jpc3NkIiwiYSI6ImNtMHZra2JoMjA0bWUycXB2MXJoaXU0dTYifQ.VgqtW0qDyQmxUpFxkf23sQ';

function CrearDireccion({ onDireccionCreated, direccionToEdit }) {
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudadCapital, setCiudadCapital] = useState('');
  const [selectedDepartamentoId, setSelectedDepartamentoId] = useState('');
  const [selectedDepartamentoName, setSelectedDepartamentoName] = useState('');
  const [direccion, setDireccion] = useState('');
  const [observacion, setObservacion] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(false);
  const [identificacion, setIdentificacion] = useState('');
  const geocoderRef = useRef(null);

  useEffect(() => {
    const { identificacion } = GetUserInfo();
    setIdentificacion(identificacion);
    console.log("Identificación obtenida:", identificacion);
    
    fetch('https://api-colombia.com/api/v1/Department')
      .then(response => response.json())
      .then(data => {
        const departamentosFiltrados = data.filter(departamento => departamento.name !== 'Bogotá');
        setDepartamentos(departamentosFiltrados);
      })
      .catch(error => console.error('Error fetching departamentos:', error));
  }, []);

  useEffect(() => {
    if (direccionToEdit) {
      setSelectedDepartamentoName(direccionToEdit.departamento);
      setCiudadCapital(direccionToEdit.ciudad);
      setDireccion(direccionToEdit.direccion);
      setObservacion(direccionToEdit.observaciones);
      setDireccionSeleccionada(true);

      // Buscar el ID del departamento que coincide con el nombre
      const departamentoEncontrado = departamentos.find(dep => dep.name === direccionToEdit.departamento);
      if (departamentoEncontrado) {
        setSelectedDepartamentoId(departamentoEncontrado.id.toString());
      }
    } else {
      clearForm();
    }
  }, [direccionToEdit, departamentos]);

  useEffect(() => {
    if (selectedDepartamentoId) {
      fetch(`https://api-colombia.com/api/v1/Department/${selectedDepartamentoId}`)
        .then(response => response.json())
        .then(data => {
          setCiudadCapital(data.cityCapital ? data.cityCapital.name : '');
          setSelectedDepartamentoName(data.name);
          if (geocoderRef.current) {
            geocoderRef.current.clear();
          }
          setDireccion('');
          setDireccionSeleccionada(false);
        })
        .catch(error => console.error('Error fetching ciudad capital:', error));
    } else if (!direccionToEdit) {
      setCiudadCapital('');
      setSelectedDepartamentoName('');
    }
  }, [selectedDepartamentoId, direccionToEdit]);

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
      geocoder._geocode = function(query) {
        const fullQuery = `${query}, ${ciudadCapital}, Colombia`;
        originalSearch(fullQuery);
      };

      return () => {
        if (container) {
          container.innerHTML = '';
        }
      };
    }
  }, [ciudadCapital]);

  const validateAddress = (address) => {
    const tipoViaRegex = /^(Calle|Carrera|Avenida|Avenida Carrera|Diagonal|Transversal|Tv|Cr|Cl|Kr)\s\d+/;
    const numeroPredioRegex = /\d+(\s?#\s?\d+-?\d*)?/;
  
    const cumpleTipoVia = tipoViaRegex.test(address);
    const cumpleNumeroPredio = numeroPredioRegex.test(address);
  
    if (cumpleTipoVia && cumpleNumeroPredio) {
      setError('');
      return true;
    } else {
      setError('La dirección debe tener al menos un tipo de vía (Calle, Carrera, Kr, etc.) y un número.');
      return false;
    }
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
      try {
        let response;
        if (direccionToEdit) {
          response = await AuthToken.put(`direccion/update/${direccionToEdit.id}`, {
            departamento: selectedDepartamentoName,
            direccion: direccion,
            ciudad: ciudadCapital,
            observaciones: observacion,
            fkUsuario: identificacion
          });
        } else {
          response = await AuthToken.post('direccion/create', {
            departamento: selectedDepartamentoName,
            direccion: direccion,
            ciudad: ciudadCapital,
            observaciones: observacion,
            fkUsuario: identificacion
          });
        }
  
        if (response.data.status === 'success') {
          Swal.fire({
            title: '¡Éxito!',
            text: direccionToEdit ? 'La dirección ha sido actualizada correctamente.' : 'La dirección ha sido registrada correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            clearForm();
            onDireccionCreated();
            document.getElementById('crearDireccionModal').classList.remove('show');
            document.body.classList.remove('modal-open');
            document.querySelector('.modal-backdrop').remove();
          });
        } else {
          setError(response.data.data);
          setSuccessMessage('');
        }
      } catch (error) {
        console.error('Error al guardar la dirección:', error);
        if (error.response && error.response.data && error.response.data.data) {
          setError(error.response.data.data);
        } else {
          setError('Hubo un error al guardar la dirección.');
        }
        setSuccessMessage('');
      }
    }
  };

  const clearForm = () => {
    setSelectedDepartamentoId('');
    setSelectedDepartamentoName('');
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
    if (selectedDepartamentoId || ciudadCapital || direccion || observacion) {
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
        }
      });
    } else {
      document.getElementById('crearDireccionModal').classList.remove('show');
      document.body.classList.remove('modal-open');
      document.querySelector('.modal-backdrop').remove();
    }
  };

  return (
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
            <h5 className="modal-title" id="crearDireccionModalLabel">
              {direccionToEdit ? 'Editar Dirección' : 'Crear Dirección'}
            </h5>
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
                  value={selectedDepartamentoId}
                  onChange={e => setSelectedDepartamentoId(e.target.value)}
                  required
                >
                  <option value="">Selecciona un departamento</option>
                  {departamentos.map(departamento => (
                    <option key={departamento.id} value={departamento.id}>
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
                  {direccionToEdit ? 'Actualizar' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrearDireccion;