import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Asegúrate de importar el bundle que incluye Popper.js

function Support() {
  const supportRef = useRef(null); // Crear una referencia

  const handleScrollToSupport = () => {
    // Scroll hacia la sección de soporte
    supportRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="accordion justify-content-center support-container" id="accordionExample" ref={supportRef}>
          <h1 className='support-text'>PREGUNTAS FRECUENTES</h1>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                ¿Cómo puedo comprar arte en ImpulsArt?
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                Para comprar arte en ImpulsArt, simplemente sigue estos pasos:
                <ol>
                  <li>Explora nuestra colección de obras de arte y selecciona la que te guste.</li>
                  <li>Haz clic en "Comprar ahora" y sigue las instrucciones para completar tu compra.</li>
                  <li>Una vez confirmado el pago, recibirás un correo electrónico de confirmación y tu obra será enviada a la dirección que nos hayas proporcionado.</li>
                </ol>
              </div>
            </div>
          </div>
          {/* Otros items del acordeón */}
        </div>
      </div>
      <p className='text-center support-p'>Si no se ha podido responder a tu pregunta, puedes hacer clic en el siguiente botón y comunicarnos tu inquietud. Nos comunicaremos lo más pronto posible.</p>
      <div className="text-center">
        <button type="button" className="btn btn-primary support-btn" onClick={handleScrollToSupport}>
          Soporte
        </button>
      </div>
    </div>
  );
}

export default Support;
