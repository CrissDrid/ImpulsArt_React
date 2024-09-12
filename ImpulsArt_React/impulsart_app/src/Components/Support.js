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
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                ¿Qué sucede si el arte que compré llega dañado?
              </button>
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                En ImpulsArt, nos comprometemos a asegurarnos de que tu obra de arte llegue en perfectas condiciones. Si por alguna razón tu obra llega dañada, contáctanos de inmediato a través de nuestro formulario de contacto y te ayudaremos a resolver el problema.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                ¿Cómo puedo estar seguro de que las obras de arte en ImpulsArt son auténticas?
              </button>
            </h2>
            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                En ImpulsArt, trabajamos directamente con los artistas de renombre para asegurarnos de que todas las obras que ofrecemos son auténticas. Además, ofrecemos certificados de autenticidad para todas las obras de arte que vendemos, garantizando su procedencia y calidad.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingFive">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                ¿Cuánto tiempo se tarda en recibir mi obra de arte después de realizar la compra?
              </button>
            </h2>
            <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                El tiempo de entrega puede variar dependiendo de tu ubicación y del tipo de obra que hayas adquirido. Por lo general, el tiempo de entrega estándar es de 5 a 10 días hábiles dentro de Colombia. Estos tiempos pueden variar dependiendo de la ubicación exacta y de las condiciones de envío pero siempre podras verificar el estado y el lugar en el que se encuentra tue envio en la seccion de Pedidos.
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                ¿Como registrarme en mi pagina?
              </button>
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
              <div class="accordion-body">
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <iframe width="700" height="500" src="https://www.youtube.com/embed/GhiHU7aefwo?si=8J1SK_kdjPhNUXtx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
              </div>
            </div>
          </div>

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
