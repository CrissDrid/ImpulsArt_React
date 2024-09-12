import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { Toast } from 'primereact/toast';
import '../Styles/Profile.css';

// Autenticación de token
import AuthToken from '../Auth/AuthToken';
// Asegúrate de obtener datos del usuario
import GetUserInfo from '../Auth/GetUserInfo';
import axios from 'axios';

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

  const isOnlyLettersWithValidSpaces = (str) => {
    // Permitir solo letras y un solo espacio entre palabras, sin espacios al inicio o al final
    return /^[A-Za-z]+( [A-Za-z]+)*$/.test(str);
  };
  
  const isValidUserName = (str) => {
    // No permitir espacios en el nombre de usuario
    return /^[A-Za-z0-9_]+$/.test(str);
  };

  const isPhoneValid = (phone) => /^3\d{9}$/.test(phone);

  const isIdentificationValid = (id) => /^(\d{8}|\d{10})$/.test(id);

  const isDateOfBirthValid = (date) => {
    const today = new Date();
    const dob = new Date(date);
    
    if (dob > today) {
      return { isValid: false, message: "La fecha de nacimiento no puede ser una fecha futura" };
    }
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return { isValid: false, message: "Debe ser mayor de edad para registrarse" };
    }
    
    return { isValid: true, message: "" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario.userName || !usuario.nombre || !usuario.apellido || !usuario.fechaNacimiento || !usuario.numCelular) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Todos los campos son obligatorios', life: 3000 });
      return;
  }

  if (!isOnlyLettersWithValidSpaces(usuario.nombre)) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El nombre solo debe contener letras y un solo espacio entre palabras, sin espacios al inicio o al final', life: 3000 });
      return;
  }

  if (!isOnlyLettersWithValidSpaces(usuario.apellido)) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El apellido solo debe contener letras y no puede tener un espacio al inicio', life: 3000 });
      return;
  }

  // Validar nombre de usuario
if (!isValidUserName(usuario.userName)) {
  toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El nombre de usuario no debe contener espacios y solo debe contener letras', life: 3000 });
  return;
}

  if (!isIdentificationValid(identificacion)) {
    toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El número de documento debe tener 8 o 10 dígitos', life: 3000 });
    return;
}

  if (!isDateOfBirthValid(usuario.fechaNacimiento)) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: usuario.fechaNacimiento ? 'Debe ser mayor de edad para registrarse' : 'Fecha de nacimiento inválida', life: 3000 });
      return;
  }

  if (!isPhoneValid(usuario.numCelular)) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Número de celular inválido. Debe contener 10 dígitos y comenzar con 3', life: 3000 });
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
            // Manejar otros estados si es necesario
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error desconocido', life: 3000 });
          }
        } catch (error) {
          if (error.response && error.response.status === 409) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.message, life: 3000 });
          } else {
            console.error('Error de red:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error de red', life: 3000 });
          }
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
                <input className="form-control" id="floatingNombre" maxLength="30" value={usuario.nombre || ''} onChange={handleInputChange} required />
                <label htmlFor="floatingNombre">Nombre</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input className="form-control" id="floatingApellido" maxLength="30" value={usuario.apellido || ''} onChange={handleInputChange} required />
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
                <input type="text" className="form-control" id="floatingNumCelular" maxLength="10" value={usuario.numCelular || ''} onChange={handleInputChange} required />
                <label htmlFor="floatingNumCelular">Número de Celular</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" id="floatingUserName" maxLength="30" value={usuario.userName || ''} onChange={handleInputChange} required />
          <label htmlFor="floatingUserName">User Name</label>
        </div>
        <button className={`btn w-100 py-2 guardar-btn ${hasChanges ? 'btn-primary' : 'btn-secondary'} ${!hasChanges ? 'btn-disabled' : ''}`} type="submit" disabled={!hasChanges}>
          Guardar
        </button>
      </form>
    </div>
  );
}

export default UserData;
