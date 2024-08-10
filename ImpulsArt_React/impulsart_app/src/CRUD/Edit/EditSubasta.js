import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art3.avif';

const EditSubasta = () => {
    const { pkCodSubasta } = useParams();
    const navigate = useNavigate();

    const [subasta, setSubasta] = useState({
        nombreProducto: "",
        costo: 0,
        peso: "",
        tamano: "",
        cantidad: 0,
        categoriaId: "",
        categoriaNombre: "",  // Aquí almacenamos el nombre de la categoría
        descripcion: "",
        estadoSubasta: "Activo",
        precioInicial: "",
        fechaFinalizacion: "",
        imagen: null,
        imagenPreview: null
    });

    const [categorias, setCategorias] = useState([]);  // Estado para almacenar las categorías

    useEffect(() => {
        const loadSubasta = async () => {
            try {
                const result = await axios.get(`http://localhost:8086/api/subasta/list/${pkCodSubasta}`);
                const subastaData = result.data.data[0];
                setSubasta({
                    nombreProducto: subastaData.obras.nombreProducto,
                    costo: subastaData.obras.costo,
                    peso: subastaData.obras.peso,
                    tamano: subastaData.obras.tamano,
                    cantidad: subastaData.obras.cantidad,
                    categoriaId: subastaData.obras.categoria.pkCod_Categoria, 
                    categoriaNombre: subastaData.obras.categoria.nombreCategoria,  // Cargamos el nombre de la categoría
                    descripcion: subastaData.obras.descripcion,
                    estadoSubasta: subastaData.estadoSubasta,
                    precioInicial: subastaData.precioInicial,
                    fechaFinalizacion: subastaData.fechaFinalizacion,
                    imagen: subastaData.obras.imagen,
                    imagenPreview: subastaData.obras.imagen
                });
            } catch (error) {
                console.error('Error al cargar la subasta:', error);
            }
        };

        const loadCategorias = async () => {
            try {
                const result = await axios.get('http://localhost:8086/api/categoria/all');
                setCategorias(result.data.data);  // Supongo que las categorías están en `result.data.data`
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            }
        };

        loadSubasta();
        loadCategorias();  // Cargar las categorías cuando se monta el componente
    }, [pkCodSubasta]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubasta(prevSubasta => ({
            ...prevSubasta,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSubasta(prevSubasta => ({
            ...prevSubasta,
            imagen: file,
            imagenPreview: file ? URL.createObjectURL(file) : null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in subasta) {
            if (key === 'imagen' && subasta[key]) {
                formData.append('imagen', subasta[key]);
            } else if (key !== 'imagen') {
                formData.append(key, subasta[key]);
            }
        }

        try {
            await axios.put(`http://localhost:8086/api/subasta/update/${pkCodSubasta}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate("/ListSubasta");
        } catch (error) {
            console.error('Error al actualizar la subasta:', error);
        }
    };

    useEffect(() => {
        return () => {
            if (subasta.imagenPreview) {
                URL.revokeObjectURL(subasta.imagenPreview);
            }
        };
    }, [subasta.imagenPreview]);

    return (
        <div className="register-container">
            <div className="register-content row justify-content-center">
                <div className='col-md-6'>
                    <div className="register-form">
                        <div className="register-image">
                            <img className="logo-register" src={Logo} alt="" />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                {/* Campos del formulario */}
                                <div className="form-floating">
                                    <input
                                        className="form-control"
                                        id="floatingNombreProducto"
                                        name="nombreProducto"
                                        value={subasta.nombreProducto}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Nombre del producto"
                                        required
                                    />
                                    <label htmlFor="floatingNombreProducto">Nombre del Producto</label>
                                </div>
                                <br />
                                <div className="form-floating">
                                    <input
                                        className="form-control"
                                        id="floatingPeso"
                                        name="peso"
                                        value={subasta.peso}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Peso"
                                        required
                                    />
                                    <label htmlFor="floatingPeso">Peso</label>
                                </div>
                                <br />
                                <div className="form-floating">
                                    <input
                                        className="form-control"
                                        id="floatingTamano"
                                        name="tamano"
                                        value={subasta.tamano}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Tamaño"
                                        required
                                    />
                                    <label htmlFor="floatingTamano">Tamaño</label>
                                </div>
                                <br />
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
                                    <label htmlFor="floatingCategoriaId">Categoría: {subasta.categoriaNombre}</label> {/* Mostrar el nombre de la categoría */}
                                </div>
                                <br />
                                <div className="form-floating">
                                    <input
                                        className="form-control"
                                        id="floatingPrecioInicial"
                                        name="precioInicial"
                                        value={subasta.precioInicial}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder="Precio Inicial"
                                        required
                                    />
                                    <label htmlFor="floatingPrecioInicial">Precio Inicial</label>
                                </div>
                                <br />
                                <div className="form-floating">
                                    <input
                                        className="form-control"
                                        id="floatingFechaFinalizacion"
                                        name="fechaFinalizacion"
                                        value={subasta.fechaFinalizacion}
                                        onChange={handleInputChange}
                                        type="date"
                                        placeholder="Fecha de Finalización"
                                        required
                                    />
                                    <label htmlFor="floatingFechaFinalizacion">Fecha de Finalización</label>
                                </div>
                                <br />
                                <div className="form-floating">
                                    <textarea
                                        className="form-control"
                                        id="floatingDescripcion"
                                        name="descripcion"
                                        value={subasta.descripcion}
                                        onChange={handleInputChange}
                                        placeholder="Descripción"
                                        required
                                    ></textarea>
                                    <label htmlFor="floatingDescripcion">Descripción</label>
                                </div>
                                <br />
                                <div className="form-group">
                                    <div className="image-upload" onClick={() => document.getElementById('fileInput').click()}>
                                        {subasta.imagenPreview ? (
                                            <img src={subasta.imagenPreview} alt="Previsualización" className="img-fluid preview-image" />
                                        ) : (
                                            <div className="image-placeholder">
                                                <i className="cross-icon bi bi-plus"></i>
                                                <p className='text-subirObra'>Subir Imagen</p>
                                            </div>
                                        )}
                                        <input
                                            id="fileInput"
                                            type="file"
                                            name="imagen"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </div>
                                <br />
                                <button className="btn btn-primary w-100 py-2 create-btn" type="submit">Editar Subasta</button>
                                <Link to='/ListSubasta'><button className="btn btn-danger w-100 py-2 cancel-btn">Cancelar</button></Link>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='col-md-6'>
                    <img className='register-img' src={Art} alt="" />
                </div>
            </div>
        </div>
    );
};

export default EditSubasta;




