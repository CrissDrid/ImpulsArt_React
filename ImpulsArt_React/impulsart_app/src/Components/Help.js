import React, { useState, useEffect } from 'react';
import Navbar_init from './Navbar_init';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Autenticación de token
import AuthToken from '../Auth/AuthToken';
// Obtener datos del usuario
import GetUserInfo from '../Auth/GetUserInfo';

function Help() {
    const [searchTerm, setSearchTerm] = useState("");
    const [openIndex, setOpenIndex] = useState(null);
    const [rol, setRol] = useState([]);
    const [usuario, setUsuario] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
          const token = localStorage.getItem('authToken');
    
          if (token) {
            setIsAuthenticated(true);
            try {
              const { rol, identificacion } = await GetUserInfo();
              setRol(rol || []);
    
              // Llama a la API solo si tienes la identificación
              if (identificacion) {
                const result = await AuthToken.get(`usuario/list/${identificacion}`);
                setUsuario(result.data.data);
              }
    
              // Mueve el log aquí
              console.log('Authenticated:', true, 'Roles:', rol);
            } catch (error) {
              console.error('Error al cargar los datos del usuario:', error);
            }
          } else {
            setIsAuthenticated(false);
            console.log('Authenticated:', false, 'Roles:', []);
          }
        };
      
        checkAuthentication();
      }, []);

      const tutorials = [
        { id: "One", title: "¿Cómo puedo reportar una obra arte en ImpulsArt?", video: "https://www.youtube.com/embed/pcgwRhHx3YE" },
        { id: "Two", title: "¿Qué sucede si el arte que compré llega dañado?", video: "https://www.youtube.com/embed/Cz5RCCc3EZY" },
        { id: "Three", title: "¿Cómo puedo enviar PQRS?", video: "https://www.youtube.com/embed/Cz5RCCc3EZY" },
        { id: "Four", title: "¿Cómo puedo enviar agregar direcciones?", video: "https://www.youtube.com/embed/L4XR18JDYSk" },
        { id: "Five", title: "¿Cómo puedo subir obras?", video: "https://www.youtube.com/embed/BBZxN2oigfc" },
        { id: "Six", title: "¿Cómo puedo iniciar una subasta?", video: "https://www.youtube.com/embed/5F9naRxccXc" },
        { id: "Seven", title: "¿Como puedo comprar una obra en venta?", video: "https://www.youtube.com/embed/-oC5-ocznxE" },
        { id: "Eight", title: "¿Como actualizar mis datos personales?", video: "https://www.youtube.com/embed/jeLuG2VpUbs?si=d-3uYbKoc_6KYEF_" },
    ];
    
    if (isAuthenticated && rol.includes('ASESOR')) {
        tutorials.push(
            { id: "Nine", title: "¿Como atender reportes en ImpulsArt?", video: "https://www.youtube.com/embed/Vl2Y7QpznCY?si=Vp0p8SRsU_QzF4cx" },
            { id: "Ten", title: "¿Como atender pqrs como asesor?", video: "https://www.youtube.com/embed/4v7IOw9a2iE?si=wiAfOAcDXOMSZQkB" },
        );
    }

    if (isAuthenticated && rol.includes('DOMICILIARIO')) {
        tutorials.push(
            { id: "Eleven", title: "Como atender los despachos como domiciliario en ImpulsArt", video: "https://www.youtube.com/embed/SEF5cv--uhI?si=YCKNN3TsfDqQ8Yyz" }
        );
    }

    const filteredTutorials = tutorials.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div style={{ marginTop: '0px', paddingTop: '0px' }}>
            <Navbar_init />
            <div className="d-flex justify-content-center">
                <div className="accordion justify-content-center support-container" id="accordionExample">
                    <h1 className='support-text'>Soporte</h1>

                    {/* Campo de búsqueda */}
                    <input
                        type="text"
                        placeholder="Buscar tutorial..."
                        className="form-control mb-3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Renderizar acordeones filtrados */}
                    {filteredTutorials.map((tutorial, index) => (
                        <div key={tutorial.id} className="accordion-item" style={{ overflow: 'hidden' }}>
                            <h2 className="accordion-header" id={`heading${tutorial.id}`} style={{ fontSize: '16px', margin: '0' }}>
                                <button
                                    className="accordion-button"
                                    type="button"
                                    onClick={() => toggleAccordion(index)}
                                    aria-expanded={openIndex === index}
                                    aria-controls={`collapse${tutorial.id}`}
                                >
                                    {tutorial.title}
                                </button>
                            </h2>
                            <div
                                id={`collapse${tutorial.id}`}
                                className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}
                                aria-labelledby={`heading${tutorial.id}`}
                                data-bs-parent="#accordionExample"
                                style={{
                                    transition: 'height 0.35s ease',
                                }}
                            >
                                <div className="accordion-body">
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <iframe
                                            width="700"
                                            height="400"
                                            src={tutorial.video}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Help;
