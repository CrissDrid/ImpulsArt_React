import React, { useState } from 'react';
import '../Styles/Stepts.css'; // Asumo que ya tienes este archivo CSS

function Stepts() {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-12 col-md-8">
                    <div className="progress-bar-container d-flex justify-content-between">
                        <div className={`step ${activeStep >= 0 ? 'completed' : ''}`}>
                            <div className="circle">
                                <i className="pi pi-shopping-cart"></i>
                            </div>
                            <p>Carrito</p>
                        </div>

                        <div className="line"></div>

                        <div className={`step ${activeStep >= 1 ? 'completed' : ''}`}>
                            <div className="circle">
                                <i className="pi pi-map-marker"></i>
                            </div>
                            <p>Ubicación</p>
                        </div>

                        <div className="line"></div>

                        <div className={`step ${activeStep >= 2 ? 'completed' : ''}`}>
                            <div className="circle">
                                <i className="pi pi-credit-card"></i>
                            </div>
                            <p>Pago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stepts;
