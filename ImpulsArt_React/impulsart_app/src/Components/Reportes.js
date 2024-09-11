import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar_init from './Navbar_init';
import Swal from 'sweetalert2';
import AuthToken from '../Auth/AuthToken';

function ReportForm() {
  const { pkCod_Producto } = useParams();
  const [reportOption, setReportOption] = useState('');
  const [comentario, setComentario] = useState('');

  const reportOptions = [
    { value: '1', label: 'Inapropiado' },
    { value: '2', label: 'Spam' },
    { value: '3', label: 'Estafa' },
    { value: '4', label: 'Violación de derechos de autor' },
    { value: '5', label: 'Publicidad engañosa' },
    { value: '6', label: 'Información Engañosa' },
    { value: '7', label: 'Contenido ofensivo' },
    { value: '8', label: 'Contenido que promueve violencia' },
    { value: '9', label: 'Contenido que promueve la discriminación' },
    { value: '10', label: 'Contenido que promueve odio' },
    { value: '11', label: 'Otro' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pkCod_Producto) {
      console.error('El ID de la obra no está definido');
      return;
    }

    const reportData = {
      comentario,
      fechaReporte: new Date().toISOString().split('T')[0],
      fk_obra: pkCod_Producto,
      fk_TipoReporte: reportOption,
    };

    try {
      const response = await AuthToken.post('reporteObra/create', reportData);
      console.log('Respuesta del servidor:', response.data);

      // Mostrar alerta de éxito
      Swal.fire({
        title: 'Reporte enviado',
        text: 'Tu reporte ha sido enviado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error al enviar el reporte:', error);

      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar el reporte. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <>
      <Navbar_init />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="reportOption" className="form-label">Opciones de Reporte</label>
          <select
            id="reportOption"
            className="form-select"
            value={reportOption}
            onChange={(e) => setReportOption(e.target.value)}
            required
          >
            <option value="">Seleccione una opción</option>
            {reportOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="comentario" className="form-label">Comentario</label>
          <textarea
            id="comentario"
            className="form-control"
            rows="3"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Enviar Reporte</button>
      </form>
    </>
  );
}

export default ReportForm;

