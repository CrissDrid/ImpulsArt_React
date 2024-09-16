import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Autenticación de APIs
import AuthToken from '../Auth/AuthToken';
// Importar GetUserInfo para obtener el rol del usuario
import GetUserInfo from '../Auth/GetUserInfo';
// Importar el nuevo archivo CSS
import '../Styles/Album.css';
// Importar los componentes ObraCarousel y SubastaCarousel
import ObraCarousel from './ObraCarousel';
import SubastaCarousel from './SubastaCarousel';

const MySwal = withReactContent(Swal);

function Album() {
  const [listObra, setListObra] = useState([]);
  const [listSubasta, setListSubasta] = useState([]); // Estado para las subastas
  const [tipoReporte, setTipoReporte] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const { rol } = await GetUserInfo();
        setUserRole(rol);
      } catch (error) {
        console.error('Error al cargar el rol del usuario:', error);
      }
    };

    loadUserRole();
    getObra();
    getSubasta(); // Cargar las subastas
    loadTipoReporte();
  }, []);

  const loadTipoReporte = async () => {
    try {
      const result = await AuthToken.get('tipoReporte/all');
      setTipoReporte(result.data.data);
    } catch (error) {
      console.error('Error al cargar los tipos de PQRS:', error);
    }
  };

  const normalizeData = (data) => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      return [];
    }
  };

  const getObra = async () => {
    try {
      const response = await AuthToken.get('obra/all');
      setListObra(normalizeData(response.data));
    } catch (error) {
      console.error('Error en getObra:', error);
    }
  };

  const getSubasta = async () => {
    try {
      const response = await AuthToken.get('subasta/all'); // Asume que la API es 'subasta/all'
      setListSubasta(normalizeData(response.data));
    } catch (error) {
      console.error('Error en getSubasta:', error);
    }
  };

  const handleReport = async (obra) => {
    if (userRole.includes('ASESOR')) {
      const result = await MySwal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, bórralo!'
      });

      if (result.isConfirmed) {
        try {
          await AuthToken.delete(`obra/delete/${obra.pkCod_Producto}`);
          MySwal.fire('Borrado!', 'La obra ha sido eliminada.', 'success');
          getObra();
        } catch (error) {
          console.error('Error al borrar la obra:', error);
          MySwal.fire('Error', 'Hubo un problema al borrar la obra', 'error');
        }
      }
    } else {
      const { value: formValues } = await MySwal.fire({
        title: 'Reportar Obra',
        html: `
          <div style="display: flex; flex-direction: column; gap: 15px; align-items: center;">
            <label for="tipo-reporte" style="font-size: 16px; font-weight: bold;">Selecciona el tipo de reporte</label>
            <select id="tipo-reporte" class="swal2-select" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
              <option value="">Selecciona el tipo de reporte</option>
              ${tipoReporte.map(tipo => `<option value="${tipo.pkCod_TipoReporte}">${tipo.nombre}</option>`).join('')}
            </select>

            <label for="comentario-reporte" style="font-size: 16px; font-weight: bold;">Escribe tu comentario</label>
            <textarea id="comentario-reporte" class="swal2-textarea" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;" placeholder="Escribe aquí la razón del reporte..."></textarea>
          </div>`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
          const tipoReporteElement = document.getElementById('tipo-reporte');
          const comentarioElement = document.getElementById('comentario-reporte');

          const tipoReporte = tipoReporteElement ? tipoReporteElement.value : null;
          const comentario = comentarioElement ? comentarioElement.value : null;

          if (!tipoReporte) {
            return Swal.showValidationMessage('Debes seleccionar un tipo de reporte');
          }
          if (!comentario) {
            return Swal.showValidationMessage('Debes escribir un comentario');
          }

          return { tipoReporte, comentario };
        }
      });

      if (formValues) {
        const { tipoReporte, comentario } = formValues;
    
        try {
          await AuthToken.post('reporteObra/create', { 
            fk_obra: obra.pkCod_Producto, 
            fk_TipoReporte: tipoReporte, 
            comentario 
          });
          MySwal.fire('Reporte enviado', 'Tu reporte ha sido enviado exitosamente', 'success');
        } catch (error) {
          console.error('Error al reportar:', error);
          MySwal.fire('Error', 'Hubo un problema al enviar el reporte', 'error');
        }
      }
    }
  };

  return (
    <div className="album">
      <div className="container">
      <div className="search-container">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="form-select search-select"
          >
            <option value="">Selecciona la categoría de su obra</option>
            <option value="Pintura">Pintura</option>
            <option value="Dibujo">Dibujo</option>
            <option value="Maqueta">Maqueta</option>
            <option value="Ceramica">Ceramica</option>
          </select>
          <input
            className="form-control search-input"
            type="search"
            placeholder="Buscar por nombre de producto"
            aria-label="Buscar"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
          />
        </div>
        <ObraCarousel obras={listObra} handleReport={handleReport} />
        <SubastaCarousel subastas={listSubasta} handleReport={handleReport} />
      </div>
    </div>
  );
}

export default Album;
