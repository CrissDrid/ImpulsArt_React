import React, { useState } from 'react'
import Navbar_init from './Navbar_init'
import Stepts from './Stepts'
import CarritoCompras from './CarritoCompras'
import Ubicacion from './Ubicacion'
import Footer from './Footer'

function PasarelaPagos() {
  const [activeStep, setActiveStep] = useState(0);

  const handleFinalizarCompra = () => {
    setActiveStep(1);
  }

  return (
    <>
      <div>
        <Navbar_init/>
        <Stepts activeStep={activeStep} />
        {activeStep === 0 ? (
          <CarritoCompras onFinalizarCompra={handleFinalizarCompra} />
        ) : (
          <Ubicacion />
        )}
        <Footer/>
      </div>
    </>
  )
}

export default PasarelaPagos