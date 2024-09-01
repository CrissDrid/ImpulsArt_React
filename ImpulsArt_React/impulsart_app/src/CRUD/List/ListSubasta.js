import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import 'jspdf-autotable';
import jsPDF from 'jspdf';  // Importar jsPDF
import Logo from '../../Resources/Logo.png';
import Paleta from '../../Resources/Spot.svg';
import Navbar_init from '../../Components/Navbar_init';

//Autenticacion de apis
import AuthToken from '../../Auth/AuthToken';

export const ListSubasta = () => {

    const [listSubasta, setListSubasta] = useState([]);
    const [estadoSubasta, setEstadoSubasta] = useState('');

    useEffect(() => {

        if(estadoSubasta){
            getSubastaPorEstado();
        } else {
            getSubasta();
        }

    }, [estadoSubasta]);


    //GET ALL SUBASTAS
    const getSubasta = () => {
        AuthToken.get("http://localhost:8086/api/subasta/subastaYobras")
            .then((response) => {
                setListSubasta(response.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    //GET ALL SUBASTAS

    //GET SUBASTA BY ESTADO
    const getSubastaPorEstado = () => {
        AuthToken.get(`http://localhost:8086/api/subasta/estado/${estadoSubasta}`)
            .then((response) => {
                setListSubasta(response.data.data); // Actualizar listSubasta en lugar de estadoSubasta
            })
            .catch((e) => {
                console.log(e);
            });
    };
    //GET SUBASTA BY ESTADO

    //DELETE SUBASTA
    const deleteSubasta = async (pkCodSubasta) => {
        await AuthToken.delete(`http://localhost:8086/api/subasta/delete/${pkCodSubasta}`)
        getSubasta()
    };
    //DELETE SUBASTA

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
            doc.text("Reporte de subastas", 50, titleY);
        
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
                    head: [['Estado', 'Oferta minima', 'Fecha Inicio', 'Fecha Finalizacion']],
                    body: listSubasta.map(subasta => [subasta.estadoSubasta, subasta.precioInicial, subasta.fechaInicio, subasta.fechaFinalizacion]),
                    theme: 'grid',               // Tema de la tabla
                    ...styles                    // Aplicar estilos definidos
                });
        
                doc.save("reporte_subasta.pdf");
            };
        };

        return (
            <>
                <Navbar_init />
    
                <div className="d-flex align-items-center mb-3 justify-content-center">
                    <img src={Paleta} alt="Logo" style={{ maxWidth: '50px' }} />
                    <h2 style={{ color: '#8D33FF', marginRight: '10px' }}>Subasta</h2>
                </div>
    
                <br></br>
    
                <div className="container">
                    <Link to="/CreateSubasta" className='btn btn-primary'>Crear subasta</Link>
                    <Link to="/Home" className='btn btn-danger'>Volver</Link>
    
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Estado</th>
                                <th scope="col">Oferta mínima</th>
                                <th scope="col">Fecha inicio</th>
                                <th scope="col">Fecha finalización</th>
                                <th scope="col">Nombre Producto</th>
                                <th scope="col">Peso</th>
                                <th scope="col">Tamaño</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Categoria</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listSubasta.map((subasta, index) => (
                                <tr key={index}>
                                    <td>{subasta.estadoSubasta}</td>
                                    <td>{subasta.precioInicial}</td>
                                    <td>{subasta.fechaInicio}</td>
                                    <td>{subasta.fechaFinalizacion}</td>
                                    <td>{subasta.obras.nombreProducto}</td>
                                    <td>{subasta.obras.peso}</td>
                                    <td>{subasta.obras.tamano}</td>
                                    <td>{subasta.obras.descripcion}</td>
                                    <td>{subasta.obras.categoria.nombreCategoria}</td>
                                    <td>
                                        <Link to={`/EditSubasta/${subasta.pkCodSubasta}`} className="btn btn-outline-primary mx-2">Edit</Link>
                                        <button onClick={() => deleteSubasta(subasta.pkCodSubasta)} className="btn btn-danger mx-2">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={generatePDF} className='btn btn-success'>Generar PDF</button>
                </div>
            </>
        );
    };
    

export default ListSubasta;