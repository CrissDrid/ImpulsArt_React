import React, { useState, useEffect } from 'react';
import Navbar_init from './Navbar_init';
import Stepts from './Stepts';
import CarritoCompras from './CarritoCompras';
import Ubicacion from './Ubicacion';
import Pago from './Pago';
import Footer from './Footer';

function PasarelaPagos() {
  const [activeStep, setActiveStep] = useState(0);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [datosCarrito, setDatosCarrito] = useState(null);

  const handleFinalizarCompra = (datos) => {
    setDatosCarrito(datos);
    setActiveStep(1);
    window.history.pushState({ step: 1 }, 'Ubicación');
  };

  const handleDireccionSeleccionada = (direccion) => {
    setDireccionSeleccionada(direccion);
    setActiveStep(2);
    window.history.pushState({ step: 2 }, 'Pago');
  };

  const handleAtras = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
      window.history.back();
    }
  };

  useEffect(() => {
    const onPopState = (event) => {
      if (event.state && typeof event.state.step === 'number') {
        setActiveStep(event.state.step);
      } else {
        setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
      }
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  return (
    <>
      <div>
        <Navbar_init />
        <Stepts activeStep={activeStep} />
        {activeStep === 0 && (
          <CarritoCompras onFinalizarCompra={handleFinalizarCompra} />
        )}
        {activeStep === 1 && (
          <Ubicacion 
            onAtras={handleAtras} 
            onDireccionSeleccionada={handleDireccionSeleccionada} 
          />
        )}
        {activeStep === 2 && (
          <Pago 
            onAtras={handleAtras}
            direccionSeleccionada={direccionSeleccionada}
            datosCarrito={datosCarrito}
          />
        )}
        <Footer />
      </div>
    </>
  );
}

export default PasarelaPagos;
