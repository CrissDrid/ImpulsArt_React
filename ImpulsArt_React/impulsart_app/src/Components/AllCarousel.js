import React, { useState, useEffect } from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AllCarousel({ handleReport }) {
  const [obras, setObras] = useState([]);

  useEffect(() => {
    const fetchRandomObras = async () => {
      try {
        const response = await axios.get('http://localhost:8086/api/obra/random?limit=20');
        if (response.data.status === 'success') {
          setObras(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching random obras:', error);
      }
    };

    fetchRandomObras();
  }, []);

  const obraTemplate = (obra) => {
    const isSubasta = obra.subastas && obra.subastas.length > 0;

    return (
      <div className="obra-card">
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
          <Tag
            value={isSubasta ? 'Subasta' : 'Obra'}
            severity={isSubasta ? 'warning' : 'success'}
            className="obra-type-tag"
          />
          <Tag
            value={obra.categoria ? obra.categoria.nombreCategoria : 'Sin categoría'}
            className="obra-category-tag"
            severity="info"
            style={{ marginTop: '0.5rem' }}
          />
          <div className="obra-actions">
            {isSubasta ? (
              <>
                {obra.subastas.map((subasta, index) => (
                  <Link key={index} to={`/DetallesSubasta/${subasta.pkCodSubasta}`}>
                    <Button
                      icon="pi pi-eye"
                      className="p-button-rounded p-button-primary action-button"
                      tooltip="Ver detalles"
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
                  tooltip="Ver detalles"
                  tooltipOptions={{ position: 'top' }}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="obra-carousel">
      <Carousel
        value={obras}
        numVisible={4}
        numScroll={4}
        className="custom-carousel"
        circular
        itemTemplate={obraTemplate}
        header={<h5 className="text-center mb-4 d-flex justify-content-start">Recomendaciones</h5>}
      />
    </div>
  );
}

export default AllCarousel;