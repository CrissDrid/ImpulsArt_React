import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import '../Styles/DetallesObra.css';
import Navbar_init from './Navbar_init';
import Footer from './Footer';

// Autenticación de APIs
import AuthToken from '../Auth/AuthToken';

function DetallesSubasta() {
  const { pkCodSubasta } = useParams();
  
  const [subasta, setSubasta] = useState({
    nombreProducto: '',
    costo: '',
    peso: '',
    tamano: '',
    cantidad: '',
    categoriaId: '',
    categoriaNombre: '',
    descripcion: '',
    estadoSubasta: '',
    precioInicial: '',
    fechaInicio:'',
    fechaFinalizacion: '',
    imagen: '',
    imagenPreview: '',
    rating: 0
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [ofertas, setOfertas] = useState([
    { id: 1, usuario: 'Usuario1', monto: 100 },
    { id: 2, usuario: 'Usuario2', monto: 150 },
    { id: 3, usuario: 'Usuario3', monto: 200 }
  ]);

  const [ofertaMasAlta, setOfertaMasAlta] = useState(null);

  useEffect(() => {
    const loadSubasta = async () => {
      try {
        const result = await AuthToken.get(`http://localhost:8086/api/subasta/list/${pkCodSubasta}`);
        const subastaData = result.data.data[0];

        console.log('Datos de subasta:', subastaData);

        setSubasta({
          nombreProducto: subastaData.obras.nombreProducto,
          costo: subastaData.obras.costo,
          peso: subastaData.obras.peso,
          tamano: subastaData.obras.tamano,
          cantidad: subastaData.obras.cantidad,
          categoriaId: subastaData.obras.categoria.pkCod_Categoria,
          categoriaNombre: subastaData.obras.categoria.nombreCategoria,
          descripcion: subastaData.obras.descripcion,
          estadoSubasta: subastaData.estadoSubasta,
          precioInicial: subastaData.precioInicial,
          fechaInicio: subastaData.fechaInicio,
          fechaFinalizacion: subastaData.fechaFinalizacion,
          imagen: subastaData.obras.imagen,
          imagenPreview: subastaData.obras.imagen,
          rating: subastaData.rating || 0
        });
      } catch (error) {
        console.error('Error al cargar la subasta:', error);
      }
    };

    loadSubasta();
  }, [pkCodSubasta]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(subasta.fechaFinalizacion);
      const difference = endDate - now;

      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
          hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
          minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
          seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0')
        };
      } else {
        timeLeft = { days: "00", hours: "00", minutes: "00", seconds: "00" };
      }

      setTimeLeft(timeLeft);
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [subasta.fechaFinalizacion]);

  useEffect(() => {
    if (ofertas.length > 0) {
      const maxOffer = Math.max(...ofertas.map(o => o.monto));
      setOfertaMasAlta(ofertas.find(o => o.monto === maxOffer));
    }
  }, [ofertas]);

  const handleRatingChange = (e) => {
    setSubasta({ ...subasta, rating: e.value });
  };

  const handlePujar = () => {
    alert('Aquí puedes implementar la lógica para pujar.');
  };

  return (
    <>
    <Navbar_init/>
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="image-container">
            <img src={subasta.imagen} alt={subasta.nombreProducto} className="product-image" />
          </div>
          <div className="rating-container mt-2">
            <Rating 
              value={subasta.rating} 
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
              <h1 className='nombreObra'>{subasta.nombreProducto}</h1>
            </div>
            <div className='col-md-2 d-flex justify-content-end'>
              <Tag value={subasta.categoriaNombre} className="mb-2" />
            </div>
          </div>
          <p className="description">{subasta.descripcion}</p>
          <div className='row stokydimensiones'>
            <div className='col-md-6'>
              <p className='p-dimensiones'><strong>Dimensiones:</strong> {subasta.tamano}</p>
              <p className='p-dimensiones'><strong>Peso:</strong> {subasta.peso}</p>
              <p className='p-stock'><strong>Stock:</strong> {subasta.cantidad}</p>
            </div>
          </div>
          <div className="countdown-timer">
            <h5>Tiempo restante para la subasta:</h5>
            <div className="timer">
              <span>{timeLeft.days}</span><span>Día</span> 
              <span>{timeLeft.hours}</span><span>Horas</span> 
              <span>{timeLeft.minutes}</span><span>Min</span> 
              <span>{timeLeft.seconds}</span><span>Seg</span>
            </div>
          </div>
          <div className="offers-section mt-4">
            <h5>Ofertas:</h5>
            <ul className="list-group">
              {ofertas.map(oferta => (
                <li key={oferta.id} className="list-group-item">
                  {oferta.usuario}: ${oferta.monto}
                </li>
              ))}
            </ul>
            {ofertaMasAlta && (
              <div className="highest-offer mt-3">
                <h5>Oferta más alta:</h5>
                <p>{ofertaMasAlta.usuario}: ${ofertaMasAlta.monto}</p>
              </div>
            )}
            <button onClick={handlePujar} className="btn btn-primary mt-3">Pujar</button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default DetallesSubasta;
