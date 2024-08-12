import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../Styles/Galery.css';

function Galery() {
  const [listObra, setListObra] = useState([]);
  const [listSubasta, setListSubasta] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [currentPage, setCurrentPage] = useState(1);
  const [showSubasta, setShowSubasta] = useState(false);
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const navigate = useNavigate();

  useEffect(() => {
    if (showSubasta) {
      getSubasta();
    } else {
      getObra();
    }
  }, [currentPage, showSubasta]);

  const getObra = () => {
    axios.get(`http://localhost:8086/api/obra/historialObras/${user.identificacion}`)
      .then((response) => {
        setListObra(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getSubasta = () => {
    axios.get(`http://localhost:8086/api/subasta/historialObraSubastas/${user.identificacion}`)
      .then((response) => {
        setListSubasta(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderObraCards = () => {
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
          </div>
        </div>
      </div>
    ));
  };
  
  const renderSubastaCards = () => {
    return listSubasta.slice(startIndex, endIndex).map((subasta, index) => (
      <div className="col" key={index}>
        <div className="card shadow-sm">
          <img
            src={subasta.obras.imagen} // Asegúrate de que `subasta.obras.imagen` es la propiedad correcta
            className="bd-placeholder-img card-img-top"
            width="100%"
            height="225"
            alt={`Imagen: ${subasta.obras.nombreProducto}`} // Ajusta el acceso a `nombreProducto` según tu estructura
          />
          <div className="card-body">
            <h5 className="card-title">{subasta.obras.nombreProducto}</h5>
            <p className="card-text">Categoría: {subasta.obras.categoria.nombreCategoria}</p>
          </div>
        </div>
      </div>
    ));
  };
  
  const renderCards = () => {
    return showSubasta ? renderSubastaCards() : renderObraCards();
  };

  const handleSubirObraClick = () => {
    Swal.fire({
      title: '¿Qué te gustaría hacer?',
      text: "¿Deseas subir una nueva obra a tu galería o prefieres iniciar una subasta?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Subir Obra',
      cancelButtonText: 'Iniciar Subasta',
      confirmButtonColor: "#8D33FF",
      cancelButtonColor: "#8D33FF",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/CreateObra');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate('/CreateSubasta');
      }
    });
  };

  const totalPages = Math.ceil((showSubasta ? listSubasta.length : listObra.length) / itemsPerPage);

  return (
    <div>
      <div className="row">
        <h2>Mi Galería</h2>
        <div className="col-md-6 d-flex">
          <button onClick={() => setShowSubasta(!showSubasta)}>
            {showSubasta ? 'Ver obras en venta' : 'Ver obras en subasta'}
          </button>
        </div>
      </div>  

      <div className="flex-container">
        <div className="user-data">
          <div className="form-group">
            <div className="subir-obra" onClick={handleSubirObraClick}>
              <div className="image-placeholder">
                <i className="cross-icon bi bi-plus"></i>
                <p className="text-subirObra">Nueva Obra</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="galery-container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {renderCards()}
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <nav aria-label="Page navigation example">
          <ul className="pagination" style={{ margin: '0' }}>
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {[...Array(totalPages).keys()].map((num) => (
              <li
                key={num}
                className={`page-item ${currentPage === num + 1 && 'active'}`}
                onClick={() => setCurrentPage(num + 1)}
                style={{ margin: '0' }}
              >
                <button className="page-link">{num + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
              <button
                className="page-link custom-page"
                onClick={() => setCurrentPage(currentPage + 1)}
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

export default Galery;
