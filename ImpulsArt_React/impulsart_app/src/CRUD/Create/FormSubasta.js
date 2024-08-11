import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art3.avif';
import { Link } from 'react-router-dom';
import Navbar_init from '../../Components/Navbar_init';
import Footer from '../../Components/Footer';

export const FormSubasta = () => {
    let navigate = useNavigate();

    const [subasta, setSubasta] = useState({
        nombreProducto: "",
        costo: 0,
        peso: "",
        tamano: "",
        cantidad: 0,
        categoriaId: "",
        descripcion: "",
        estadoSubasta: "Activo",
        precioInicial: "",
        fechaInicio: new Date().toISOString().slice(0, 10),
        fechaFinalizacion: "",
        imagen: null
    });

    const [categorias, setCategorias] = useState([]);  // Estado para almacenar las categorías

    useEffect(() => {
        const loadCategorias = async () => {
            try {
                const result = await axios.get('http://localhost:8086/api/categoria/all');
                setCategorias(result.data.data);  // Supongo que las categorías están en `result.data.data`
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            }
        };

        loadCategorias();  // Cargar las categorías cuando se monta el componente
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubasta({ ...subasta, [name]: value });
    };

    const handleFileChange = (e) => {
        setSubasta({ ...subasta, imagen: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
  
        const formData = new FormData();
        for (const key in subasta) {
            formData.append(key, subasta[key]);
        }
  
        try {
            const response = await axios.post("http://localhost:8086/api/subasta/create", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            navigate("/ListSubasta");
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    };

    const handleCancel = () => {
        navigate("/ListSubasta");
    };

    return (
        <>
        <Navbar_init />
            <div className="register-container">
                <div className="register-content row justify-content-center">
                    <div className='col-md-6'>
                        <div className="register-form">
                            <div className="register-image">
                                <img className="logo-register" src={Logo} alt="Logo" />
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input className="form-control" id="floatingNombreProducto" placeholder="Nombre del producto" name="nombreProducto" value={subasta.nombreProducto} onChange={handleInputChange} type="text" required />
                                                <label htmlFor="floatingNombreProducto">Nombre del Producto</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-floating">
                                    <input className="form-control" id="floatingPeso" placeholder="Peso" name="peso" value={subasta.peso} onChange={handleInputChange} type="text" required />
                                    <label htmlFor="floatingPeso">Peso</label>
                                </div>
                                <div className="form-floating">
                                    <input className="form-control" id="floatingTamano" placeholder="Tamaño" name="tamano" value={subasta.tamano} onChange={handleInputChange} type="text" required />
                                    <label htmlFor="floatingTamano">Tamaño</label>
                                </div>
                                <div className="form-floating">
                                    <select
                                        className="form-control"
                                        id="floatingCategoriaId"
                                        name="categoriaId"
                                        value={subasta.categoriaId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Seleccione una categoría</option>
                                        {categorias.map(categoria => (
                                            <option key={categoria.pkCod_Categoria} value={categoria.pkCod_Categoria}>
                                                {categoria.nombreCategoria}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="floatingCategoriaId">Categoría</label>
                                </div>
                                <div className="form-floating">
                                    <input className="form-control" id="floatingPrecioInicial" placeholder="Precio Inicial" name="precioInicial" value={subasta.precioInicial} onChange={handleInputChange} type="number" required />
                                    <label htmlFor="floatingPrecioInicial">Oferta minima</label>
                                </div>
                                <div className="form-floating">
                                    <input className="form-control" id="floatingFechaFinalizacion" placeholder="Fecha de Finalización" name="fechaFinalizacion" value={subasta.fechaFinalizacion} onChange={handleInputChange} type="date" required />
                                    <label htmlFor="floatingFechaFinalizacion">Fecha de Finalización</label>
                                </div>
                                <div className="form-floating">
                                    <textarea className="form-control" id="floatingDescripcion" placeholder="Descripción" name="descripcion" value={subasta.descripcion} onChange={handleInputChange} required></textarea>
                                    <label htmlFor="floatingDescripcion">Descripción</label>
                                </div>
                                <div className="form-group">
                                    <div className="image-upload" onClick={() => document.getElementById('fileInput').click()}>
                                        {subasta.imagen ? (
                                            <img src={URL.createObjectURL(subasta.imagen)} alt="Previsualización" className="img-fluid preview-image" />
                                        ) : (
                                            <div className="image-placeholder">
                                                <i className="cross-icon bi bi-plus"></i>
                                                <p className='text-subirObra'>Subir Imagen</p>
                                            </div>
                                        )}
                                        <input id="fileInput" type="file" name="imagen" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                    </div>
                                </div>
                                <br />
                                <button className="btn btn-primary w-100 py-2 create-btn" type="submit">Crear</button>
                                <button className="btn btn-danger w-100 py-2 cancel-btn" type="button" onClick={handleCancel}>Cancelar</button>
                            </form>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <img className='register-img' src={Art} alt="" />
                    </div>
                </div>
                <div className="footer-register">
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default FormSubasta;

