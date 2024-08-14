import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from '../../Resources/Logo.svg';
import Art from '../../Resources/Img-Art3.avif';
import Navbar_init from '../../Components/Navbar_init';
import Footer from '../../Components/Footer';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import Swal from 'sweetalert2';

export const EditObra = () => {
    let navigate = useNavigate();
    const toast = useRef(null);
    const { pkCod_Producto } = useParams();

    const [obra, setObra] = useState({
        nombreProducto: "",
        costo: "",
        peso: "",
        tamano: "",
        alto: "",
        ancho: "",
        cantidad: "",
        categoriaId: "",
        descripcion: "",
        imagen: null
    });

    const [initialObra, setInitialObra] = useState({});
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [formChanged, setFormChanged] = useState(false);

    useEffect(() => {
        const loadObra = async () => {
            try {
                const result = await axios.get(`http://localhost:8086/api/obra/list/${pkCod_Producto}`);
                const data = result.data.data;
                const loadedObra = {
                    ...data,
                    tamano: data.alto && data.ancho ? `${data.alto} x ${data.ancho}` : "",
                    categoriaId: data.categoria ? data.categoria.pkCod_Categoria.toString() : "",
                    imagen: data.imagen // Mantener la URL de la imagen existente
                };
                setObra(loadedObra);
                setInitialObra(loadedObra); // Guardar los valores iniciales
                if (data.imagen) {
                  setImagePreview(`http://localhost:8086/api/obra/image/${data.imagen}`);
              }
            } catch (error) {
                console.error('Error al cargar la obra:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la obra.' });
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

        Promise.all([loadObra(), loadCategorias()])
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [pkCod_Producto]);

    useEffect(() => {
        setFormChanged(JSON.stringify(obra) !== JSON.stringify(initialObra));
    }, [obra]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'alto' || name === 'ancho') {
            const rawValue = value.replace(/[^\d]/g, '');
            const updatedValue = rawValue ? `${rawValue}cm` : ''; // Solo agrega "cm" si hay un número
            setObra(prevObra => {
                const updatedObra = { ...prevObra, [name]: updatedValue };
                if (updatedObra.alto && updatedObra.ancho) {
                    updatedObra.tamano = `${updatedObra.alto} x ${updatedObra.ancho}`;
                } else {
                    updatedObra.tamano = updatedObra.alto || updatedObra.ancho ? `${updatedObra.alto} x ${updatedObra.ancho}` : '';
                }
                return updatedObra;
            });
        } else {
            setObra(prevObra => ({ ...prevObra, [name]: value }));
        }
    };

    const handleCostoChange = (e) => {
        const rawValue = e.target.value.replace(/[^\d]/g, '');
        setObra({ ...obra, costo: `$${new Intl.NumberFormat('es-CO').format(rawValue)}` });
    };

    const handlePesoChange = (e) => {
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value !== "") {
            value += "Kg";
        }
        setObra({ ...obra, peso: value });
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setObra({ ...obra, descripcion: value });
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setObra({ ...obra, imagen: file });
          const reader = new FileReader();
          reader.onloadend = () => {
              setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
      }
  };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!obra.nombreProducto || !obra.costo || !obra.peso || !obra.tamano || !obra.cantidad || !obra.categoriaId || !obra.descripcion || !obra.imagen) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos deben estar completos' });
            return;
        }

        if (obra.nombreProducto.length > 50) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El nombre de la obra debe contener un máximo de 50 caracteres' });
            return;
        }

        if (obra.costo === "$0") {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El costo no puede ser 0' });
            return;
        }

        if (obra.peso === "0Kg") {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El peso no puede ser 0Kg' });
            return;
        }

        if (obra.alto === "0cm" || obra.ancho === "0cm") {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El tamaño no puede ser 0cm' });
            return;
        }

        if (obra.cantidad === "0") {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La cantidad no puede ser 0' });
            return;
        }

        // Mostrar SweetAlert de confirmación
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Los cambios se guardarán y no podrás revertir esto.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#8D33FF",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, actualizar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formData = new FormData();
                    for (const key in obra) {
                        if (key === 'imagen' && typeof obra[key] === 'string') {
                            continue;
                        }
                        formData.append(key, obra[key]);
                    }

                    await axios.put(`http://localhost:8086/api/obra/update/${pkCod_Producto}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    Swal.fire({
                        title: "¡Éxito!",
                        text: "La obra se actualizó correctamente.",
                        icon: "success",
                        confirmButtonColor: "#8D33FF",
                        confirmButtonText: "Aceptar"
                    }).then(() => {
                        navigate(-1);
                    });
                } catch (error) {
                    console.error('Error al actualizar la obra:', error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al actualizar la obra.",
                        icon: "error",
                        confirmButtonColor: "#8D33FF",
                        confirmButtonText: "Aceptar"
                    });
                }
            }
        });
    };

    const handleCancel = () => {
        if (formChanged) {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "Los cambios que realizaste no se guardarán.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#8D33FF",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, cancelar",
                cancelButtonText: "No, volver"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(-1);
                }
            });
        } else {
            navigate(-1);
        }
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
                                <div className="form-floating">
                                    <input className="form-control" id="floatingNombreProducto" placeholder="Nombre de la obra" name="nombreProducto" value={obra.nombreProducto} onChange={handleInputChange} type="text" />
                                    <label htmlFor="floatingNombreProducto">Nombre de la obra</label>
                                </div>
                                <div className="form-row">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input className="form-control" id="floatingCosto" placeholder="Costo" name="costo" value={obra.costo} onChange={handleCostoChange} type="text" />
                                                <label htmlFor="floatingCosto">Costo</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input className="form-control" id="floatingPeso" placeholder="Peso" name="peso" value={obra.peso} onChange={handlePesoChange} type="text" />
                                                <label htmlFor="floatingPeso">Peso</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="group-tamano">
                                                <label htmlFor="tamano">Tamaño</label>
                                                <div className="row tamano-group">
                                                    <div className="col-md-5">
                                                        <div className="form-floating">
                                                            <input className="form-control form-tamano" id="floatingAlto" placeholder="Alto" name="alto" value={obra.alto} onChange={handleInputChange} type="text" />
                                                            <label htmlFor="floatingAlto">Alto</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-1 text-center">
                                                        <span className="tamano-separator">×</span>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div className="form-floating">
                                                            <input className="form-control form-tamano" id="floatingAncho" placeholder="Ancho" name="ancho" value={obra.ancho} onChange={handleInputChange} type="text" />
                                                            <label htmlFor="floatingAncho">Ancho</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating form-cantidad">
                                                <input className="form-control" id="floatingCantidad" placeholder="Cantidad" name="cantidad" value={obra.cantidad} onChange={(e) => {const value = e.target.value; if (value === '' || (Number(value) >= 0)) {setObra(prevObra => ({ ...prevObra, cantidad: value })); }}} min="0" type="number" />
                                                <label htmlFor="floatingCantidad">Cantidad</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-floating">
                                    <select
                                        className="form-control"
                                        id="floatingCategoriaId"
                                        name="categoriaId"
                                        value={obra.categoriaId}
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
                                <div className={`form-floating ${obra.descripcion.length > 155 ? 'input-error' : ''}`}>
                                    <InputTextarea
                                        className="form-control"
                                        style={{ resize: 'none', width: '100%', height: '10rem' }}
                                        placeholder="Descripción"
                                        name="descripcion"
                                        value={obra.descripcion}
                                        onChange={handleDescriptionChange}
                                        maxLength="155"
                                    />
                                    <label htmlFor="floatingDescripcion">Descripción</label>
                                    <div className="character-counter d-flex justify-content-end">
                                        {obra.descripcion.length}/155
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="image-upload" onClick={() => document.getElementById('fileInput').click()}>
                                        {obra.imagen ? (
                                            <img src={obra.imagen} alt="Previsualización" className="img-fluid preview-image" />
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
                                <button
                                        className="btn btn-create btn-primary py-2 create-btn"
                                        type="submit"
                                        disabled={!formChanged} // Desactiva el botón si no hay cambios
                                    >
                                        Actualizar Obra
                                    </button>
                                    <button className="btn btn-cancel btn-secondary py-2 cancel-btn" type="button" onClick={handleCancel}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-6 image-wrapper">
                        <img className="createObra-img" src={Art} alt="Art" />
                    </div>
                </div>
            </div>
            <Footer />
            <Toast ref={toast} />
        </>
    );
};

export default EditObra;
