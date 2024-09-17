import React, { useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import AuthToken from '../Auth/AuthToken';

function SubastaCarousel({ handleReport }) {
  const [listSubasta, setListSubasta] = useState([]);

  useEffect(() => {
    getSubasta();
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

  const getSubasta = () => {
    AuthToken.get(`${process.env.REACT_APP_API_BASE_URL}obra/obrasEnSubasta`)
      .then((response) => {
        console.log(response.data.data);
        setListSubasta(normalizeData(response.data.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const subastaTemplate = (subasta) => {
    const obra = subasta;

    return (
      <div className="obra-card">
        <div className="obra-image-container">
          {obra ? (
            <img
              src={`data:${obra.TipoImagen};base64,${obra.imagen}`}
              className="obra-image"
              alt={`Imagen de la subasta: ${obra.nombreProducto}`}
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
          <h5 className="obra-title">{obra ? obra.nombreProducto : 'Producto no disponible'}</h5>
          <Tag 
            value={obra.categoria ? obra.categoria.nombreCategoria : 'Sin categoría'} 
            className="obra-category-tag"
            severity="info"
          />
          <div className="obra-actions">
            {obra.subastas.length > 0 ? (
              obra.subastas.map((subasta, index) => (
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
  };

  return (
    <div className="obra-carousel">
      <Carousel
        value={listSubasta}
        numVisible={4}
        numScroll={4}
        className="custom-carousel"
        circular
        itemTemplate={subastaTemplate}
        header={<h5 className="text-center mb-4 d-flex justify-content-start">Subastas</h5>}
      />
    </div>
  );
}

export default SubastaCarousel;