import React, { useEffect, useState, useRef } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import '../Styles/DetallesObra.css';
import Navbar_init from './Navbar_init';
import Footer from './Footer';
import ObraCarousel from './ObraCarousel'; // Importamos el componente ObraCarousel

// Autenticacion de apis
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';

function DetallesObra() {
  const toast = useRef(null);
  const [usuario, setUsuario] = useState(null);
  const [identificacion, setIdentificacion] = useState('');
  const [carritoId, setCarritoId] = useState(null);
  const { pkCod_Producto } = useParams();
  const navigate = useNavigate();
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
  const [cantidadCompra, setCantidadCompra] = useState(1);
  const [rol, setRol] = useState([]);
  const [todasLasObras, setTodasLasObras] = useState([]); // Nuevo estado para todas las obras

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await GetUserInfo();
        if (userInfo) {
          const { identificacion, rol } = userInfo;
          setIdentificacion(identificacion);
          setRol(rol || []);

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
    if (!identificacion) return;

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

        if (carritoData && carritoData.pkCod_Carrito) {
          setCarritoId(carritoData.pkCod_Carrito);
        } else {
          console.error('Carrito no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar el carrito del usuario:', error);
      }
    };

    const loadTodasLasObras = async () => {
      try {
        const result = await AuthToken.get(`${process.env.REACT_APP_API_BASE_URL}obra/all`);
        setTodasLasObras(result.data.data);
      } catch (error) {
        console.error('Error al cargar todas las obras:', error);
      }
    };

    loadObra();
    loadCarritoId();
    loadTodasLasObras();
  }, [identificacion, pkCod_Producto]);

  const handleRatingChange = (e) => {
    setObra({ ...obra, rating: e.value });
  };

  const increment = () => {
    if (cantidadCompra < obra.cantidad) {
      setCantidadCompra(cantidadCompra + 1);
    }
  };

  const decrement = () => {
    if (cantidadCompra > 1) {
      setCantidadCompra(cantidadCompra - 1);
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= obra.cantidad) {
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
      await AuthToken.post(`${process.env.REACT_APP_API_BASE_URL}carrito/addObra`, null, {
        params: {
          carritoId: carritoId,
          obraId: pkCod_Producto,
          cantidad: cantidadCompra
        }
      });
  
      if (toast.current) {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Obra añadida al carrito correctamente', life: 3000 });
      }
  
      navigate('/pasarela');
    } catch (error) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La cantidad de obras que seleccionó excede el stock en su carrito de compras', life: 3000 });
      console.error('Error al agregar la obra al carrito:', error);
    }
  };

  const handleReportOrDelete = async () => {
    if (rol.includes('ASESOR')) {
      try {
        await AuthToken.delete(`${process.env.REACT_APP_API_BASE_URL}obra/delete/${pkCod_Producto}`);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Obra eliminada correctamente', life: 3000 });
        navigate('/Home');
      } catch (error) {
        console.error('Error al eliminar la obra:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la obra', life: 3000 });
      }
    } else {
      // Aquí deberías implementar la lógica para mostrar el modal de reporte
      console.log('Mostrar modal de reporte');
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
            <div className='d-flex align-items-center justify-content-between mt-3'>
              {!rol.includes('ASESOR') && (
                <button 
                  className="btn btn-primary w-25 py-2 comprar-btn" 
                  type="button" 
                  onClick={handleComprar}>
                  Comprar
                </button>
              )}
              <button 
                className={`btn ${rol.includes('ASESOR') ? 'btn-danger' : 'btn-warning'} ${rol.includes('ASESOR') ? 'w-100' : 'w-25'} py-2`}
                type="button" 
                onClick={handleReportOrDelete}>
                {rol.includes('ASESOR') ? 'Borrar' : 'Reportar'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Añadimos el carrusel de obras al final */}
        <div className="row mt-5">
          <div className="col-12">
            <ObraCarousel 
              obras={todasLasObras.filter(o => o.pkCod_Producto !== pkCod_Producto)} 
              handleReport={handleReportOrDelete}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DetallesObra;