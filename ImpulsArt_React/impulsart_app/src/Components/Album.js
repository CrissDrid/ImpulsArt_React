import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';

function Album() {
  const [listObra, setListObra] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const [categoria, setCategoria] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');

  useEffect(() => {
    if (categoria && !nombreProducto) {
      getObraByCategoria();
    } else if (nombreProducto && !categoria) {
      getObraByNombreProducto();
    } else if (categoria && nombreProducto) {
      getObraByCategoriaAndNombreProducto();
    } else {
      getObra();
    }
  }, [categoria, nombreProducto, currentPage]);

  const normalizeData = (data) => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      return [];
    }
  };

  const getObra = () => {
    axios.get("http://localhost:8086/api/obra/all")
      .then((response) => {
        setListObra(normalizeData(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getObraByCategoria = () => {
    axios.get(`http://localhost:8086/api/obra/categoria/${categoria}`)
      .then((response) => {
        setListObra(normalizeData(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getObraByNombreProducto = () => {
    axios.get(`http://localhost:8086/api/obra/nombreProducto/${nombreProducto}`)
      .then((response) => {
        setListObra(normalizeData(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getObraByCategoriaAndNombreProducto = () => {
    axios.get(`http://localhost:8086/api/obra/categoria/${categoria}/nombreProducto/${nombreProducto}`)
      .then((response) => {
        setListObra(normalizeData(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderCards = () => {
    return listObra.slice(startIndex, endIndex).map((obra, index) => (
      <div className="col" key={index}>
        <div className="card shadow-sm">
          <img
            src={obra.imagen}
            className="bd-placeholder-img card-img-top"
            width="100%"
            height="225"
            alt={`Imagen: ${obra.nombreProducto}`}
          />
          <div className="card-body">
            <h5 className="card-title">{obra.nombreProducto}</h5>
            <p className="card-text">{obra.descripcion}</p>
            <p className="card-text">Categoría: {obra.categoria}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-sm btn-outline-secondary">
                  View
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary">
                  Edit
                </button>
              </div>
              <small className="text-body-secondary">9 mins</small>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const totalPages = Math.ceil(listObra.length / itemsPerPage);
  return (
    <div className="album py-5 bg-custom-color">
      <div className="container">

        {/*FORMULARIO PARA BUSCAR POR FILTRO*/}
        <div className="row">
          <div className="col-md-6 d-flex">
          <select
       value={categoria}
       onChange={(e) => setCategoria(e.target.value)}
       className="form-select"
        >
   <option value="">Selecciona la categoría de su obra</option>
    <option value="Pintura">Pintura</option>
    <option value="Dibujo">Dibujo</option>
    <option value="Maqueta">Maqueta</option>
    <option value="Ceramica">Ceramica</option>
</select>
<br></br>
            <input
                 className="form-control me-2 search-form"
                 type="search"
                 placeholder="Buscar por nombre de producto"
                 aria-label="Buscar"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                />
          </div>
        </div>
         {/*FORMULARIO PARA BUSCAR POR FILTRO*/}

        <br/>
        <br/>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">{renderCards()}</div>
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
  );
}

export default Album;
