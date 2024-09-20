import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import About from './AboutUs';
import Spot from '../Resources/Spot.svg';
import Palette from '../Resources/Paintpalette.svg';
import Support from './Support';
import Footer from './Footer';
import Navbar_init from './Navbar_init';

function LandingPage() {
  const [fraseActual, setFraseActual] = useState(0);
  const supportRef = useRef(null); // Crear una referencia para la sección de soporte
  const aboutRef = useRef(null); // Crear una referencia para la sección de nosotros

  const frases = [
    'Regístrate y únete a una comunidad de más de 100.000 personas apasionadas por el arte.',
    'Descubre miles de obras de arte únicas y encuentra la que te define.',
    'Da a conocer tu talento y vende tu arte online a un público Colombiano.',
    'Decora tu hogar con piezas que reflejen tu estilo y personalidad.'
  ];
  const intervaloTiempo = 5000;

  const navigate = useNavigate();

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
          }, 500);
        }, 100);
      }, 500);
    }, intervaloTiempo);

    return () => clearInterval(intervalo);
  }, [fraseActual]);

  // Función para hacer scroll hasta el soporte
  const handleScrollToSupport = () => {
    supportRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Función para hacer scroll hasta la sección de nosotros
  const handleScrollToAbout = () => {
    aboutRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className='home-container'>
      <Navbar_init onSupportClick={handleScrollToSupport} onAboutClick={handleScrollToAbout} />
      <div className='banner-container'>
        <div className='col-md-6 imagen-home-banner'>
          <img className='spot-img' src={Spot} alt="" />
          <img className='palette-img' src={Palette} alt="" />
        </div>
        <div className="col-md-6 home-text-section">
          <h1 className='primary-heading'>EL MUNDO DEL ARTE A UN CLICK DE DISTANCIA</h1>
          <p className='primary-text'>{frases[fraseActual]}</p>
          <div className="mb-3 d-flex email">
            <button type="button" className="btn btn-primary register-btn" style={{ marginLeft: '1.7rem', marginTop: '0.5rem' }} onClick={handleRegister}>Registrarte</button>
          </div>
        </div>
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={supportRef}>
        <Support />
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
