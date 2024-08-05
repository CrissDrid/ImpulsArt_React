import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'jspdf-autotable';
import jsPDF from 'jspdf';  // Importar jsPDF
import Logo from '../../Resources/Logo.png';
import Paleta from '../../Resources/Spot.svg';
import Navbar_init from '../../Components/Navbar_init';

export const ListPQRS = () => {
  
    const [listPQRS, setListPQRS] = useState([]);

    useEffect(() => {
        getPQRS();
    }, []);


      //GET ALL USERS
      const getPQRS = () => {
        axios.get("http://localhost:8086/api/reclamo/all")
            .then((response) => {
                setListPQRS(response.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    //GET ALL USERS

    //DELETE USERS
    const deletePQRS = async (pkCod_Reclamo) => {
        await axios.delete(`http://localhost:8086/api/reclamo/delete/${pkCod_Reclamo}`)
        getPQRS();
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
        doc.text("Reporte de Servicio al cliente", 50, titleY);
    
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
                head: [['Estado', 'Motivo', 'Fecha']],
                body: listPQRS.map(pqrs => [pqrs.estado, pqrs.motivo, pqrs.fechaPQRS]),
                theme: 'grid',               // Tema de la tabla
                ...styles                    // Aplicar estilos definidos
            });
    
            doc.save("reporte_obras.pdf");
        };
    };


    return (
        <>

<Navbar_init />
    
    <div className="d-flex align-items-center mb-3 justify-content-center">
               <img src={Paleta} alt="Logo" style={{ maxWidth: '50px' }} />
                <h2 style={{ color: '#8D33FF', marginRight: '10px' }}>Servicio al cliente</h2>
                </div>

                <br></br>

            <div className="container">

            <Link to="/CreatePQRS" className='btn btn-primary'>Hacer queja</Link>
            <Link to="/Home" className='btn btn-danger'>Volver</Link>

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Estado</th>
                            <th scope="col">Motivo</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Acciones</th>
                            {/* Aquí puedes agregar más encabezados si es necesario */}
                        </tr>
                    </thead>
                    <tbody>
                        {listPQRS.map((pqrs, index) => (
                            <tr key={index}>
                                <td>{pqrs.estado}</td>
                                <td>{pqrs.motivo}</td>
                                <td>{pqrs.fechaPQRS}</td>
                                {/* Aquí puedes agregar más columnas si es necesario */}
                                <td>
                                    <Link to={`/EditPQRS/${pqrs.pkCod_Reclamo}`} className="btn btn-outline-primary mx-2">Edit</Link>
                                    <button onClick={() => deletePQRS(pqrs.pkCod_Reclamo)} className="btn btn-danger mx-2">Delete</button>
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

export default ListPQRS;
