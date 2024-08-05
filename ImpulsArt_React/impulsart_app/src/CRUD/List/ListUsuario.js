import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import 'jspdf-autotable';
import jsPDF from 'jspdf';  // Importar jsPDF
import Logo from '../../Resources/Logo.png';
import Paleta from '../../Resources/Spot.svg';
import Navbar_init from '../../Components/Navbar_init';

export const ListUsuario = () => {
 
    const [listUsuario, setListUsuario] = useState([]);

    useEffect(() => {
        getUsuario();
    }, []);


      //GET ALL USERS
      const getUsuario = () => {
        axios.get("http://localhost:8086/api/usuario/all")
            .then((response) => {
                setListUsuario(response.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    //GET ALL USERS

    //DELETE USERS
    const deleteUsuario = async (identificacion) => {
        await axios.delete(`http://localhost:8086/api/usuario/delete/${identificacion}`)
        getUsuario();
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
                head: [['Identificacion', 'Nombre', 'Apellido', 'UserName', 'Email', 'Celular', 'Direccion']],
                body: listUsuario.map(usuario => [usuario.identificacion, usuario.nombre, usuario.apellido, usuario.userName, usuario.email, usuario.numCelular, usuario.direccion]),
                theme: 'grid',               // Tema de la tabla
                ...styles                    // Aplicar estilos definidos
            });
    
            doc.save("reporte_usuario.pdf");
        };
    };

    return (
        <>

        <Navbar_init />

            <div className="d-flex align-items-center mb-3 justify-content-center">
               <img src={Paleta} alt="Logo" style={{ maxWidth: '50px' }} />
                <h2 style={{ color: '#8D33FF', marginRight: '10px' }}>Usuario</h2>
                </div>

                <br></br>

            <div className="container">

            <Link to="/CreateUsuario" className='btn btn-primary'>Crear usuario</Link>
            <Link to="/Home" className='btn btn-danger'>Volver</Link>

                <table className="table">
                    <thead>
                        <tr>
                          <th scope="col">Identificacion</th>
                          <th scope="col">Nombre</th>
                          <th scope="col">Apellido</th>
                          <th scope="col">UserName</th>
                          <th scope="col">Email</th>
                          <th scope="col">Celular</th>
                          <th scope="col">Direccion</th>
                          <th scope="col">Acciones</th>
                            {/* Aquí puedes agregar más encabezados si es necesario */}
                        </tr>
                    </thead>
                    <tbody>
                        {listUsuario.map((usuario, index) => (
                            <tr key={index}>
                                <td>{usuario.identificacion}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                <td>{usuario.userName}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.numCelular}</td>
                                <td>{usuario.direccion}</td>
                                {/* Aquí puedes agregar más columnas si es necesario */}
                                <td>
                                    <Link to={`/EditUsuario/${usuario.identificacion}`} className="btn btn-outline-primary mx-2">Edit</Link>
                                    <button onClick={() => deleteUsuario(usuario.identificacion)} className="btn btn-danger mx-2">Delete</button>
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

export default ListUsuario;
