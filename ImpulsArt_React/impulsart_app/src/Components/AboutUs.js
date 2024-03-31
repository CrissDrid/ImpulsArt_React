import React from 'react';
import Art from '../Resources/Art.svg'

function AboutUs() {
  return (
    <div className='container-fluid about-container'>
      <div className='row align-items-center'>
        <div className='col-md-6'>
          <img className='art-img' src={Art} alt="" />
        </div>
        <div className='col-md-6'>
          <div className='about-content'>
            <h1 className='about-text'>SOBRE NOSOTROS</h1>
            <p className='about-description'>
            ImpulsArt se crea con la misión principal impulsar y promover el arte colombiano, 
            brindando a los artistas locales la oportunidad de dar a conocer su trabajo y 
            crecer en su carrera artística. Además, busca acercar a las personas amantes 
            del arte a obras únicas y de calidad, creando así un puente entre artistas y 
            admiradores que permite enriquecer la cultura y el aprecio por el arte en Colombia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
