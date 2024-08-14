import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art4.jpg';
import Navbar_init from '../../Components/Navbar_init';
import Footer from '../../Components/Footer';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import Swal from 'sweetalert2';

const formatCurrency = (value) => {
    const number = value.replace(/[^0-9]/g, '');
    return `$${new Intl.NumberFormat('es-CO').format(number)}`;
};

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
        categoriaNombre: "",
        descripcion: "",
        estadoSubasta: "Activo",
        precioInicial: "",
        fechaFinalizacion: "",
        imagen: null,
        imagenPreview: null
    });

    const [categorias, setCategorias] = useState([]);
    const [formChanged, setFormChanged] = useState(false); // Estado para detectar cambios
    const toast = React.useRef(null);

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
                    alto: subastaData.obras.alto,
                    ancho: subastaData.obras.ancho,
                    cantidad: subastaData.obras.cantidad,
                    categoriaId: subastaData.obras.categoria.pkCod_Categoria,
                    categoriaNombre: subastaData.obras.categoria.nombreCategoria,
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
                setCategorias(result.data.data);
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            }
        };

        loadSubasta();
        loadCategorias();
    }, [pkCodSubasta]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'precioInicial') {
            const rawValue = value.replace(/[^0-9]/g, '');
            setSubasta(prevSubasta => ({
                ...prevSubasta,
                [name]: formatCurrency(rawValue)
            }));
        } else if (name === 'alto' || name === 'ancho') {
            const rawValue = value.replace(/[^\d]/g, '');
            const updatedValue = rawValue ? `${rawValue}cm` : '';
            setSubasta(prevSubasta => {
                const updatedSubasta = { ...prevSubasta, [name]: updatedValue };
                if (updatedSubasta.alto && updatedSubasta.ancho) {
                    updatedSubasta.tamano = `${updatedSubasta.alto} x ${updatedSubasta.ancho}`;
                } else {
                    updatedSubasta.tamano = updatedSubasta.alto || updatedSubasta.ancho ? `${updatedSubasta.alto} x ${updatedSubasta.ancho}` : '';
                }
                return updatedSubasta;
            });
        } else {
            setSubasta({ ...subasta, [name]: value });
        }
        setFormChanged(true); // Indicar que el formulario ha cambiado
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSubasta(prevSubasta => ({
            ...prevSubasta,
            imagen: file,
            imagenPreview: file ? URL.createObjectURL(file) : null
        }));
        setFormChanged(true); // Indicar que el formulario ha cambiado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subasta.nombreProducto || !subasta.precioInicial || !subasta.peso || !subasta.tamano || !subasta.categoriaId || !subasta.descripcion || !subasta.imagen) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos deben estar completos' });
            return;
        }
        
        if (subasta.nombreProducto.length > 50) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El nombre de la obra debe contener un máximo de 50 caracteres' });
            return;
        }
        
        if (subasta.alto === "0cm" || subasta.ancho === "0cm") {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El tamaño no puede ser 0cm' });
            return;
        }
        
        if (subasta.peso === "0Kg") {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El peso no puede ser 0Kg' });
            return;
        }
        
        // Validar el precio inicial
        const rawPrice = subasta.precioInicial.replace(/[^0-9]/g, '');
        if (parseInt(rawPrice, 10) > 1500000) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La oferta inicial no puede superar $1,500,000' });
            return;
        }
        
        if (subasta.precioInicial === "$0") {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La oferta inicial no puede ser $0' });
            return;
        }
        
        // Validar fecha de finalización
        const today = new Date();
        const selectedDate = new Date(subasta.fechaFinalizacion);
        
        if (selectedDate <= today) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La fecha de finalización debe ser después de la fecha actual' });
            return;
        }
        
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 7);
        
        if (selectedDate > maxDate) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La fecha de finalización no puede ser mayor a 1 semana desde hoy' });
            return;
        }
    
        // Mostrar un SweetAlert2 de confirmación
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: '¿Desea actualizar los datos de la subasta?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8D33FF',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        });
    
        if (result.isConfirmed) {
            // Si el usuario confirma, enviar el formulario
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
                Swal.fire(
                    'Actualizado!',
                    'Los datos de la subasta han sido actualizados.',
                    'success'
                );
                navigate(-1);
            } catch (error) {
                console.error('Error al actualizar la subasta:', error);
                Swal.fire(
                    'Error!',
                    'Hubo un problema al actualizar los datos de la subasta.',
                    'error'
                );
            }
        }
    };    

    const handleCancel = async () => {
        if (formChanged) {
            // Mostrar un SweetAlert2 de confirmación si el formulario ha cambiado
            const result = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Tienes cambios sin guardar. ¿Estás seguro de que deseas cancelar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#8D33FF',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, cancelar',
                cancelButtonText: 'No, volver'
            });
    
            if (result.isConfirmed) {
                navigate(-1); // Regresar a la página anterior
            }
        } else {
            navigate(-1); // Regresar a la página anterior si no hay cambios
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
        <>
        <Navbar_init />
        <div className="register-container">
            <div className="subasta-content row">
                <div className="col-md-6 image-wrapper">
                    <img className="createSubasta-img" src={Art} alt="Art" />
                </div>
                <div className='col-md-6'>
                    <div className="form-subasta-container">
                        <div className="register-image">
                            <img className="logo-register" src={Logo} alt="Logo" />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-floating">
                                <input
                                    className="form-control"
                                    id="floatingNombreProducto"
                                    placeholder="Nombre del producto"
                                    name="nombreProducto"
                                    value={subasta.nombreProducto}
                                    onChange={handleInputChange}
                                    type="text"
                                />
                                <label htmlFor="floatingNombreProducto">Nombre del producto</label>
                            </div>
                            <div className="form-row">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="group-tamano">
                                            <label htmlFor="tamano">Tamaño</label>
                                            <div className="row tamano-group">
                                                <div className="col-md-5">
                                                    <div className="form-floating">
                                                        <input
                                                            className="form-control form-tamano"
                                                            id="floatingAlto"
                                                            placeholder="Alto"
                                                            name="alto"
                                                            value={subasta.alto}
                                                            onChange={handleInputChange}
                                                            type="text"
                                                        />
                                                        <label htmlFor="floatingAlto">Alto</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-1 text-center">
                                                    <span className="tamano-separator">×</span>
                                                </div>
                                                <div className="col-md-5">
                                                    <div className="form-floating">
                                                        <input
                                                            className="form-control form-tamano"
                                                            id="floatingAncho"
                                                            placeholder="Ancho"
                                                            name="ancho"
                                                            value={subasta.ancho}
                                                            onChange={handleInputChange}
                                                            type="text"
                                                        />
                                                        <label htmlFor="floatingAncho">Ancho</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating form-cantidad">
                                            <input
                                                className="form-control"
                                                id="floatingPeso"
                                                placeholder="Peso"
                                                name="peso"
                                                value={subasta.peso}
                                                onChange={handleInputChange}
                                                type="text"
                                            />
                                            <label htmlFor="floatingPeso">Peso</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-floating">
                                <select
                                    className="form-control"
                                    id="floatingCategoriaId"
                                    name="categoriaId"
                                    value={subasta.categoriaId}
                                    onChange={handleInputChange}
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
                            <div className="form-row">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                className="form-control"
                                                id="floatingPrecioInicial"
                                                placeholder="Precio Inicial"
                                                name="precioInicial"
                                                value={subasta.precioInicial}
                                                onChange={handleInputChange}
                                                type="text"
                                            />
                                            <label htmlFor="floatingPrecioInicial">Oferta mínima</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                className="form-control"
                                                id="floatingFechaFinalizacion"
                                                placeholder="Fecha de Finalización"
                                                name="fechaFinalizacion"
                                                value={subasta.fechaFinalizacion}
                                                onChange={handleInputChange}
                                                type="date"
                                            />
                                            <label htmlFor="floatingFechaFinalizacion">Fecha de Finalización</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-floating">
                                <textarea
                                    className="form-control"
                                    style={{ resize: 'none', width: '100%', height: '10rem' }}
                                    placeholder="Descripción"
                                    name="descripcion"
                                    value={subasta.descripcion}
                                    onChange={handleInputChange}
                                    maxLength="155"
                                />
                                <label htmlFor="floatingDescripcion">Descripción</label>
                                <div className="character-counter d-flex justify-content-end">
                                    {subasta.descripcion.length}/155
                                </div>
                            </div>
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
                                    <input id="fileInput" type="file" name="imagen" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                </div>
                            </div>
                            <div className="btn-group d-flex justify-content-center">
                                <button className="btn btn-create btn-primary py-2 create-btn" disabled={!formChanged} type="submit">Actualizar Subasta</button>
                                <button className="btn btn-cancel btn-secondary py-2 cancel-btn" type="button" onClick={handleCancel}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        <Toast ref={toast} />
    </>
    );
};

export default EditSubasta;
