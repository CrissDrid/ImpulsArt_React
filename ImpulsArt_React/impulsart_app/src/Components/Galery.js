import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Styles/Galery.css';

//Autenticacion de apis
import AuthToken from '../Auth/AuthToken'; 
// Obtener datos del usuario
import GetUserInfo from '../Auth/GetUserInfo'; 

function Galery() {
  const [listObra, setListObra] = useState([]);
  const [identificacion, setIdentificacion] = useState('');
  const [listSubasta, setListSubasta] = useState([]);
  const [showSubasta, setShowSubasta] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    if (showSubasta) {
      getSubasta();
    } else {
      getObra();
    }

    //Obtener la identificacion del usuario
    const { identificacion } = GetUserInfo();
    setIdentificacion(identificacion);

  }, [showSubasta]);

  const getObra = async () => {
    try {
      const response = await AuthToken.get(`obra/historialObras/${identificacion}`);
      setListObra(response.data.data);
    } catch (e) {
      console.error('Error en getObra:', e.response ? e.response.data : e.message);
    }
  };

  const getSubasta = async () => {
    try {
      const response = await AuthToken.get(`subasta/historialObraSubastas/${identificacion}`);
      setListSubasta(response.data.data);
    } catch (e) {
      console.error('Error en getSubasta:', e.response ? e.response.data : e.message);
    }
  };

  const handleCardClick = (pkCod_Producto, pkCod_Subasta) => {
    Swal.fire({
      title: '¿Qué deseas hacer?',
      text: "Puedes editar o eliminar esta obra.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Eliminar',
      confirmButtonColor: "#8D33FF",
      cancelButtonColor: "#FF5733",
    }).then((result) => {
      if (result.isConfirmed) {
        if (showSubasta) {
          navigate(`/EditSubasta/${pkCod_Subasta}`); // Redirige al formulario de edición de subasta
        } else {
          navigate(`/EditObra/${pkCod_Producto}`); // Redirige al formulario de edición de obra
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: '¿Estás seguro?',
          text: "Esta acción eliminará permanentemente la obra.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: "#FF5733",
          cancelButtonColor: "#8D33FF",
        }).then(async (deleteResult) => {
          if (deleteResult.isConfirmed) {
            const deleteUrl = showSubasta
              ? `subasta/delete/${pkCod_Subasta}`
              : `obra/delete/${pkCod_Producto}`;
  
            try {
              await AuthToken.delete(deleteUrl);
              Swal.fire('Eliminado', 'La obra ha sido eliminada.', 'success');
              if (showSubasta) {
                getSubasta();
              } else {
                getObra();
              }
            } catch (e) {
              console.error('Error en eliminar obra:', e.response ? e.response.data : e.message);
              Swal.fire('Error', 'No se pudo eliminar la obra.', 'error');
            }
          }
        });
      }
    });
  };

  const renderObraCards = () => {
    return listObra.map((obra) => (
      <div className="obra-card" key={obra.pkCod_Producto} onClick={() => handleCardClick(obra.pkCod_Producto)}>
        <img
          src={obra.imagen}
          alt={`Imagen: ${obra.nombreProducto}`}
        />
        <div className="obra-info">
          <h5>{obra.nombreProducto}</h5>
          <p>{obra.descripcion}</p>
        </div>
      </div>
    ));
  };

  const renderSubastaCards = () => {
    return listSubasta.map((subasta) => (
      <div className="obra-card" key={subasta.obras.id} onClick={() => handleCardClick(subasta.obras.id, subasta.pkCodSubasta)}>
        <img
          src={subasta.obras.imagen}
          alt={`Imagen: ${subasta.obras.nombreProducto}`}
        />
        <div className="obra-info">
          <h5>{subasta.obras.nombreProducto}</h5>
          <p>Categoría: {subasta.obras.categoria.nombreCategoria}</p>
        </div>
      </div>
    ));
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

  return (
    <div className="user-data">
      <h2>Mi Galería</h2>
      <button className='galery-container' onClick={() => setShowSubasta(!showSubasta)}>
        {showSubasta ? 'Ver obras en venta' : 'Ver obras en subasta'}
      </button>

      <div className="obras-grid">
        <div className="subir-obra" onClick={handleSubirObraClick}>
          <div className="image-placeholder">
            <i className="cross-icon bi bi-plus"></i>
            <p className="text-subirObra">Nueva Obra</p>
          </div>
        </div>

        {showSubasta ? renderSubastaCards() : renderObraCards()}
      </div>
    </div>
  );
}

export default Galery;
