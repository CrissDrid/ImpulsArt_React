import React, { useState, useEffect } from 'react';
import CrearDireccion from './CrearDireccion';
import Swal from 'sweetalert2';
import '../Styles/Direcciones.css';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';
import { Modal } from 'bootstrap';

function Direcciones() {
  const [direcciones, setDirecciones] = useState([]);
  const [identificacion, setIdentificacion] = useState(null);
  const [direccionToEdit, setDireccionToEdit] = useState(null);
  const [modalInstance, setModalInstance] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await GetUserInfo();
      if (userInfo) {
        setIdentificacion(userInfo.identificacion);
      }
    };

    fetchUserInfo();

    const modalElement = document.getElementById('crearDireccionModal');
    const modal = new Modal(modalElement);
    setModalInstance(modal);

    return () => {
      if (modalInstance) {
        modalInstance.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (identificacion) {
      fetchDirecciones();
    }
  }, [identificacion]);

  const fetchDirecciones = async () => {
    try {
      const response = await AuthToken.get(`direccion/historialDirecciones/${identificacion}`);
      if (response.data.status === 'success') {
        setDirecciones(response.data.data);
      } else {
        console.error('Error:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching direcciones:', error);
    }
  };

  const eliminarDireccion = async (id) => {
    try {
      const response = await AuthToken.delete(`direccion/delete/${id}`);
      if (response.data.status === 'success') {
        Swal.fire('Eliminado', 'La dirección fue eliminada correctamente', 'success').then(() => {
          window.location.reload(); // Recargar la página después de eliminar
        });
      } else {
        Swal.fire('Error', 'No se pudo eliminar la dirección', 'error');
      }
    } catch (error) {
      console.error('Error eliminando dirección:', error);
      Swal.fire('Error', 'Ocurrió un error al eliminar la dirección', 'error');
    }
  };

  const handleEliminarClick = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarDireccion(id);
      }
    });
  };

  const handleEditarClick = (direccion) => {
    setDireccionToEdit(direccion);
    if (modalInstance) {
      modalInstance.show();
    }
  };

  const handleDireccionCreatedOrUpdated = () => {
    if (modalInstance) {
      modalInstance.hide();
    }
    window.location.reload(); // Recargar la página después de crear o actualizar
  };

  return (
    <div className="user-data">
      <h2 className="direcciones-title">Mis Direcciones</h2>
      <div className="row mb-3">
        <div className="col-md-12 text-end">
          <button
            type="button"
            className="btn btn-agregarDireccion"
            onClick={() => {
              setDireccionToEdit(null);
              if (modalInstance) {
                modalInstance.show();
              }
            }}
          >
            Agregar Dirección
          </button>
        </div>
      </div>

      <div className="row">
        {direcciones.length > 0 ? (
          direcciones.map((direccion) => (
            <div key={direccion.id} className="col-md-6 mb-3">
              <div className="direccion-card p-3">
                <p><strong>Departamento y Ciudad:</strong> {direccion.departamento}, {direccion.ciudad}</p>
                <p><strong>Dirección:</strong> {direccion.direccion}</p>
                <p><strong>Detalles Adicionales:</strong> {direccion.observaciones}</p>
                <button className="btn btn-editar" onClick={() => handleEditarClick(direccion)}>Editar</button>
                <button className="btn btn-eliminar" onClick={() => handleEliminarClick(direccion.id)}>Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-md-12">
            <p>No tienes direcciones registradas.</p>
          </div>
        )}
      </div>

      <CrearDireccion 
        onDireccionCreated={handleDireccionCreatedOrUpdated} 
        direccionToEdit={direccionToEdit}
      />
    </div>
  );
}

export default Direcciones;