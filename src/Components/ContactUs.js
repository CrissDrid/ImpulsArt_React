import React, { useRef } from 'react';
import Footer from './Footer';
import Navbar_init from './Navbar_init';
import emailjs from '@emailjs/browser';

export const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_wjoiqbo', 'template_3b5s4ge', form.current, {
        publicKey: 'chNrAh1Fwt_TIlPz4',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <div>
      <Navbar_init />
      <div className="container mt-5">
        <form ref={form} onSubmit={sendEmail}>
          {/* Row for Select and Additional Inputs */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="selectOptions" className="form-label">Selecciona una opción:</label>
              <select id="selectOptions" className="form-select">
                <option value="option1">Peticion</option>
                <option value="option2">Queja</option>
                <option value="option3">Reclamo</option>
                <option value="option4">Sujerencia</option>
                <option value="option5">Felicitacion</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="middleLabel" className="form-label">Nombre:</label>
              <input type="text" id="user_name" className="form-control" placeholder="Tu nombre" />
            </div>
            <div className="col-md-6 mt-3">
              <label htmlFor="email" className="form-label">Correo Electrónico:</label>
              <input type="email" id="user_email" className="form-control" placeholder="tuemail@ejemplo.com" />
            </div>
          </div>

          {/* Large Label */}
          <div className="mb-3">
            <label htmlFor="largeText" className="form-label fs-4">Escribe aquí lo que quieres decirnos:</label>
            <textarea id="user_message" className="form-control" rows="4"></textarea>
          </div>

          {/* Submit Button */}
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary iniciar-btn">Enviar</button>
          </div>
        </form>
        <Footer />
      </div>
    </div>
  );
};

export default ContactUs;
