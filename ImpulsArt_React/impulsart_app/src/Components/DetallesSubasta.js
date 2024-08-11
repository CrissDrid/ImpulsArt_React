import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/DetallesSubasta.css';

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
    fechaFinalizacion: '',
    imagen: '',
    imagenPreview: ''
  });

  const [ofertas, setOfertas] = useState([]);
  const [ofertaMasAlta, setOfertaMasAlta] = useState(null);
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  useEffect(() => {
    const loadSubasta = async () => {
      try {
        // Leer datos del usuario desde localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          console.log('Datos del usuario:', user);
          // Puedes utilizar `user.identificacion` para cualquier operación adicional
        }
        
        // Cargar los detalles de la subasta
        const result = await axios.get(`http://localhost:8086/api/subasta/list/${pkCodSubasta}`);
        const subastaData = result.data.data[0];
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
          fechaFinalizacion: subastaData.fechaFinalizacion,
          imagen: subastaData.obras.imagen,
          imagenPreview: subastaData.obras.imagen
        });

        // Cargar las ofertas de la subasta
        const ofertaResult = await axios.get(`http://localhost:8086/api/oferta/OfertaPorSubasta/${pkCodSubasta}`);
        setOfertas(ofertaResult.data.data);

        // Cargar la oferta más alta
        const ofertaMasAltaResult = await axios.get(`http://localhost:8086/api/oferta/OfertaMasAlta/${pkCodSubasta}`);
        setOfertaMasAlta(ofertaMasAltaResult.data.data);

      } catch (error) {
        console.error('Error al cargar la subasta:', error);
      }
    };

    loadSubasta();
  }, [pkCodSubasta]);

  const handleSubmitOferta = async () => {
    try {
      // Leer datos del usuario desde localStorage
      const user = JSON.parse(localStorage.getItem('user'));

      // Construir el objeto de la oferta
      const ofertaData = {
        monto: nuevoMonto,
        fechaOferta: new Date().toISOString().split('T')[0], // Fecha actual
        horaOferta: new Date().toISOString().split('T')[1].split('.')[0], // Hora actual
        fk_Identificacion: user.identificacion,
        fk_subasta: pkCodSubasta
      };

      // Enviar la oferta al backend
      const response = await axios.post('http://localhost:8086/api/oferta/create', ofertaData);

      if (response.data.status === 'success') {
        setMensaje('Oferta registrada exitosamente.');
        // Recargar ofertas para mostrar la nueva oferta
        const ofertaResult = await axios.get(`http://localhost:8086/api/oferta/OfertaPorSubasta/${pkCodSubasta}`);
        setOfertas(ofertaResult.data.data);

        const ofertaMasAltaResult = await axios.get(`http://localhost:8086/api/oferta/OfertaMasAlta/${pkCodSubasta}`);
        setOfertaMasAlta(ofertaMasAltaResult.data.data);
      } else {
        setMensaje('Error al registrar la oferta.');
      }
    } catch (error) {
      console.error('Error al enviar la oferta:', error);
      setMensaje('Error al registrar la oferta.');
    }
  };

  return (
    <div className="detalles-subasta-container">
      <div className="image-section">
        <img src={subasta.imagen} alt={subasta.nombreProducto} className="product-image" />
      </div>
      <div className="details-section">
        <h1 className="product-name">{subasta.nombreProducto}</h1>
        <h5 className="product-category">Categoría: {subasta.categoriaNombre}</h5>
        <p className="product-description">{subasta.descripcion}</p>
        <div className="product-specs">
          <p><strong>Peso:</strong> {subasta.peso}</p>
          <p><strong>Tamaño:</strong> {subasta.tamano}</p>
        </div>
      </div>
      <div className="offer-section">
        <h2>Realizar Oferta</h2>
        <input
          type="number"
          placeholder={`$ ${subasta.precioInicial} COP`}
          min={subasta.precioInicial}
          value={nuevoMonto}
          onChange={(e) => setNuevoMonto(e.target.value)}
          className="offer-input"
        />
        <button onClick={handleSubmitOferta} className="offer-button">Ingresar oferta</button>
        {mensaje && <p className="response-message">{mensaje}</p>}
        <div className="offers-list">
          <h3>Lista de ofertas:</h3>
          <table className="offers-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {ofertas.map((oferta) => (
                <tr key={oferta.pkCod_oferta}>
                  <td>{`${oferta.usuarios.nombre} ${oferta.usuarios.apellido}`}</td>
                  <td>${oferta.monto}</td>
                  <td>{new Date(oferta.fechaOferta).toLocaleDateString()}</td>
                  <td>{oferta.horaOferta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="highest-bid">
          <h3>Puja más alta</h3>
          {ofertaMasAlta ? (
            <>
              <p><strong>Nombre:</strong> {`${ofertaMasAlta.usuarios.nombre} ${ofertaMasAlta.usuarios.apellido}`}</p>
              <p><strong>Monto:</strong> ${ofertaMasAlta.monto}</p>
            </>
          ) : (
            <p>No hay ofertas.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetallesSubasta;