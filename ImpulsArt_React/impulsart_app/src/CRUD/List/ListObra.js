import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import 'jspdf-autotable';
import jsPDF from 'jspdf';  // Importar jsPDF
import Logo from '../../Resources/Logo.png';
import Paleta from '../../Resources/Spot.svg';
import Navbar_init from '../../Components/Navbar_init';

export const ListObra = () => {

    const [listObra, setListObra] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');

    useEffect(() => {
        // Verificar si se está buscando por categoría o por nombre de producto
        if (categoria && !nombreProducto) {
            getObraByCategoria();
        } else if (nombreProducto && !categoria) {
            getObraByNombreProducto();
        } else if (categoria && nombreProducto) {
            getObraByCategoriaAndNombreProducto();
        } else {
            getObra();
        }
    }, [categoria, nombreProducto]);

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

    //DELETE USERS
    const deleteObra = async (pkCod_Producto) => {
        await axios.delete(`http://localhost:8086/api/obra/delete/${pkCod_Producto}`)
        getObra()
    }
    //DELETE USERS

        //Generar PDF
        const generatePDF = () => {
            const doc = new jsPDF();
        
            // Obtener la fecha actual en formato DD-MM-YYYY
            const currentDate = new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        
            const logoImg = new Image();
            logoImg.src = Logo;
            logoImg.onload = () => {
                // Agregar logo a la izquierda
                doc.addImage(logoImg, 'PNG', 10, 10, 50, 20);
        
                // Agregar fecha del reporte a la derecha
                const pageSize = doc.internal.pageSize;
                const pageWidth = pageSize.width;
                doc.text(`Fecha del Reporte: ${currentDate}`, pageWidth - 80, 20);
        
                    // Agregar título "Lista de Obras"
            doc.setFontSize(16);
            const titleY = 50; // Posición Y del título
            doc.text("Lista de Obras", 50, titleY);
        
                // Convertir color hexadecimal a RGB
                const hexToRgb = (hex) => {
                    const bigint = parseInt(hex.slice(1), 16);
                    const r = (bigint >> 16) & 255;
                    const g = (bigint >> 8) & 255;
                    const b = bigint & 255;
                    return [r, g, b];
                };
        
                const fillColorHex = '#8D33FF';  // Color hexadecimal que deseas usar
                const fillColorRgb = hexToRgb(fillColorHex);
        
                // Definir estilos para las celdas
                const styles = {
                    headStyles: {
                        fillColor: fillColorRgb,  // Color de fondo morado para el encabezado (RGB)
                        textColor: 255,           // Color del texto del encabezado (blanco)
                        fontStyle: 'bold'         // Estilo de fuente del encabezado
                    },
                    styles: {
                        textColor: [0, 0, 0]      // Color del texto de las celdas de datos (negro)
                    }
                };
        
                doc.autoTable({
                    startY: 60,  // Ajustar el startY para dejar espacio para el título
                    head: [['Nombre', 'Categoría', 'Cantidad']],
                    body: listObra.map(obra => [obra.nombreProducto, obra.categoria, obra.cantidad]),
                    theme: 'grid',               // Tema de la tabla
                    ...styles                    // Aplicar estilos definidos
                });
        
                doc.save("reporte_servicio_al_cliente.pdf");
            };
        };

    return (
        <>

<Navbar_init />

               <div className="d-flex align-items-center mb-3 justify-content-center">
               <img src={Paleta} alt="Logo" style={{ maxWidth: '50px' }} />
                <h2 style={{ color: '#8D33FF', marginRight: '10px' }}>Obras</h2>
                </div>

                <br></br>

        {/*FORMULARIO PARA BUSCAR POR FILTRO*/}
        <div className="row justify-content-center">
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
<div  style={{ paddingLeft: '10px'}}></div>

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

         <br></br>
         <br></br>

            <div className="container">

<Link to="/CreateObra" className='btn btn-primary'>Crear obra</Link>
<Link to="/Home" className='btn btn-danger'>Volver</Link>

<br></br>
<br></br>

                <table className="table">
                    <thead className="table-head">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Acciones</th>
                            {/* Aquí puedes agregar más encabezados si es necesario */}
                        </tr>
                    </thead>
                    <tbody>
    {listObra.map((obra, index) => {
        return (
            <tr key={index}>
                <td>{obra.nombreProducto}</td>
                <td>{obra.categoria}</td>
                <td>{obra.cantidad}</td>
                <td><img src={obra.imagen} alt="" style={{ maxWidth: '100px' }} /></td>
                {/* Aquí puedes agregar más columnas si es necesario */}
                <td>
                    <Link to={`/EditObra/${obra.pkCod_Producto}`} className="btn btn-outline-primary mx-2">Edit</Link>
                    <button onClick={() => deleteObra(obra.pkCod_Producto)} className="btn btn-danger mx-2">Delete</button>
                </td>
            </tr>
        );
    })}
</tbody>
                </table>
<button onClick={generatePDF} className='btn btn-success'>Generar PDF</button>
            </div>
        </>
    );
};

export default ListObra;