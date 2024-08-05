import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { Toast } from 'primereact/toast';
import '../Styles/Profile.css';

function UserData() {
  const [userData, setUserData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
    }
  }, []);

  useEffect(() => {
    const originalData = JSON.parse(localStorage.getItem('user'));
    if (userData && originalData) {
      setHasChanges(JSON.stringify(userData) !== JSON.stringify(originalData));
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace('floating', '').charAt(0).toLowerCase() + id.replace('floating', '').slice(1);
    setUserData((prevState) => ({ ...prevState, [key]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo)\.com$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(userData.email)) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor, ingrese un correo válido.', life: 3000 });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro de hacer esos cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8D33FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8086/api/usuario/update/${userData.identificacion}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
          const result = await response.json();
          if (response.ok) {
            console.log('Datos actualizados:', result);
            localStorage.setItem('user', JSON.stringify(userData));
            setHasChanges(false);
            Swal.fire({ title: 'Guardado!', text: 'Sus datos han sido actualizados.', icon: 'success' }).then(() => {
              window.location.reload(); // Recargar la página
            });
          } else {
            console.error('Error al actualizar:', result);
          }
        } catch (error) {
          console.error('Error de red:', error);
        }
      }
    });
  };

  if (!userData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="user-data">
      <Toast ref={toast} />
      <h2>Datos Personales</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-floating">
          <input className="form-control read-only-field" id="floatingId" value={userData.identificacion || ''} readOnly required />
          <label htmlFor="floatingId">Numero de Documento</label>
        </div>
        <div className="form-row">
          <div className="row">
            <div className="col-md-6">
              <div className="form-floating">
                <input className="form-control" id="floatingNombre" value={userData.nombre || ''} onChange={handleInputChange} required />
                <label htmlFor="floatingNombre">Nombre</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input className="form-control" id="floatingApellido" value={userData.apellido || ''} onChange={handleInputChange} required />
                <label htmlFor="floatingApellido">Apellido</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="row">
            <div className="col-md-6">
              <div className="form-floating">
                <input type="date" className="form-control read-only-field" id="floatingFechaNacimiento" value={userData.fechaNacimiento || ''} readOnly required />
                <label htmlFor="floatingFechaNacimiento">Fecha de Nacimiento</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input type="text" className="form-control" id="floatingNumCelular" value={userData.numCelular || ''} onChange={handleInputChange} required />
                <label htmlFor="floatingNumCelular">Numero de Celular</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" id="floatingUserName" value={userData.userName || ''} onChange={handleInputChange} required />
          <label htmlFor="floatingUserName">User Name</label>
        </div>
        <div className="form-floating">
          <input type="email" className="form-control" id="floatingEmail" value={userData.email || ''} onChange={handleInputChange} required />
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
