import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import About from './AboutUs';
import Spot from '../Resources/Spot.svg';
import Palette from '../Resources/Paintpalette.svg';
import Support from './Support';
import Footer from './Footer';

function Home() {
  const [fraseActual, setFraseActual] = useState(0);
  const frases = [
    'Regístrate y únete a una comunidad de más de 100.000 personas apasionadas por el arte.',
    'Descubre miles de obras de arte únicas y encuentra la que te define.',
    'Da a conocer tu talento y vende tu arte online a un público Colombiano.',
    'Decora tu hogar con piezas que reflejen tu estilo y personalidad.'
  ];
  const intervaloTiempo = 5000; // Cambiar cada 5 segundos (5000 milisegundos)

  useEffect(() => {
    const intervalo = setInterval(() => {
      const nextIndex = fraseActual === frases.length - 1 ? 0 : fraseActual + 1;
      const element = document.querySelector('.primary-text');
      element.classList.add('fade-out');
      setTimeout(() => {
        setFraseActual(nextIndex);
        element.classList.remove('fade-out');
        setTimeout(() => {
          element.classList.add('fade-in');
          setTimeout(() => {
            element.classList.remove('fade-in');
          }, 500); // Espera a que termine la transición de entrada
        }, 100); // Espera a que termine la transición de salida
      }, 500); // Espera a que termine la transición de salida
    }, intervaloTiempo);

    return () => clearInterval(intervalo);
  }, [fraseActual]);

  return (
    <div className='home-container'>
      <Navbar/>
      <div className='banner-container'>
        <div className='col-md-6 imagen-home-banner'>
          <img className='spot-img' src={Spot} alt="" />
          <img className='palette-img' src={Palette} alt="" />
        </div>
        <div className="col-md-6 home-text-section">
          <h1 className='primary-heading'>EL MUNDO DEL ARTE A UN CLICK DE DISTANCIA</h1>
          <p className='primary-text'>{frases[fraseActual]}</p>
          <div className="mb-3 d-flex email">
            <input type="email" className="form-control mr-2 email-box" id="exampleFormControlInput1" placeholder="name@example.com"/>
            <button type="button" className="btn btn-primary register-btn">Registrarte</button>
          </div>
        </div>
      </div>
      <About/>
      <Support/>
      <Footer/>
    </div>
  );
}

export default Home;
