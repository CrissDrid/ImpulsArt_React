import React, { useState, useEffect, useRef } from 'react';
import { DataViewLayoutOptions } from 'primereact/dataview';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';
import '../Styles/SeccionSubasta.css';
import Navbar_init from './Navbar_init';
import Footer from './Footer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import FilterButton from './FilterButton';  // Asegúrate de importar el nuevo componente

const MySwal = withReactContent(Swal);

const ObraCard = ({ obra, handleReport, layout }) => {
  const isSubasta = obra.subastas && obra.subastas.length > 0;

  return (
    <div className={`obra-card ${layout === 'list' ? 'obra-card-list' : ''}`}>
      <div className="obra-image-container">
        <img
          src={`data:${obra.tipoImagen};base64,${obra.imagen}`}
          className="obra-image"
          alt={`Imagen de la obra: ${obra.nombreProducto}`}
        />
        <Button
          icon="pi pi-exclamation-triangle"
          className="p-button-rounded p-button-warning p-button-text report-button"
          onClick={() => handleReport(obra)}
        />
      </div>
      <div className="obra-details">
        <h5 className="obra-title">{obra.nombreProducto}</h5>
        {layout === 'list' && (
          <p className="obra-description">{obra.descripcion}</p>
        )}
        <div className="obra-tags-container">
          <Tag
            value={isSubasta ? 'Subasta' : 'Obra'}
            severity={isSubasta ? 'warning' : 'success'}
            className="obra-type-tag"
          />
          <Tag
            value={obra.categoria ? obra.categoria.nombreCategoria : 'Sin categoría'}
            className="obra-category-tag"
            severity="info"
          />
        </div>
        <div className="obra-info-row">
          {isSubasta ? (
            <div className="obra-minimum-bid">
              ${parseInt(obra.subastas[0].precioInicial).toLocaleString()}
            </div>
          ) : (
            <div className="obra-price">
                ${parseInt(obra.costo).toLocaleString()}
            </div>
          )}
        </div>
        <div className="obra-actions">
          {isSubasta ? (
            <>
              {obra.subastas.map((subasta, index) => (
                <Link key={index} to={`/DetallesSubasta/${subasta.pkCodSubasta}`}>
                  <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-primary action-button"
                    tooltip="Ver detalles de subasta"
                    tooltipOptions={{ position: 'top' }}
                  />
                </Link>
              ))}
            </>
          ) : (
            <Link to={`/DetalleObras/${obra.pkCod_Producto}`}>
              <Button
                icon="pi pi-eye"
                className="p-button-rounded p-button-primary action-button"
                tooltip="Ver detalles de obra"
                tooltipOptions={{ position: 'top' }}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};


const GridView = ({ obras, handleReport }) => (
  <div className="row">
    {obras.map(obra => (
      <div key={obra.pkCod_Producto} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <ObraCard obra={obra} handleReport={handleReport} layout="grid" />
      </div>
    ))}
  </div>
);

const ListView = ({ obras, handleReport }) => (
  <div className="obra-list-view">
    {obras.map(obra => (
      <div key={obra.pkCod_Producto} className="mb-3">
        <ObraCard obra={obra} handleReport={handleReport} layout="list" />
      </div>
    ))}
  </div>
);

export default function AllObrasDisplay() {
  const [obras, setObras] = useState([]);
  const [filteredObras, setFilteredObras] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [tipoReporte, setTipoReporte] = useState([]);
  const [userRole, setUserRole] = useState('');
  const toast = useRef(null);

useEffect(() => {
  fetchRandomObras();
  loadTipoReporte();
  loadUserRole();
}, []);

const fetchRandomObras = async () => {
  try {
    const response = await axios.get('http://localhost:8086/api/obra/random?limit=20');
    if (response.data.status === 'success') {
      setObras(response.data.data);
      setFilteredObras(response.data.data);
    }
  } catch (error) {
    console.error('Error fetching random obras:', error);
  }
};

  const loadTipoReporte = async () => {
    try {
      const result = await AuthToken.get('tipoReporte/all');
      setTipoReporte(result.data.data);
    } catch (error) {
      console.error('Error al cargar los tipos de PQRS:', error);
    }
  };

  const loadUserRole = async () => {
    try {
      const { rol } = await GetUserInfo();
      setUserRole(rol);
    } catch (error) {
      console.error('Error al cargar el rol del usuario:', error);
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
          fetchRandomObras();
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

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleApplyFilters = (filters) => {
    console.log('Aplicando filtros:', filters);
    console.log('Obras originales:', obras);
  
    let filtered = [...obras];
  
    if (filters.category) {
      filtered = filtered.filter(obra => 
        obra.categoria && obra.categoria.nombreCategoria === filters.category
      );
      console.log('Obras filtradas por categoría:', filtered);
    }
  
    if (filters.type) {
      filtered = filtered.filter(obra => 
        (filters.type === 'subasta' && obra.subastas && obra.subastas.length > 0) ||
        (filters.type === 'obra' && (!obra.subastas || obra.subastas.length === 0))
      );
    }
  
    if (filters.priceOrder) {
      filtered.sort((a, b) => {
        const priceA = a.subastas && a.subastas.length > 0 ? a.subastas[0].precioInicial : a.costo;
        const priceB = b.subastas && b.subastas.length > 0 ? b.subastas[0].precioInicial : b.costo;
        return filters.priceOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }
  
    console.log('Obras filtradas final:', filtered);
    setFilteredObras(filtered);
    setFirst(0);
  };
  
  const paginatedObras = filteredObras.slice(first, first + rows);

  return (
    <>
      <Navbar_init/>
      <div className="container mt-5">
        <Toast ref={toast} />
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Recomendaciones</h5>
          <div className="d-flex align-items-center">
            <FilterButton onApplyFilters={handleApplyFilters} />
            <DataViewLayoutOptions 
              layout={layout} 
              onChange={(e) => setLayout(e.value)} 
              className="p-dataview-layout-options ml-2"
            />
          </div>
        </div>
        {layout === 'grid' ? 
          <GridView obras={paginatedObras} handleReport={handleReport} /> : 
          <ListView obras={paginatedObras} handleReport={handleReport} />
        }
        <Paginator 
          first={first} 
          rows={rows} 
          totalRecords={filteredObras.length} 
          onPageChange={onPageChange}
          className="justify-content-center"
        />
      </div>
      <Footer/>
    </>
  );
}