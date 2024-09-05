import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router-dom';
import Navbar_init from "./Navbar_init";

// Autenticacion de apis
import AuthToken from '../Auth/AuthToken';
// Asegúrate Obtener datos del usuario
import GetUserInfo from '../Auth/GetUserInfo';

export default function DashboardAsesor() {
    const [showPqrs, setShowPqrs] = useState(true); // Estado para controlar qué tabla mostrar
    const [pqrs, setPqrs] = useState([]); // Estado para datos PQRS
    const [reportes, setReportes] = useState([]); // Estado para datos Reportes
    const [identificacion, setIdentificacion] = useState(null); // Usa null para valores no inicializados

    const calculateDaysDifference = (dateString) => {
        // Convierte la fecha de cadena a objeto Date
        const fechaPQR = new Date(dateString);
        const today = new Date();

        // Calcula la diferencia en milisegundos
        const differenceInMs = today - fechaPQR;

        // Convierte la diferencia a días
        const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

        return differenceInDays;
    };

    // Ejemplo de uso en tu componente
    const getSeverity = (dias) => {
        if (dias <= 3) {
            return 'success'; // Verde
        } else if (dias >= 4 && dias <= 6) {
            return 'warning'; // Amarillo
        } else if (dias >= 7 && dias <= 9) {
            return 'danger'; // Rojo
        } else {
            return null;
        }
    };

    // Obtener la identificación del usuario una vez al montar el componente
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const { identificacion } = await GetUserInfo();
                setIdentificacion(identificacion);
            } catch (error) {
                console.error('Error al obtener la información del usuario:', error);
            }
        };

        fetchUserInfo();
    }, []);

    // Cargar PQRS o reportes dependiendo de showPqrs
    useEffect(() => {
        if (identificacion) {
            if (showPqrs) {
                getPqrs();
            } else {
                getRespuesta();
            }
        }
    }, [showPqrs, identificacion]);

    const getPqrs = async () => {
        try {
            const response = await AuthToken.get(`pqrs/PqrsAsignados/${identificacion}`);
            setPqrs(response.data.data);
        } catch (e) {
            // Simplifica el manejo de errores, sin registrar en consola
            if (e.response) {
                console.warn('Error en la solicitud de PQRS:', e.response.status);
            } else if (e.request) {
                console.warn('No se recibió respuesta en PQRS:', e.request);
            } else {
                console.warn('Error de configuración en PQRS:', e.message);
            }
        }
    }

    const getRespuesta = async () => {
        try {
            const response = await AuthToken.get("reporteObra/all");
            setReportes(response.data.data);
        } catch (e) {
            // Simplifica el manejo de errores, sin registrar en consola
            if (e.response) {
                console.warn('Error en la solicitud de PQRS:', e.response.status);
            } else if (e.request) {
                console.warn('No se recibió respuesta en PQRS:', e.request);
            } else {
                console.warn('Error de configuración en PQRS:', e.message);
            }
        }
    };

    return (
        <div>
            <Navbar_init />
            <div className="btn-group mb-3" role="group" aria-label="Button group">
                <button
                    className="btn btn-primary"
                    onClick={() => setShowPqrs(true)}
                >
                    Ver PQRS
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => setShowPqrs(false)}
                >
                    Ver Reportes
                </button>
            </div>

            {showPqrs ? (
                <>
                    <h1>PQRS</h1>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Fecha</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Apellido</th>
                                <th scope="col">Email</th>
                                <th scope="col">Nombre de usuario</th>
                                <th scope="col">Prioridad</th>
                                <th scope="col">Responder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pqrs.map((pqrs, index) => {
                                const dias = calculateDaysDifference(pqrs.fechaPQRS); // Calcula los días para cada PQRS
                                return (
                                    <tr key={index}>
                                        <td>{pqrs.fechaPQRS}</td>
                                        <td>{pqrs.descripcion}</td>
                                        <td>{pqrs.usuario.nombre}</td>
                                        <td>{pqrs.usuario.apellido}</td>
                                        <td>{pqrs.usuario.email}</td>
                                        <td>{pqrs.usuario.userName}</td>
                                        <td>
                                            <Tag value={`${dias} Días`} severity={getSeverity(dias)} />
                                        </td>
                                        <td>
                                            <Link to="/Responder" className="btn btn-sm">
                                                <i className="bi bi-reply"></i> {/* Ícono de respuesta */}
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <h1>Reportes</h1>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Fecha del reporte</th>
                                <th scope="col">Comentario</th>
                                <th scope="col">Tipo de reporte</th>
                                <th scope="col">Nombre de la obra</th>
                                <th scope="col">Categoria</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportes.map((reporte, index) => (
                                <tr key={index}>
                                    <td>{reporte.fechaReporte}</td>
                                    <td>{reporte.comentario}</td>
                                    <td>{reporte.tipoReporte.nombre}</td>
                                    <td>{reporte.obra.nombreProducto}</td>
                                    <td>{reporte.obra.categoria.nombreCategoria}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}