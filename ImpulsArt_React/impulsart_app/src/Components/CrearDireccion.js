import { useEffect, useState } from 'react';
import Navbar_init from './Navbar_init';
import axios from 'axios';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';

function CrearDireccion() {
  const [departamentos, setDepartamentos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [ciudadCapital, setCiudadCapital] = useState('');
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [direccion, setDireccion] = useState('');
  const [observacion, setObservacion] = useState('');
  const [identificacion, setIdentificacion] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await GetUserInfo();
        if (userInfo) {
          const { identificacion } = userInfo;
          setIdentificacion(identificacion);

          const userResponse = await AuthToken.get(`/usuario/list/${identificacion}`);
          setUsuario(userResponse.data.data);
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    fetchData();
  }, []);

  // Obtener departamentos de API Colombia
  useEffect(() => {
    fetch('https://api-colombia.com/api/v1/Department')
      .then(response => response.json())
      .then(data => {
        const departamentosFiltrados = data.filter(departamento => departamento.name !== 'Bogotá');
        setDepartamentos(departamentosFiltrados);
      })
      .catch(error => console.error('Error fetching departamentos:', error));
  }, []);

  // Obtener la ciudad capital basada en el departamento seleccionado
  useEffect(() => {
    if (selectedDepartamento) {
      fetch(`https://api-colombia.com/api/v1/Department/${selectedDepartamento}`)
        .then(response => response.json())
        .then(data => setCiudadCapital(data.cityCapital ? data.cityCapital.name : ''))
        .catch(error => console.error('Error fetching ciudad capital:', error));
    } else {
      setCiudadCapital('');
    }
  }, [selectedDepartamento]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requestData = {
      departamento: selectedDepartamento,
      ciudad: ciudadCapital,
      direccion: direccion,
      fkUsuario: identificacion,
      observaciones: observacion,
    };
    
    console.log('Datos enviados:', requestData);
    
    try {
      const response = await AuthToken.post('direccion/create', requestData);
      console.log('Respuesta del servidor:', response.data);
      alert('Dirección creada con éxito');
      setSelectedDepartamento('');
      setCiudadCapital('');
      setDireccion('');
      setObservacion('');
    } catch (error) {
      console.error('Error al crear la dirección:', error.response ? error.response.data : error.message);
      alert('Error al crear la dirección');
    }
  };

  return (
    <div>
      <Navbar_init />

      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#crearDireccionModal"
      >
        Crear Dirección
      </button>

      <div
        className="modal fade"
        id="crearDireccionModal"
        tabIndex="-1"
        aria-labelledby="crearDireccionModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="crearDireccionModalLabel">Crear Dirección</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
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
                    onChange={e => setSelectedDepartamento(e.target.value)}
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

                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">Dirección:</label>
                  <input
                    type="text"
                    id="direccion"
                    className="form-control"
                    value={direccion}
                    onChange={e => setDireccion(e.target.value)}
                    placeholder="Ingresa tu dirección"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="observacion" className="form-label">Observación:</label>
                  <textarea
                    id="observacion"
                    className="form-control"
                    value={observacion}
                    onChange={e => setObservacion(e.target.value)}
                    placeholder="Ingresa alguna observación"
                    rows="3"
                  ></textarea>
                </div>

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

export default CrearDireccion;
