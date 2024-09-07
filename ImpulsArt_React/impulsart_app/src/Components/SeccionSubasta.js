import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar_init from './Navbar_init';
import Footer from './Footer';

//Autenticacion de apis
import AuthToken from '../Auth/AuthToken'; 

function SeccionSubasta() {
  const [listSubasta, setListSubasta] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  useEffect(() => {
    getSubasta(); // Llama a la función para obtener las subastas al cargar el componente
  }, [currentPage]); // Dependencia en currentPage para manejar la paginación

  const normalizeData = (data) => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      return [];
    }
  };

  const getSubasta = () => {
    AuthToken.get(`${process.env.REACT_APP_API_BASE_URL}subasta/subastaYobras`)
      .then((response) => {
        console.log(response.data.data); // Verificar la estructura de los datos
        setListSubasta(normalizeData(response.data.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderCards = () => {
    return listSubasta.slice(startIndex, endIndex).map((subasta, index) => (
      <div className="col" key={index}>
        <div className="card shadow-sm">
          <img
            src={subasta.obras.imagen} // Asegúrate de que `subasta.obra.imagen` es la propiedad correcta
            className="bd-placeholder-img card-img-top"
            width="100%"
            height="225"
            alt={`Imagen: ${subasta.obras.nombreProducto}`} // Ajusta el acceso a `nombreProducto` según tu estructura
          />
          <div className="card-body">
            <h5 className="card-title">{subasta.obras.nombreProducto}</h5>
            <p className="card-text"> Categoria: {subasta.obras.categoria.nombreCategoria}</p>
            <div className="d-flex justify-content-between align-items-center">
            <Link to={`/DetallesSubasta/${subasta.pkCodSubasta}`} className="btn btn-outline-primary mx-2">Ver obra en subasta</Link>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const totalPages = Math.ceil(listSubasta.length / itemsPerPage);
  return (
    <>
    <Navbar_init/>
    <div className="album py-5 bg-custom-color">
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {renderCards()}
        </div>
        <div className="d-flex justify-content-center mt-3">
          <nav aria-label="Page navigation example">
            <ul className="pagination" style={{ margin: '0' }}>
              <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                <button
                  className="page-link"
                  onClick={() => handlePaginationClick(currentPage - 1)}
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              {[...Array(totalPages).keys()].map((num) => (
                <li
                  key={num}
                  className={`page-item ${currentPage === num + 1 && 'active'}`}
                  onClick={() => handlePaginationClick(num + 1)}
                  style={{ margin: '0' }}
                >
                  <button className="page-link">{num + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                <button
                  className="page-link custom-page"
                  onClick={() => handlePaginationClick(currentPage + 1)}
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default SeccionSubasta;