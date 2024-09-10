import React, { useState } from 'react';
import Navbar_init from './Navbar_init';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Help() {
    const [searchTerm, setSearchTerm] = useState("");

    const tutorials = [
        { id: "One", title: "¿Cómo puedo Iniciar sesion?", video: "https://www.youtube.com/embed/LEr3qf9FC_Q?si=g1YXm_qOj9X9Jl6t" },
        { id: "Two", title: "¿Cómo puedo vender mi arte en ImpulsArt?", video: "https://www.youtube.com/embed/LEr3qf9FC_Q?si=g1YXm_qOj9X9Jl6t" },
        { id: "Three", title: "¿Qué sucede si el arte que compré llega dañado?", video: "https://www.youtube.com/embed/LEr3qf9FC_Q?si=g1YXm_qOj9X9Jl6t" },
        { id: "Four", title: "¿Cómo puedo estar seguro de que las obras de arte en ImpulsArt son auténticas?", video: "https://www.youtube.com/embed/LEr3qf9FC_Q?si=g1YXm_qOj9X9Jl6t" },
        { id: "Five", title: "¿Cuánto tiempo se tarda en recibir mi obra de arte después de realizar la compra?", video: "https://www.youtube.com/embed/LEr3qf9FC_Q?si=g1YXm_qOj9X9Jl6t" }
    ];

    const filteredTutorials = tutorials.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <div key={tutorial.id} className="accordion-item">
                            <h2 className="accordion-header" id={`heading${tutorial.id}`} style={{ fontSize: '16px', margin: '0' }}>
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${tutorial.id}`} aria-expanded={index === 0} aria-controls={`collapse${tutorial.id}`}>
                                    {tutorial.title}
                                </button>
                            </h2>
                            <div id={`collapse${tutorial.id}`} className="accordion-collapse collapse" aria-labelledby={`heading${tutorial.id}`} data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <iframe width="700" height="400" src={tutorial.video} title="YouTube video player" frameBorder="0" allowFullScreen></iframe>
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

