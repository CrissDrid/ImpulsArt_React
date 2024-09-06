import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import 'jspdf-autotable';
import jsPDF from 'jspdf';  // Importar jsPDF
import Logo from '../../Resources/Logo.png';
import Paleta from '../../Resources/Spot.svg';
import Navbar_init from '../../Components/Navbar_init';

export const ListDespacho = () => {
 
    const [listDespacho, setListDespacho] = useState([]);

    useEffect(() => {
        getDespacho();
    }, []);


      //GET ALL USERS
      const getDespacho = () => {
        axios.get("http://localhost:8086/api/despacho/all")
            .then((response) => {
                setListDespacho(response.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    //GET ALL USERS

    //DELETE USERS
    const deleteDespacho = async (pkCod_Despacho) => {
        await axios.delete(`http://localhost:8086/api/despacho/delete/${pkCod_Despacho}`)
        getDespacho();
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
                head: [['Estado', 'Fecha de entrega']],
                body: listDespacho.map(despacho => [despacho.estado, despacho.fechaEntrega]),
                theme: 'grid',               // Tema de la tabla
                ...styles                    // Aplicar estilos definidos
            });
    
            doc.save("reporte_despacho.pdf");
        };
    };

    return (
        <>

        <Navbar_init />

            <div className="d-flex align-items-center mb-3 justify-content-center">
               <img src={Paleta} alt="Logo" style={{ maxWidth: '50px' }} />
                <h2 style={{ color: '#8D33FF', marginRight: '10px' }}>Despacho</h2>
                </div>

                <br></br>

            <div className="container">

            <Link to="/CreateDespacho" className='btn btn-primary'>Hacer despacho</Link>
            <Link to="/Home" className='btn btn-danger'>Volver</Link>

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Estado</th>
                          <th scope="col">Fecha Entrega</th>
                            <th scope="col">Acciones</th>
                            {/* Aquí puedes agregar más encabezados si es necesario */}
                        </tr>
                    </thead>
                    <tbody>
                        {listDespacho.map((despacho, index) => (
                            <tr key={index}>
                                <td>{despacho.estado}</td>
                                <td>{despacho.fechaEntrega}</td>
                                {/* Aquí puedes agregar más columnas si es necesario */}
                                <td>
                                    <Link to={`/EditDespacho/${despacho.pkCod_Despacho}`} className="btn btn-outline-primary mx-2">Edit</Link>
                                    <button onClick={() => deleteDespacho(despacho.pkCod_Despacho)} className="btn btn-danger mx-2">Delete</button>
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

export default ListDespacho;