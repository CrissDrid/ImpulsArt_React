import React, { useState, useEffect, useRef } from 'react';
import { DataViewLayoutOptions } from 'primereact/dataview';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';
import '../Styles/SeccionSubasta.css';
import Navbar_init from './Navbar_init';
import Footer from './Footer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import FilterButton from './FilterButton';

const MySwal = withReactContent(Swal);

const ObraCard = ({ obra, handleReport, handleAddToCart, layout }) => (
  <div className={`obra-card ${layout === 'list' ? 'obra-card-list' : ''}`}>
    <div className="obra-image-container">
      {obra.imagen ? (
        <img
          src={`data:${obra.TipoImagen};base64,${obra.imagen}`}
          className="obra-image"
          alt={`Imagen de la obra: ${obra.nombreProducto}`}
        />
      ) : (
        <div className="obra-image-placeholder">Imagen no disponible</div>
      )}
      <Button
        icon="pi pi-exclamation-triangle"
        className="p-button-rounded p-button-warning p-button-text report-button"
        onClick={() => handleReport(obra)}
      />
    </div>
    <div className="obra-details">
      <h5 className="obra-title">{obra.nombreProducto || 'Producto no disponible'}</h5>
      {layout === 'list' && (
        <p className="obra-description">{obra.descripcion}</p>
      )}
      <Tag 
        value={obra.categoria ? obra.categoria.nombreCategoria : 'Sin categoría'} 
        className="obra-category-tag"
        severity="info"
      />
      <p className="obra-price">
        <span className="obra-price">${parseInt(obra.costo).toLocaleString()}</span>
      </p>
      <div className="obra-actions">
        <Button
          icon="pi pi-shopping-cart"
          className="p-button-rounded p-button-secondary p-button-text action-button"
          tooltip="Agregar al carrito"
          tooltipOptions={{ position: 'top' }}
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart(obra);
          }}
        />
        <Link to={`/DetalleObras/${obra.pkCod_Producto}`}>
          <Button
            icon="pi pi-eye"
            className="p-button-rounded p-button-primary action-button"
            tooltip="Ver detalles"
            tooltipOptions={{ position: 'top' }}
          />
        </Link>
      </div>
    </div>
  </div>
);

const GridView = ({ obras, handleReport, handleAddToCart }) => (
  <div className="row">
    {obras.map(obra => (
      <div key={obra.pkCod_Producto} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <ObraCard obra={obra} handleReport={handleReport} handleAddToCart={handleAddToCart} layout="grid" />
      </div>
    ))}
  </div>
);

const ListView = ({ obras, handleReport, handleAddToCart }) => (
  <div className="obra-list-view">
    {obras.map(obra => (
      <div key={obra.pkCod_Producto} className="mb-3">
        <ObraCard obra={obra} handleReport={handleReport} handleAddToCart={handleAddToCart} layout="list" />
      </div>
    ))}
  </div>
);

export default function SeccionObras() {
  const [obras, setObras] = useState([]);
  const [filteredObras, setFilteredObras] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [carritoId, setCarritoId] = useState(null);
  const [tipoReporte, setTipoReporte] = useState([]);
  const [userRole, setUserRole] = useState('');
  const toast = useRef(null);

  useEffect(() => {
    getObrasEnVenta();
    loadCarritoId();
    loadTipoReporte();
    loadUserRole();
  }, []);

  const normalizeData = (data) => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      return [];
    }
  };

  const getObrasEnVenta = () => {
    AuthToken.get(`${process.env.REACT_APP_API_BASE_URL}obra/obrasEnVenta`)
      .then((response) => {
        const normalizedObras = normalizeData(response.data.data);
        setObras(normalizedObras);
        setFilteredObras(normalizedObras);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const loadCarritoId = async () => {
    try {
      const userInfo = await GetUserInfo();
      if (userInfo) {
        const { identificacion } = userInfo;
        const response = await AuthToken.get(`${process.env.REACT_APP_API_BASE_URL}carrito/usuarioPorCarrito/${identificacion}`);
        const carritoData = response.data.data;

        if (carritoData && carritoData.pkCod_Carrito) {
          setCarritoId(carritoData.pkCod_Carrito);
        } else {
          console.error('Carrito no encontrado');
        }
      } else {
        console.error('No se pudo obtener la información del usuario');
      }
    } catch (error) {
      console.error('Error al cargar el carrito del usuario:', error);
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

  const handleAddToCart = async (obra) => {
    if (!carritoId) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'ID del carrito no disponible', life: 3000 });
      return;
    }

    try {
      await AuthToken.post(`${process.env.REACT_APP_API_BASE_URL}carrito/addObra`, null, {
        params: {
          carritoId: carritoId,
          obraId: obra.pkCod_Producto,
          cantidad: 1
        }
      });

      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Obra añadida al carrito correctamente', life: 3000 });
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar la obra al carrito', life: 3000 });
      console.error('Error al agregar la obra al carrito:', error);
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
          getObrasEnVenta();
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
    let filtered = [...obras];

    if (filters.category) {
      filtered = filtered.filter(obra => 
        obra.categoria && obra.categoria.nombreCategoria === filters.category
      );
    }

    if (filters.priceOrder) {
      filtered.sort((a, b) => {
        const priceA = a.costo;
        const priceB = b.costo;
        return filters.priceOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

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
          <h5 className="mb-0">Obras en Venta</h5>
          <div className="d-flex align-items-center">
            <FilterButton onApplyFilters={handleApplyFilters} showTypeFilter={false} />
            <DataViewLayoutOptions 
              layout={layout} 
              onChange={(e) => setLayout(e.value)} 
              className="p-dataview-layout-options ml-2"
            />
          </div>
        </div>
        {layout === 'grid' ? 
          <GridView obras={paginatedObras} handleReport={handleReport} handleAddToCart={handleAddToCart} /> : 
          <ListView obras={paginatedObras} handleReport={handleReport} handleAddToCart={handleAddToCart} />
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