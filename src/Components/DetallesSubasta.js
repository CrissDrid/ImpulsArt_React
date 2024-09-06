import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import '../Styles/DetallesObra.css';
import Swal from 'sweetalert2';
import MySwal from 'sweetalert2';
import Navbar_init from './Navbar_init';
import Footer from './Footer';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';

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
    fechaInicio: '',
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

  const [ofertas, setOfertas] = useState([]);
  const [ofertaMasAlta, setOfertaMasAlta] = useState(null);
  const [usuarioId, setUsuarioId] = useState([]);

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

    const fetchUserInfo = async () => {
      const userInfo = await GetUserInfo();
      setUsuarioId(userInfo.identificacion); // Usa 'identificacion' en lugar de 'id'
    };

    fetchUserInfo();
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
    const fetchOfertas = async () => {
      try {
        const result = await AuthToken.get(`http://localhost:8086/api/oferta/OfertaPorSubasta/${pkCodSubasta}`);
        console.log('Ofertas:', result.data.data); // Verifica la estructura de datos aquí
        if (result.data.status === 'success') {
          setOfertas(result.data.data);
        }
      } catch (error) {
        console.error('Error al cargar las ofertas:', error);
      }
    };
  
    fetchOfertas();
  }, [pkCodSubasta]);
  

  useEffect(() => {
    if (ofertas.length > 0) {
      const maxOffer = Math.max(...ofertas.map(o => o.monto));
      setOfertaMasAlta(ofertas.find(o => o.monto === maxOffer));
    }
  }, [ofertas]);

  const formatCurrency = (value) => {
    return value.replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      .replace(/^/, '$ ');
  };

  const handlePujar = () => {
    MySwal.fire({
      title: 'Ingresa tu oferta',
      input: 'text',
      inputValue: '$ ',
      showCancelButton: true,
      confirmButtonText: 'Ofertar',
      customClass: {
        cancelButton: 'custom-swal-cancel'
      },
      inputValidator: (value) => {
        const precioInicial = typeof subasta.precioInicial === 'string' 
          ? parseInt(subasta.precioInicial.replace(/[^0-9]/g, ''), 10)
          : subasta.precioInicial;

        const ofertaIngresada = parseInt(value.replace(/[^0-9]/g, ''), 10);

        if (!ofertaIngresada || ofertaIngresada <= precioInicial) {
          return `Debes ingresar una oferta válida que sea mayor a $${precioInicial.toLocaleString()}`;
        }
      },
      preConfirm: async (value) => {
        const formattedValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
        console.log('Oferta ingresada:', formattedValue);
    
        try {
            const now = new Date();
            const fechaOferta = now.toISOString().slice(0, 16);
    
            const ofertaResponse = await AuthToken.post('oferta/create', {
                monto: formattedValue,
                fechaOferta: fechaOferta,
                fk_Identificacion: usuarioId,
                fk_subasta: pkCodSubasta
            });
    
            if (ofertaResponse.status === 200) {
                // Actualizar el precio inicial de la subasta
                const updatePriceResponse = await AuthToken.put(`http://localhost:8086/api/subasta/updatePrice/${pkCodSubasta}`, null, {
                    params: {
                        precioInicial: formattedValue.toString()
                    }
                });
    
                if (updatePriceResponse.status === 200) {
                    setOfertas(prevOfertas => [
                        ...prevOfertas,
                        { id: prevOfertas.length + 1, usuario: 'UsuarioX', monto: formattedValue }
                    ]);
    
                    setSubasta(prevSubasta => ({
                        ...prevSubasta,
                        precioInicial: formattedValue.toString()
                    }));
    
                    MySwal.fire('Éxito', 'Oferta registrada', 'success')
                        .then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();  // Recargar la página
                            }
                        });
                } else {
                    MySwal.fire('Advertencia', 'Oferta registrada pero no se pudo actualizar el precio', 'warning');
                }
            } else {
                MySwal.fire('Error', 'No se pudo crear la oferta', 'error');
            }
        } catch (error) {
            console.error('Error al procesar la oferta:', error);
            MySwal.fire('Error', 'Hubo un problema al enviar la oferta', 'error');
        }
    },
      didOpen: () => {
        const input = Swal.getInput();
        input.addEventListener('input', (e) => {
          e.target.value = formatCurrency(e.target.value);
        });
      }
    });
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
          <div className="countdown-timer">
            <div className="timer d-flex justify-content-center">
              <span>{timeLeft.days}</span><span>Día</span> 
              <span>{timeLeft.hours}</span><span>Horas</span> 
              <span>{timeLeft.minutes}</span><span>Min</span> 
              <span>{timeLeft.seconds}</span><span>Seg</span>
            </div>
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
          <div className='row stokydimensiones border-bottom'>
            <div className='col-md-6'>
              <p className='p-dimensiones'><strong>Dimensiones:</strong> {subasta.tamano}</p>
              <p className='p-dimensiones'><strong>Peso:</strong> {subasta.peso}</p>
            </div>
          </div>
          <div className='row ofertar'>
            <h6 className='ofertaMinima'>Oferta minima</h6>
              <div className="col-md-2">
                <div className="d-flex align-items-center justify-content-start">
                <h1 className='costoSubasta'>${parseInt(subasta.precioInicial).toLocaleString()}</h1>
                </div>
              </div>
              <div className="col-md-10">
                <div className='d-flex justify-content-end'>
                  <button className="btn btn-primary w-25 py-2 comprar-btn" type="button" onClick={handlePujar}>Ofertar</button>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div className="row ofertas">
        <div className="col-md-6">
        <h2>Historial de Ofertas</h2>
        <DataTable value={ofertas} responsiveLayout="scroll">
          <Column field="usuarios.userName" header="Usuario" />
          <Column field="monto" header="Oferta" body={(rowData) => formatCurrency(rowData.monto.toString())} />
        </DataTable>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default DetallesSubasta;
