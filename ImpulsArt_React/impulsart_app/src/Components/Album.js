import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link si no está importado
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa el bundle que incluye Popper.js
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Autenticación de APIs
import AuthToken from '../Auth/AuthToken';

const MySwal = withReactContent(Swal);

function Album() {
  const [listObra, setListObra] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const [tipoReporte, setTipoReporte] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [selectedTipoReporte, setSelectedTipoReporte] = useState(''); // Nuevo estado para el tipo de reporte seleccionado

  useEffect(() => {

    const loadTipoReporte = async () => {
      try {
        const result = await AuthToken.get('tipoReporte/all');
        console.log(result.data.data); // Verifica la estructura de datos recibida
        setTipoReporte(result.data.data);
      } catch (error) {
        console.error('Error al cargar los tipos de PQRS:', error);
      }
    };

    loadTipoReporte();
  }, []);  // Ejecutar el efecto solo una vez al cargar el componente

  const onInputChange = (e) => {
    setTipoReporte({ ...tipoReporte, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getObra();
  }, [currentPage]);

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
      const response = await AuthToken.get('obra/all'); // Ajusta la URL según sea necesario
      setListObra(normalizeData(response.data));
    } catch (error) {
      console.error('Error en getObra:', error);
    }
  };

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleReport = async (obra) => {
    const { value: formValues } = await MySwal.fire({
      title: 'Reportar Obra',
      html: `
        <div style="display: flex; flex-direction: column; gap: 15px; align-items: center;">
          <label for="tipo-reporte" style="font-size: 16px; font-weight: bold;">Selecciona el tipo de reporte</label>
          <select id="tipo-reporte" class="swal2-select" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
            <option value="">Selecciona el tipo de reporte</option>
            ${tipoReporte.map(tipo => `
              <option value="${tipo.pkCod_TipoReporte}">${tipo.nombre}</option>
            `).join('')}
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
  };
  

  const renderCards = () => {
    return listObra.slice(startIndex, endIndex).map((obra, index) => (
      <div className="col" key={index}>
        <div className="card shadow-sm">
          <img
            src={`data:${obra.TipoImagen};base64,${obra.imagen}`} // Usa el tipo MIME recibido del backend
            className="bd-placeholder-img card-img-top"
            width="100%"
            height="225"
            alt={`Imagen: ${obra.nombreProducto}`}
          />
          <div className="card-body">
            <h5 className="card-title">{obra.nombreProducto}</h5>
            <p className="card-text">{obra.descripcion}</p>
            <li>
              <button
                className="btn btn-danger"
                onClick={() => handleReport(obra)}
              >
                <i className="bi bi-exclamation-triangle-fill"></i> Reportar
              </button>
            </li>
            <div className="d-flex justify-content-between align-items-center">
              <Link to={`/DetalleObras/${obra.pkCod_Producto}`} className="btn btn-outline-primary mx-2">
                Ver detalles de la obra
              </Link>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const totalPages = Math.ceil(listObra.length / itemsPerPage);

  return (
    <div className="album py-5 bg-custom-color">
      <div className="container">

        {/*FORMULARIO PARA BUSCAR POR FILTRO*/}
        <div className="row">
          <div className="col-md-6 d-flex">
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="form-select"
            >
              <option value="">Selecciona la categoría de su obra</option>
              <option value="Pintura">Pintura</option>
              <option value="Dibujo">Dibujo</option>
              <option value="Maqueta">Maqueta</option>
              <option value="Ceramica">Ceramica</option>
            </select>
            <div style={{ paddingLeft: '10px' }}></div>
            <input
              className="form-control me-2 search-form"
              type="search"
              placeholder="Buscar por nombre de producto"
              aria-label="Buscar"
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
            />
          </div>
        </div>
        {/*FORMULARIO PARA BUSCAR POR FILTRO*/}

        <br />
        <br />
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">{renderCards()}</div>

        <div className="d-flex justify-content-center mt-3">
          <nav aria-label="Page navigation example">
            <ul className="pagination" style={{ margin: '0' }}>
              <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                <button
                  className="page-link"
                  onClick={() => handlePaginationClick(currentPage - 1)}
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              {[...Array(totalPages).keys()].map((num) => (
                <li
                  key={num}
                  className={`page-item ${currentPage === num + 1 && 'active'}`}
                  onClick={() => handlePaginationClick(num + 1)}
                  style={{ margin: '0' }}
                >
                  <button className="page-link">{num + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                <button
                  className="page-link custom-page"
                  onClick={() => handlePaginationClick(currentPage + 1)}
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Album;
