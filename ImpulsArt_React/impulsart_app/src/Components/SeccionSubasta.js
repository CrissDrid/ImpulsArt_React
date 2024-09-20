import React, { useState, useEffect } from 'react';
import { DataViewLayoutOptions } from 'primereact/dataview';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router-dom';
import AuthToken from '../Auth/AuthToken';
import '../Styles/SeccionSubasta.css';
import Navbar_init from './Navbar_init'
import Footer from './Footer'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import GetUserInfo from '../Auth/GetUserInfo';

const MySwal = withReactContent(Swal);

const AuctionCard = ({ auction, handleReport, layout }) => (
  <div className={`obra-card ${layout === 'list' ? 'obra-card-list' : ''}`}>
    <div className="obra-image-container">
      <img
        src={`data:${auction.TipoImagen};base64,${auction.imagen}`}
        className="obra-image"
        alt={`Imagen de la subasta: ${auction.nombreProducto}`}
      />
      <Button
        icon="pi pi-exclamation-triangle"
        className="p-button-rounded p-button-warning p-button-text report-button"
        onClick={() => handleReport(auction)}
      />
    </div>
    <div className="obra-details">
      <h5 className="obra-title">{auction.nombreProducto}</h5>
      {layout === 'list' && (
        <p className="obra-description">{auction.descripcion}</p>
      )}
      <div className="obra-info-row">
        <Tag 
          value={auction.categoria ? auction.categoria.nombreCategoria : 'Sin categoría'} 
          className="obra-category-tag"
          severity="info"
        />
        {auction.subastas && auction.subastas.length > 0 && (
          <div className="obra-minimum-bid">
            ${parseInt(auction.subastas[0].precioInicial).toLocaleString()}
          </div>
        )}
      </div>
      <div className="obra-actions">
        {auction.subastas && auction.subastas.length > 0 ? (
          auction.subastas.map((subasta, index) => (
            <Link key={index} to={`/DetallesSubasta/${subasta.pkCodSubasta}`}>
              <Button
                icon="pi pi-eye"
                className="p-button-rounded p-button-primary action-button"
                tooltip="Ver detalles"
                tooltipOptions={{ position: 'top' }}
              />
            </Link>
          ))
        ) : (
          <p>No hay subastas disponibles para esta obra.</p>
        )}
      </div>
    </div>
  </div>
);


const GridView = ({ auctions, handleReport }) => (
  <div className="row">
    {auctions.map(auction => (
      <div key={auction.pkCodSubasta} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <AuctionCard auction={auction} handleReport={handleReport} layout="grid" />
      </div>
    ))}
  </div>
);

const ListView = ({ auctions, handleReport }) => (
  <div className="auction-list-view">
    {auctions.map(auction => (
      <div key={auction.pkCodSubasta} className="mb-3">
        <AuctionCard auction={auction} handleReport={handleReport} layout="list" />
      </div>
    ))}
  </div>
);

export default function AuctionDisplay() {
  const [auctions, setAuctions] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [tipoReporte, setTipoReporte] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    getAuctions();
    loadTipoReporte();
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const { rol } = await GetUserInfo();
      setUserRole(rol);
    } catch (error) {
      console.error('Error al cargar el rol del usuario:', error);
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

  const normalizeData = (data) => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      return [];
    }
  };

  const getAuctions = () => {
    AuthToken.get(`${process.env.REACT_APP_API_BASE_URL}obra/obrasEnSubasta`)
      .then((response) => {
        console.log(response.data.data);
        setAuctions(normalizeData(response.data.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
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
          getAuctions();
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

  const paginatedAuctions = auctions.slice(first, first + rows);

  return (
    <>
    <Navbar_init/>
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Obras en Subasta</h5>
        <DataViewLayoutOptions 
  layout={layout} 
  onChange={(e) => setLayout(e.value)} 
  className="p-dataview-layout-options"
/>
      </div>
      {layout === 'grid' ? 
        <GridView auctions={paginatedAuctions} handleReport={handleReport} /> : 
        <ListView auctions={paginatedAuctions} handleReport={handleReport} />
      }
      <Paginator 
        first={first} 
        rows={rows} 
        totalRecords={auctions.length} 
        onPageChange={onPageChange}
        className="justify-content-center"
      />
    </div>
    <Footer/>
    </>
  );
}