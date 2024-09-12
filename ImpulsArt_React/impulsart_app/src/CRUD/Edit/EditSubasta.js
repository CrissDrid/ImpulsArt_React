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

//Autenticacion de apis
import AuthToken from '../../Auth/AuthToken';

const formatCurrency = (value) => {
    const number = value.replace(/[^0-9]/g, '');
    return `$${new Intl.NumberFormat('es-CO').format(number)}`;
};

const EditSubasta = () => {
    const { pkCodSubasta } = useParams();
    const navigate = useNavigate();
    const [subasta, setSubasta] = useState({
        nombreProducto: "",
        peso: "",
        tamano: "",
        categoriaId: "",
        categoriaNombre: "",
        descripcion: "",
        imagen: ""
    });

    const [categorias, setCategorias] = useState([]);
    const [formChanged, setFormChanged] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [initialSubasta, setInitialSubasta] = useState({});
    const toast = React.useRef(null);

    useEffect(() => {
        const loadSubasta = async () => {
            try {
                const result = await AuthToken.get(`${process.env.REACT_APP_API_BASE_URL}subasta/list/${pkCodSubasta}`);
                const subastaData = result.data.data[0];
                console.log('Datos de la subasta:', subastaData); // Depura aquí para verificar los datos
    
                // Configurar el estado de subasta
                setSubasta({
                    nombreProducto: subastaData.obras.nombreProducto,
                    peso: subastaData.obras.peso,
                    tamano: `${subastaData.obras.alto} x ${subastaData.obras.ancho}`,
                    alto: subastaData.obras.alto,
                    ancho: subastaData.obras.ancho,
                    categoriaId: subastaData.obras.categoria.pkCod_Categoria,
                    categoriaNombre: subastaData.obras.categoria.nombreCategoria,
                    descripcion: subastaData.obras.descripcion,
                    imagen: subastaData.obras.imagen ? `data:${subastaData.obras.tipoImagen};base64,${subastaData.obras.imagen}` : null
                });
    
                // Verificar y mostrar la previsualización de la imagen
                if (subastaData.obras.imagen) {
                    const base64Image = `data:${subastaData.obras.tipoImagen};base64,${subastaData.obras.imagen}`;
                    setImagePreview(base64Image);
                } else {
                    setImagePreview(null);
                }
            } catch (error) {
                console.error('Error al cargar la subasta:', error);
            }
        };
    
        const loadCategorias = async () => {
            try {
                const result = await AuthToken.get(`${process.env.REACT_APP_API_BASE_URL}categoria/all`);
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
            // Formatear el valor del precio inicial como moneda
            const rawValue = value.replace(/[^0-9]/g, '');
            setSubasta({ ...subasta, [name]: formatCurrency(rawValue) });
        } else if (name === 'alto' || name === 'ancho') {
            // Eliminar caracteres no numéricos
            const rawValue = value.replace(/[^\d]/g, '');
            // Convertir el valor a número y limitarlo a 150
            const numberValue = parseInt(rawValue, 10);
            const limitedValue = numberValue > 150 ? 150 : numberValue;
            // Actualizar el valor con la unidad 'cm'
            const updatedValue = limitedValue ? `${limitedValue}cm` : '';

            setSubasta(prevSubasta => {
                const updatedSubasta = { ...prevSubasta, [name]: updatedValue };
                // Actualizar el campo 'tamano'
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
        setFormChanged(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
    
            reader.onloadend = () => {
                // Actualizar la vista previa de la imagen
                setImagePreview(reader.result);
                // Guardar el archivo en el estado de subasta
                setSubasta(prevSubasta => ({ ...prevSubasta, imagen: file }));

                setFormChanged(true);
            };
    
            // Leer el archivo como URL de datos
            reader.readAsDataURL(file);
        }
    };


    const handlePesoChange = (e) => {
        let value = e.target.value.replace(/[^\d]/g, ''); // Elimina caracteres no numéricos

        if (value === "") {
            setSubasta({ ...subasta, peso: "" }); // Si está vacío, no establecer valor
            return;
        }

        let numericValue = Number(value);

        if (numericValue === 0) {
            // No permitir valor 0
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El peso debe ser mayor que 0.' });
            return;
        }

        if (numericValue > 50) {
            value = "50Kg"; // Limitar a 50Kg si se supera el límite
        } else {
            value += "Kg";
        }

        setSubasta({ ...subasta, peso: value });
    };

    const isOnlyLettersWithValidSpaces = (str) => {
        // Permitir solo letras y un solo espacio entre palabras, sin espacios al inicio o al final
        return /^[A-Za-z]+( [A-Za-z]+)*$/.test(str);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isOnlyLettersWithValidSpaces(subasta.nombreProducto)) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El nombre de la obra solo debe contener letras y un solo espacio entre palabras, sin espacios al inicio o al final', life: 3000 });
            return;
        }

        if (!isOnlyLettersWithValidSpaces(subasta.descripcion)) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La descripcion de la obra solo debe contener letras y un solo espacio entre palabras, sin espacios al inicio o al final', life: 3000 });
            return;
        }

        if (!subasta.nombreProducto || !subasta.peso || !subasta.tamano || !subasta.categoriaId || !subasta.descripcion || !subasta.imagen) {
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
                await AuthToken.put(`${process.env.REACT_APP_API_BASE_URL}subasta/update/${pkCodSubasta}`, formData, {
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
                                                    onChange={handlePesoChange}
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
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Previsualización" className="img-fluid preview-image" />
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
