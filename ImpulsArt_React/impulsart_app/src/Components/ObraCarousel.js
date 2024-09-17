import React, { useEffect, useState, useRef } from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';

function ObraEnVentaCarousel({ handleReport }) {
  const [listObrasEnVenta, setListObrasEnVenta] = useState([]);
  const [carritoId, setCarritoId] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    getObrasEnVenta();
    loadCarritoId();
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
        console.log(response.data.data);
        setListObrasEnVenta(normalizeData(response.data.data));
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

  const obraTemplate = (obra) => {
    return (
      <div className="obra-card">
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
          <p className="obra-price">${Number(obra.costo).toFixed(2)}</p>
          <Tag 
            value={obra.categoria ? obra.categoria.nombreCategoria : 'Sin categoría'} 
            className="obra-category-tag"
            severity="info"
          />
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
  };

  return (
    <div className="obra-carousel">
      <Toast ref={toast} />
      <Carousel
        value={listObrasEnVenta}
        numVisible={4}
        numScroll={4}
        className="custom-carousel"
        circular
        itemTemplate={obraTemplate}
        header={<h5 className="text-center mb-4 d-flex justify-content-start">Obras en Venta</h5>}
      />
    </div>
  );
}

export default ObraEnVentaCarousel;