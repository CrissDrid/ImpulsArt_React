import React, { useEffect, useState, useRef } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import '../Styles/DetallesObra.css';
import Navbar_init from './Navbar_init';
import Footer from './Footer';

// Autenticacion de apis
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';

function DetallesObra() {
  const toast = useRef(null);
  const [usuario, setUsuario] = useState(null);
  const [identificacion, setIdentificacion] = useState('');
  const [carritoId, setCarritoId] = useState(null);
  const { pkCod_Producto } = useParams();
  const navigate = useNavigate(); // Hook para redirigir
  const [obra, setObra] = useState({
    nombreProducto: '',
    costo: 0,
    descripcion: '',
    categoriaNombre: '',
    imagen: '',
    TipoImagen: '',
    tamano: '',
    peso: '',
    cantidad: 1,
    rating: 0
  });
  const [cantidadCompra, setCantidadCompra] = useState(1); // Se inicializa en 1 por defecto

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const userInfo = await GetUserInfo();
        if (userInfo) {
          const { identificacion } = userInfo;
          setIdentificacion(identificacion);

          // Cargar datos del usuario
          const userResponse = await AuthToken.get(`/usuario/list/${identificacion}`);
          setUsuario(userResponse.data.data);
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!identificacion) return; // No hacer nada si la identificación no está disponible

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

    const loadCarritoId = async () => {
      try {
        const response = await AuthToken.get(`${process.env.REACT_APP_API_BASE_URL}carrito/usuarioPorCarrito/${identificacion}`);
        const carritoData = response.data.data;

        // Asegúrate de que el carrito tenga un ID válido
        if (carritoData && carritoData.pkCod_Carrito) {
          setCarritoId(carritoData.pkCod_Carrito);
        } else {
          console.error('Carrito no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar el carrito del usuario:', error);
      }
    };

    loadObra();
    loadCarritoId();
  }, [identificacion, pkCod_Producto]); // Dependencias actualizadas

  const handleRatingChange = (e) => {
    setObra({ ...obra, rating: e.value });
  };

  const increment = () => {
    if (cantidadCompra < obra.cantidad) {
      setCantidadCompra(cantidadCompra + 1);
    }
  };

  const decrement = () => {
    if (cantidadCompra > 1) { // Evita que la cantidad sea menor que 1
      setCantidadCompra(cantidadCompra - 1);
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= obra.cantidad) { // Asegura que el valor esté en el rango válido
      setCantidadCompra(value);
    }
  };

  const handleComprar = async () => {
    if (!carritoId) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'ID del carrito no disponible', life: 3000 });
      }
      return;
    }
  
    if (cantidadCompra > obra.cantidad) {
      if (toast.current) {
        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La cantidad seleccionada supera la cantidad disponible', life: 3000 });
      }
      return;
    }
  
    try {
      // Llamada al backend para agregar la obra al carrito
      await AuthToken.post(`${process.env.REACT_APP_API_BASE_URL}carrito/addObra`, null, {
        params: {
          carritoId: carritoId,
          obraId: pkCod_Producto,
          cantidad: cantidadCompra
        }
      });
  
      // Mostrar mensaje de éxito
      if (toast.current) {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Obra añadida al carrito correctamente', life: 3000 });
      }
  
      // Redirigir al carrito de compras
      navigate('/pasarela');
    } catch (error) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La cantidad de obras que selecciono excede el stock en tu carrito de compras', life: 3000 });
      console.error('Error al agregar la obra al carrito:', error);
    }
  };

  return (
    <>
      <Navbar_init />
      <Toast ref={toast} />
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
