import React, { useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import Navbar_init from './Navbar_init';
import AuthToken from '../Auth/AuthToken';

export const Responder = () => {
  // Define el estado del formulario
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Crea un objeto con los datos del formulario
    const requestData = {
      destinatario: email,
      mensaje: message,
      comentario: message, // Ajusta según tus necesidades
      fk_Pqrs: 1, // Ajusta según tus necesidades
      fk_Identificacion: 1, // Ajusta según tus necesidades
    };

    try {
      // Enviar solicitud POST al backend
      const response = await AuthToken.post('pqrs/create', requestData);
      console.log('Respuesta del servidor:', response.data);
      alert('Respuesta enviada con éxito');
      // Limpiar los campos del formulario
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error al enviar la respuesta:', error);
      alert('Error al enviar la respuesta');
    }
  };

  return (
    <div>
      <Navbar_init />
      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          {/* Campo para el correo electrónico */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico:</label>
            <input
              type="email"
              id="user_email"
              className="form-control"
              placeholder="tuemail@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Campo para la respuesta */}
          <div className="mb-3">
            <label htmlFor="largeText" className="form-label fs-4">Escribe aquí tu respuesta:</label>
            <textarea
              id="user_message"
              className="form-control"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          {/* Botón de envío */}
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary iniciar-btn">Enviar</button>
          </div>
        </form>
        <Footer />
      </div>
    </div>
  );
};

export default Responder;