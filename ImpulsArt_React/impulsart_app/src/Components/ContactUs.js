import React, { useRef, useState, useEffect } from 'react';
import Footer from './Footer';
import Navbar_init from './Navbar_init';
import Swal from 'sweetalert2';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

// Autenticacion de apis
import AuthToken from '../Auth/AuthToken';
// Asegúrate Obtener datos del usuario
import GetUserInfo from '../Auth/GetUserInfo';

export const ContactUs = () => {
  const form = useRef();
  const toast = useRef(null); // Definición de la referencia para el Toast
  const [tipoPQRS, setTipoPQRS] = useState([]);
  const [identificacion, setIdentificacion] = useState('');
  const [pqrs, setPqrs] = useState({
    descripcion: "",
    fkCod_TipoPQRS: "",
    usuarioId: ""
  });

  useEffect(() => {
    // Cargar identificación
    const { identificacion } = GetUserInfo();
    setIdentificacion(identificacion);
    setPqrs(prevState => ({ ...prevState, usuarioId: identificacion }));
    console.log("Identificación obtenida:", identificacion);

    const loadTipoPQRS = async () => {
      try {
        const result = await AuthToken.get('tipoPQRS/all');
        setTipoPQRS(result.data.data);
      } catch (error) {
        console.error('Error al cargar los tipos de PQRS:', error);
      }
    };

    loadTipoPQRS();
  }, []);  // Ejecutar el efecto solo una vez al cargar el componente

  const onInputChange = (e) => {
    setPqrs({ ...pqrs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si algún campo está vacío
    if (!pqrs.descripcion || !pqrs.fkCod_TipoPQRS) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos deben estar completos' });
      return;
    }

    // Confirmación de envío
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres enviar esta PQRS?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Confirmación aceptada, proceder con el envío
      const formData = new FormData();
      formData.append('descripcion', pqrs.descripcion);
      formData.append('fkCod_TipoPQRS', pqrs.fkCod_TipoPQRS);
      formData.append('usuarioId', pqrs.usuarioId);

      try {
        const response = await AuthToken.post('pqrs/create', formData);
        console.log('Respuesta del servidor:', response.data);
        await Swal.fire({
          title: 'Éxito!',
          text: 'Tu mensaje ha sido enviado con éxito.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        // Puedes redirigir o limpiar el formulario aquí
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  return (
    <div>
      <Navbar_init />
      <div className="container mt-5">
        {/* Agrega el componente Toast aquí */}
        <Toast ref={toast} />

        <form ref={form} onSubmit={handleSubmit}>
          {/* Row for Select and Additional Inputs */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="selectOptions" className="form-label">Selecciona el tipo de PQRS:</label>
              <select
                id="selectOptions"
                name="fkCod_TipoPQRS"
                value={pqrs.fkCod_TipoPQRS}
                onChange={onInputChange}
                className="form-select"
              >
                <option value="">Selecciona una opción</option>
                {tipoPQRS.map(tipoPQRS => (
                  <option key={tipoPQRS.pkCod_TipoPQRS} value={tipoPQRS.pkCod_TipoPQRS}>{tipoPQRS.nombreTipo}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Large Label */}
          <div className="mb-3">
            <label htmlFor="largeText" className="form-label fs-4">Escribe aquí lo que quieres decirnos:</label>
            <textarea
              id="largeText"
              name="descripcion"
              maxLength="200"
              value={pqrs.descripcion}
              onChange={onInputChange}
              className="form-control"
              rows="4"
            ></textarea>
          </div>

          {/* Submit Button */}
          <Button
            label="Enviar PQRS"
            severity="help"
            icon="pi pi-check"
            iconPos="right"
            rounded
          />
        </form>
        <Footer />
      </div>
    </div>
  );
};

export default ContactUs;