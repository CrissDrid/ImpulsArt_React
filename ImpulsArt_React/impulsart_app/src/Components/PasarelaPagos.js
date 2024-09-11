import React, { useState } from 'react';
import Navbar_init from './Navbar_init';
import Stepts from './Stepts';
import CarritoCompras from './CarritoCompras';
import Ubicacion from './Ubicacion';
import Pago from './Pago'; // Importar el componente de Pago
import Footer from './Footer';

function PasarelaPagos() {
  const [activeStep, setActiveStep] = useState(0);

  const handleFinalizarCompra = () => {
    setActiveStep(1); // Avanza a la etapa de Ubicación
  };

  const handleAtras = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0)); // Retrocede de etapa
  };

  const handleDireccionSeleccionada = () => {
    setActiveStep(2); // Avanza a la etapa de Pago
  };

  return (
    <>
      <div>
        <Navbar_init />
        <Stepts activeStep={activeStep} />
        {activeStep === 0 && (
          <CarritoCompras onFinalizarCompra={handleFinalizarCompra} />
        )}
        {activeStep === 1 && (
          <Ubicacion onAtras={handleAtras} onDireccionSeleccionada={handleDireccionSeleccionada} />
        )}
        {activeStep === 2 && (
          <Pago />
        )}
        <Footer />
      </div>
    </>
  );
}

export default PasarelaPagos;
