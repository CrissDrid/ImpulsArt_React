import React, { useState, useEffect, useRef } from 'react';
import { DataViewLayoutOptions } from 'primereact/dataview';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Link, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';
import '../Styles/SeccionSubasta.css';
import Navbar_init from './Navbar_init';
import Footer from './Footer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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

export default function SeccionSearch() {
  const [obras, setObras] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [tipoReporte, setTipoReporte] = useState([]);
  const [userRole, setUserRole] = useState('');
  const toast = useRef(null);
  const { searchQuery } = useParams();

  useEffect(() => {
    fetchSearchResults();
    loadTipoReporte();
    loadUserRole();
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(`http://localhost:8086/api/obra/buscar?query=${encodeURIComponent(searchQuery)}`);
      if (response.data.status === 'success') {
        setObras(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los resultados de búsqueda',
        life: 3000
      });
    }
  };

  const loadTipoReporte = async () => {
    try {
      const result = await AuthToken.get('tipoReporte/all');
      setTipoReporte(result.data.data);
    } catch (error) {
      console.error('Error al cargar los tipos de PQRS:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los tipos de reporte',
        life: 3000
      });
    }
  };

  const loadUserRole = async () => {
    try {
      const { rol } = await GetUserInfo();
      setUserRole(rol);
    } catch (error) {
      console.error('Error al cargar el rol del usuario:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar la información del usuario',
        life: 3000
      });
    }
  };

  const handleReport = async (obra) => {
    if (userRole !== 'USER') {
      toast.current.show({
        severity: 'warn',
        summary: 'Acceso denegado',
        detail: 'Solo los usuarios registrados pueden reportar obras',
        life: 3000
      });
      return;
    }

    const { value: selectedReportType } = await MySwal.fire({
      title: 'Seleccione el tipo de reporte',
      input: 'select',
      inputOptions: tipoReporte.reduce((acc, type) => {
        acc[type.pkCodTipoIncidencia] = type.nombreIncidencia;
        return acc;
      }, {}),
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Debe seleccionar un tipo de reporte';
        }
      }
    });

    if (selectedReportType) {
      try {
        const response = await AuthToken.post('incidenciaProducto/reportar', {
          fkUserIncidencia: userRole,
          fkProductoIncidencia: obra.pkCod_Producto,
          fkTipoIncidencia: selectedReportType
        });

        if (response.data.status === 'success') {
          toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Reporte enviado correctamente',
            life: 3000
          });
        } else {
          throw new Error(response.data.message || 'Error al enviar el reporte');
        }
      } catch (error) {
        console.error('Error al enviar el reporte:', error);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo enviar el reporte',
          life: 3000
        });
      }
    }
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const paginatedObras = obras.slice(first, first + rows);

  return (
    <>
      <Navbar_init />
      <div className="container mt-5">
        <Toast ref={toast} />
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Resultados de búsqueda para: {searchQuery}</h5>
          <DataViewLayoutOptions 
            layout={layout} 
            onChange={(e) => setLayout(e.value)} 
            className="p-dataview-layout-options"
          />
        </div>
        {obras.length > 0 ? (
          <>
            {layout === 'grid' ? 
              <GridView obras={paginatedObras} handleReport={handleReport} /> : 
              <ListView obras={paginatedObras} handleReport={handleReport} />
            }
            <Paginator 
              first={first} 
              rows={rows} 
              totalRecords={obras.length} 
              onPageChange={onPageChange}
              className="justify-content-center"
            />
          </>
        ) : (
          <p>No se encontraron resultados para "{searchQuery}"</p>
        )}
      </div>
      <Footer />
    </>
  );
}