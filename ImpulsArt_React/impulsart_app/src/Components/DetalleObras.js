import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { Rating } from 'primereact/rating';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import '../Styles/DetallesObra.css';
import Navbar_init from './Navbar_init';
import Footer from './Footer';

function DetallesObra() {
  const { pkCod_Producto } = useParams();
  const [obra, setObra] = useState({
    nombreProducto: '',
    costo: 0,
    descripcion: '',
    categoriaNombre: '',
    imagen: '',
    tamano: '',
    cantidad: 1,
    rating: 0
  });

  useEffect(() => {
    const loadObra = async () => {
      try {
        const result = await axios.get(`http://localhost:8086/api/obra/list/${pkCod_Producto}`);
        const obraData = result.data.data;
        setObra({
          nombreProducto: obraData.nombreProducto,
          costo: obraData.costo,
          descripcion: obraData.descripcion,
          categoriaNombre: obraData.categoria.nombreCategoria,
          imagen: obraData.imagen,
          tamano: obraData.tamano,
          cantidad: obraData.cantidad,
          rating: obraData.rating || 0
        });
      } catch (error) {
        console.error('Error al cargar la obra:', error);
      }
    };

    loadObra();
  }, [pkCod_Producto]);

  const handleRatingChange = (e) => {
    setObra({ ...obra, rating: e.value });
  };

  return (
    <>
      <Navbar_init />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="image-container">
              <img src={obra.imagen} alt={obra.nombreProducto} className="product-image" />
            </div>
            <div className="rating-container mt-2">
              <Rating 
                value={obra.rating} 
                onChange={handleRatingChange} 
                cancel={false} 
                stars={5}
                onIcon="bi bi-palette-fill"
                offIcon="bi bi-palette"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className='row'>
              <div className='col-md-10'>
                <h2>{obra.nombreProducto}</h2>
              </div>
              <div className='col-md-2 d-flex justify-content-end'>
                <Tag value={obra.categoriaNombre} className="mb-2" />
              </div>
            </div>
            <p className="description">{obra.descripcion}</p>
            <p><strong>Tamaño:</strong> {obra.tamano}</p>
            <p><strong>Stock:</strong> {obra.cantidad}</p>
            <div className="d-flex align-items-center justify-content-between mt-3">
              <InputNumber 
                value={0}
                showButtons 
                buttonLayout="vertical"
                style={{ width: '4rem' }}
                decrementButtonClassName="p-button-secondary"
                incrementButtonClassName="p-button-secondary"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                min={0}
                max={obra.cantidad}
              />
            </div>
            <div className="d-flex align-items-center justify-content-between mt-3">
              <span className="font-bold text-lg">Costo: {obra.costo}</span>
            </div>
            <Button label="Comprar" className="p-button-rounded p-button-primary mt-3" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DetallesObra;
