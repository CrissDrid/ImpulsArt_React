import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { Rating } from 'primereact/rating';
import '../Styles/DetallesObra.css';
import Navbar_init from './Navbar_init';
import Footer from './Footer';

// Autenticacion de apis
import '../Auth/AuthToken';
import AuthToken from '../Auth/AuthToken';

function DetallesObra() {
  const [identificacion, setIdentificacion] = useState('');
  const { pkCod_Producto } = useParams();
  const navigate = useNavigate(); // Hook para redirigir
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
  const [cantidadCompra, setCantidadCompra] = useState(0);

  useEffect(() => {
    const loadObra = async () => {
      try {
        const result = await AuthToken.get(`${process.env.REACT_APP_API_BASE_URL}obra/list/${pkCod_Producto}`);
        const obraData = result.data.data;
        setObra({
          nombreProducto: obraData.nombreProducto,
          costo: obraData.costo,
          descripcion: obraData.descripcion,
          categoriaNombre: obraData.categoria.nombreCategoria,
          imagen: obraData.imagen,
          TipoImagen: obraData.TipoImagen,
          tamano: obraData.tamano,
          peso: obraData.peso,
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

  const increment = () => {
    if (cantidadCompra < obra.cantidad) {
      setCantidadCompra(cantidadCompra + 1);
    }
  };

  const decrement = () => {
    if (cantidadCompra > 0) {
      setCantidadCompra(cantidadCompra - 1);
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= obra.cantidad) {
      setCantidadCompra(value);
    }
  };

  const handleComprar = async () => {
    try {
      // Asumimos que tienes el ID del carrito del usuario actual
      const carritoId = 1; // Este valor debería venir de tu estado global o de donde almacenes el ID del carrito del usuario

      // Llamada al backend para agregar la obra al carrito
      await AuthToken.post(`${process.env.REACT_APP_API_BASE_URL}carrito/add-obra`, null, {
        params: {
          carritoId: carritoId,
          obraId: pkCod_Producto
        }
      });

      // Redirigir al carrito de compras
      navigate('/carrito');
    } catch (error) {
      console.error('Error al agregar la obra al carrito:', error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  return (
    <>
      <Navbar_init />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="image-container">
              <img src={`data:${obra.TipoImagen};base64,${obra.imagen}`} alt={obra.nombreProducto} className="product-image" />
            </div>
            <div className="rating-container mt-2">
              <Rating 
                value={obra.rating} 
                onChange={handleRatingChange} 
                cancel={false} 
                stars={5}
                onIcon="bi bi-star-fill"
                offIcon="bi bi-star"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className='row'>
              <div className='col-md-10'>
                <h1 className='nombreObra'>{obra.nombreProducto}</h1>
              </div>
              <div className='col-md-2 d-flex justify-content-end'>
                <Tag value={obra.categoriaNombre} className="mb-2" />
              </div>
            </div>
            <p className="description">{obra.descripcion}</p>
            <div className='row stokydimensiones'>
              <div className='col-md-6'>
                <p className='p-dimensiones'><strong>Dimensiones:</strong> {obra.tamano}</p>
                <p className='p-dimensiones'><strong>Peso:</strong> {obra.peso}</p>
                <p className='p-stock'><strong>Stock:</strong> {obra.cantidad}</p>
            </div>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <div className="d-flex align-items-center justify-content-start">
                  <button onClick={decrement} className="btn btn-decrement">
                    <i className="pi pi-minus"></i>
                  </button>
                  <input
                    type="number"
                    readOnly
                    value={cantidadCompra}
                    onChange={handleChange}
                    min="0"
                    max={obra.cantidad}
                    className="input-cantidad form-control text-center"
                    style={{ width: '4rem' }}
                  />
                  <button onClick={increment} className="btn btn-increment">
                    <i className="pi pi-plus "></i>
                  </button>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="d-flex align-items-center justify-content-end">
                <h1 className='costoObra'>{obra.costo}</h1>
                </div>
              </div>
            </div>
            <div className='d-flex align-items-center justify-content-end'>
              <button 
                className="btn btn-primary w-25 py-2 comprar-btn" 
                type="button" 
                onClick={handleComprar}>
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DetallesObra;
