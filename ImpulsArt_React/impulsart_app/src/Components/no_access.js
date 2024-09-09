import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Imagen404 from '../Resources/img-404.png';

const NoAccess = () => {
  const navigate = useNavigate(); // Inicializar el hook useNavigate

  const handleGoHome = () => {
    navigate('/home'); // Navegar a /home cuando se haga clic
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img src={Imagen404} alt="404 error" className="img-fluid" />
          </div>
          <div className="text-container col-md-6">
            <h1>Parece que se nos perdio una lata de pintura. Pero ya la estamos buscando</h1>
            <br />
            <h5>Error 404 :(</h5>
            <h6>Parece que lo que estás buscando ya no se encuentra. Lo sentimos.</h6>
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="bot btn btn-primary"
                onClick={handleGoHome} // Ejecutar la función handleGoHome al hacer clic
              >
                Regresar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoAccess;
