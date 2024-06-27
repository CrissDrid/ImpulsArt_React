import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import Logo from '../Resources/Logo.svg';
import Art from '../Resources/Img-Art.svg';


export const Correo = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_wjoiqbo', 'template_o5ao9f7', form.current, {
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
    <div className="register-container">
    <div className="register-content row justify-content-center">
      <div className="col-md-6">
        <div className="register-form">
          <div className="register-image">
            <img className="logo-register" src={Logo} alt="" />
          </div>
          <form ref={form} onSubmit={sendEmail}>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="floatingName"
                name="user_name"
                placeholder="Nombre"
                required
              />
              <label htmlFor="floatingName">Nombre</label>
            </div>
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                name="user_email"
                placeholder="name@example.com"
                required
              />
              <label htmlFor="floatingEmail">Email</label>
            </div>
            <div className="form-floating">
              <textarea
                className="form-control"
                id="floatingMessage"
                name="message"
                placeholder="Mensaje"
                required
              ></textarea>
              <label htmlFor="floatingMessage">Mensaje</label>
            </div>
            <button className="btn btn-primary w-100 py-2 create-btn" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
      <div className="col-md-6">
        <img className="register-img" src={Art} alt="" />
      </div>
    </div>
  </div>
  );
};

export default Correo;