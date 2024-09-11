import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';
import '../Styles/Direcciones.css'; // Reutilizando los estilos de Direcciones

function Ubicacion({ onAtras, onDireccionSeleccionada }) {
  const [direcciones, setDirecciones] = useState([]);
  const [identificacion, setIdentificacion] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await GetUserInfo();
      if (userInfo) {
        setIdentificacion(userInfo.identificacion);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (identificacion) {
      fetchDirecciones();
    }
  }, [identificacion]);

  const fetchDirecciones = async () => {
    try {
      const response = await AuthToken.get(`/direccion/historialDirecciones/${identificacion}`);
      if (response.data.status === 'success') {
        setDirecciones(response.data.data);
      } else {
        console.error('Error:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching direcciones:', error);
    }
  };

  const handleSeleccionarDireccion = (direccion) => {
    Swal.fire({
      title: 'Confirmar Dirección',
      text: `¿Estás seguro que deseas enviar a la dirección: ${direccion.direccion}?`,
      icon: 'warning',
      showCancelButton: true, // Mostrar botón de cancelar
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, pasamos al siguiente paso (Pago)
        onDireccionSeleccionada();
      } else if (result.isDismissed) {
        // Si el usuario cancela, no hacemos nada.
        console.log('El usuario canceló la selección de dirección.');
      }
    });
  };

  return (
    <>
    <div className="page-container">
      <div className="header-container">
        <h2 className="direcciones-title">Seleccionar Dirección de Envío</h2>
      </div>

      {/* Contenedor principal con borde negro */}
      <div className="direccion-container">
        <div className="row">
          {direcciones.length > 0 ? (
            direcciones.map((direccion) => (
              <div key={direccion.id} className="col-md-6 mb-3">
                <div className="direccion-card p-3">
                  <p><strong>Departamento y Ciudad:</strong> {direccion.departamento}, {direccion.ciudad}</p>
                  <p><strong>Dirección:</strong> {direccion.direccion}</p>
                  <p><strong>Detalles Adicionales:</strong> {direccion.observaciones}</p>
                  <button 
                    className="btn btn-seleccionar" 
                    onClick={() => handleSeleccionarDireccion(direccion)}
                  >
                    Enviar Aquí
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-md-12">
              <p>No tienes direcciones registradas.</p>
            </div>
          )}
        </div>
      </div>
      <button className="btn btn-atras" onClick={onAtras}>
        Atrás
      </button>
    </div>
  </>
  );
}

export default Ubicacion;
