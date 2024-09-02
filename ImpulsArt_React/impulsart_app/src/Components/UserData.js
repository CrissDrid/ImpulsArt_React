import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { Toast } from 'primereact/toast';
import '../Styles/Profile.css';

// Autenticación de token
import AuthToken from '../Auth/AuthToken';
// Asegúrate de obtener datos del usuario
import GetUserInfo from '../Auth/GetUserInfo';

function UserData() {
  const [usuario, setUsuario] = useState(null);
  const [identificacion, setIdentificacion] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const { identificacion } = await GetUserInfo();
        setIdentificacion(identificacion);

        // Cargar datos relacionados con el usuario
        if (identificacion) {
          const response = await AuthToken.get(`/usuario/list/${identificacion}`);
          setUsuario(response.data.data);
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const originalData = JSON.parse(localStorage.getItem('user'));
    if (usuario && originalData) {
      setHasChanges(JSON.stringify(usuario) !== JSON.stringify(originalData));
    }
  }, [usuario]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace('floating', '').charAt(0).toLowerCase() + id.replace('floating', '').slice(1);
    setUsuario((prevState) => ({ ...prevState, [key]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo)\.com$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(usuario.email)) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor, ingrese un correo válido.', life: 3000 });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro de hacer esos cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8D33FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await AuthToken.put(`/usuario/update/${identificacion}`, usuario);
          if (response.status === 200) {
            console.log('Datos actualizados:', response.data);
            localStorage.setItem('user', JSON.stringify(usuario));
            setHasChanges(false);
            Swal.fire({
              title: '¡Guardado!',
              text: 'Sus datos han sido actualizados.',
              icon: 'success'
            }).then(() => {
              window.location.reload(); // Recargar la página
            });
          } else {
            console.error('Error al actualizar:', response.data);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al actualizar los datos.',
              icon: 'error'
            });
          }
        } catch (error) {
          console.error('Error de red:', error);
          Swal.fire({
            title: 'Error de red',
            text: 'No se pudo completar la solicitud.',
            icon: 'error'
          });
        }
      }
    });
  };

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="user-data">
      <Toast ref={toast} />
      <h2>Datos Personales</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-floating">
          <input className="form-control read-only-field" id="floatingId" value={usuario.identificacion || ''} readOnly required />
          <label htmlFor="floatingId">Número de Documento</label>
        </div>
        <div className="form-row">
          <div className="row">
            <div className="col-md-6">
              <div className="form-floating">
                <input className="form-control" id="floatingNombre" value={usuario.nombre || ''} onChange={handleInputChange} required />
                <label htmlFor="floatingNombre">Nombre</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input className="form-control" id="floatingApellido" value={usuario.apellido || ''} onChange={handleInputChange} required />
                <label htmlFor="floatingApellido">Apellido</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="row">
            <div className="col-md-6">
              <div className="form-floating">
                <input type="date" className="form-control read-only-field" id="floatingFechaNacimiento" value={usuario.fechaNacimiento || ''} readOnly required />
                <label htmlFor="floatingFechaNacimiento">Fecha de Nacimiento</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input type="text" className="form-control" id="floatingNumCelular" value={usuario.numCelular || ''} onChange={handleInputChange} required />
                <label htmlFor="floatingNumCelular">Número de Celular</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" id="floatingUserName" value={usuario.userName || ''} onChange={handleInputChange} required />
          <label htmlFor="floatingUserName">User Name</label>
        </div>
        <div className="form-floating">
          <input type="email" className="form-control" id="floatingEmail" value={usuario.email || ''} onChange={handleInputChange} required />
          <label htmlFor="floatingEmail">Email</label>
        </div>
        <button className={`btn w-100 py-2 guardar-btn ${hasChanges ? 'btn-primary' : 'btn-secondary'} ${!hasChanges ? 'btn-disabled' : ''}`} type="submit" disabled={!hasChanges}>
          Guardar
        </button>
      </form>
    </div>
  );
}

export default UserData;
