import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../Styles/Galery.css'

function Galery() {
  const navigate = useNavigate();

  const handleSubirObraClick = () => {
    navigate('/CreateObra');
  };

  return (
    <div className="user-data">
        <h2>Mi Galería</h2>
        <div className="form-group">
            <div className="subir-obra" onClick={handleSubirObraClick}>
                <div className="image-placeholder">
                    <i className="cross-icon bi bi-plus"></i>
                    <p className='text-subirObra'>Nueva Obra</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Galery;
