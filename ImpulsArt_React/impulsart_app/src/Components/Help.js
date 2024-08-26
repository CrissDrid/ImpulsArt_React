import Navbar_init from './Navbar_init';
import Footer from './Footer';

function Help() {
    return (
        <div style={{ marginTop: '0px', paddingTop: '0px' }}>
            <Navbar_init />
            <div className="d-flex justify-content-center">
                <div className="accordion justify-content-center support-container" id="accordionExample">
                <h1 className='support-text'>Soporte</h1>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne" style={{ fontSize: '16px', margin: '0' }}>
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                ¿Cómo puedo comprar arte en ImpulsArt?
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <iframe width="700" height="400" src="https://www.youtube.com/embed/LEr3qf9FC_Q?si=g1YXm_qOj9X9Jl6t" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo" style={{ fontSize: '16px', margin: '0' }}>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                ¿Cómo puedo vender mi arte en ImpulsArt?
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <iframe width="700" height="400" src="https://www.youtube.com/embed/LEr3qf9FC_Q?si=g1YXm_qOj9X9Jl6t" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree" style={{ fontSize: '16px', margin: '0' }}>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                ¿Qué sucede si el arte que compré llega dañado?
                            </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <iframe width="700" height="400" src="https://www.youtube.com/embed/LEr3qf9FC_Q?si=g1YXm_qOj9X9Jl6t" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFour" style={{ fontSize: '16px', margin: '0' }}>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                ¿Cómo puedo estar seguro de que las obras de arte en ImpulsArt son auténticas?
                            </button>
                        </h2>
                        <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <iframe width="700" height="400" src="https://www.youtube.com/embed/LEr3qf9FC_Q?si=g1YXm_qOj9X9Jl6t" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFive" style={{ fontSize: '16px', margin: '0' }}>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                ¿Cuánto tiempo se tarda en recibir mi obra de arte después de realizar la compra?
                            </button>
                        </h2>
                        <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <iframe width="700" height="400" src="https://www.youtube.com/embed/LEr3qf9FC_Q?si=g1YXm_qOj9X9Jl6t" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Help;
