import React from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

function ObraCarousel({ obras, handleReport }) {
  const obraTemplate = (obra) => (
    <div className="obra-card">
      <div className="obra-image-container">
        <img
          src={`data:${obra.TipoImagen};base64,${obra.imagen}`}
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
        <p className="obra-price">Precio: ${Number(obra.costo).toFixed(2)}</p>
        <div className="obra-actions">
          <Button
            icon="pi pi-star"
            className="p-button-rounded p-button-secondary p-button-text action-button"
          />
          <Link to={`/DetalleObras/${obra.pkCod_Producto}`}>
            <Button
              icon="pi pi-eye"
              className="p-button-rounded p-button-primary action-button"
            />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="obra-carousel">
      <Carousel
        value={obras}
        numVisible={4}
        numScroll={4}
        className="custom-carousel"
        circular
        itemTemplate={obraTemplate}
        header={<h5 className="text-center mb-4 d-flex justify-content-start">Recomendaciones </h5>}
      />
    </div>
  );
}

export default ObraCarousel;