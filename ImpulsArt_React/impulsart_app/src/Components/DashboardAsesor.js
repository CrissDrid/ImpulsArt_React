import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router-dom';
import Navbar_init from "./Navbar_init";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';

const MySwal = withReactContent(Swal);

export default function DashboardAsesor() {
    const [showPqrs, setShowPqrs] = useState(true);
    const [pqrs, setPqrs] = useState([]);
    const [reportes, setReportes] = useState([]);
    const [identificacion, setIdentificacion] = useState(null);
    const [respuesta, setRespuesta] = useState({});

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await GetUserInfo();
                setIdentificacion(userInfo.identificacion);
            } catch (error) {
                console.error('Error al obtener la información del usuario:', error);
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (identificacion) {
            setRespuesta(prev => ({
                ...prev,
                fk_Identificacion: identificacion
            }));
        }
    }, [identificacion]);

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
            console.warn('Error en la solicitud de PQRS:', e);
        }
    };

    const getRespuesta = async () => {
        try {
            const response = await AuthToken.get("reporteObra/all");
            setReportes(response.data.data);
        } catch (e) {
            console.warn('Error en la solicitud de Reportes:', e);
        }
    };

    const onSubmit = async () => {
        console.log('Enviando respuesta:', respuesta); // Verifica el estado aquí
        try {
            await AuthToken.post("respuesta/create", respuesta);
            MySwal.fire('Éxito', 'Respuesta enviada con éxito', 'success');
            getPqrs(); // Actualiza la lista de PQRS después de enviar la respuesta
        } catch (error) {
            console.error(error);
            MySwal.fire('Error', 'Hubo un problema al enviar la respuesta', 'error');
        }
    };

    const handleResponder = async (pkCod_Pqrs) => {
        try {
            const result = await MySwal.fire({
                title: 'Escribe tu respuesta',
                input: 'textarea',
                inputPlaceholder: 'Escribe aquí tu respuesta...',
                showCancelButton: true,
                confirmButtonText: 'Enviar',
                cancelButtonText: 'Cancelar',
                inputValidator: (value) => {
                    if (!value) {
                        return 'La respuesta no puede estar vacía';
                    }
                }
            });

            if (result.isConfirmed) {
                const comentario = result.value;
                setRespuesta(prev => ({
                    ...prev,
                    comentario,
                    fk_Pqrs: pkCod_Pqrs // Establece el ID de PQRS aquí
                }));
                onSubmit(); // Envía la respuesta
            }
        } catch (error) {
            console.error('Error al enviar la respuesta:', error);
            MySwal.fire('Error', 'Hubo un problema al enviar la respuesta', 'error');
        }
    };

    const calculateDaysDifference = (dateString) => {
        const fechaPQR = new Date(dateString);
        const today = new Date();
        const differenceInMs = today - fechaPQR;
        const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
        return differenceInDays;
    };

    const getSeverity = (dias) => {
        if (dias <= 3) {
            return 'success';
        } else if (dias >= 4 && dias <= 6) {
            return 'warning';
        } else if (dias >= 7 && dias <= 9) {
            return 'danger';
        } else {
            return null;
        }
    };

    return (
        <div>
            <Navbar_init />
            <div className="btn-group mb-3" role="group" aria-label="Button group">
                <Button
                    label="Ver PQRS"
                    icon="pi pi-eye"
                    className={`p-button ${showPqrs ? 'p-button-primary' : 'p-button-outlined'}`}
                    onClick={() => setShowPqrs(true)}
                />
                <Button
                    label="Ver Reportes"
                    icon="pi pi-file"
                    className={`p-button ${!showPqrs ? 'p-button-primary' : 'p-button-outlined'}`}
                    onClick={() => setShowPqrs(false)}
                />
            </div>

            {showPqrs ? (
                <>
                    <h1>PQRS</h1>
                    <DataTable value={pqrs} stripedRows tableStyle={{ minWidth: '50rem' }}>
                        <Column field="fechaPQRS" header="Fecha"></Column>
                        <Column field="descripcion" header="Descripción"></Column>
                        <Column field="usuario.nombre" header="Nombre"></Column>
                        <Column field="usuario.apellido" header="Apellido"></Column>
                        <Column field="usuario.email" header="Email"></Column>
                        <Column field="usuario.userName" header="Nombre de usuario"></Column>
                        <Column
                            header="Prioridad"
                            body={(rowData) => {
                                const dias = calculateDaysDifference(rowData.fechaPQRS);
                                return <Tag value={`${dias} Días`} severity={getSeverity(dias)} />;
                            }}
                        ></Column>
                        <Column
    body={(rowData) => (
        <button
            onClick={() => handleResponder(rowData.pkCod_Pqrs)} // Pasar el ID correcto aquí
            style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '0',
                fontSize: '1.5em'
            }}
        >
            <i className="bi bi-reply"></i>
        </button>
    )}
    header="Responder"
/>
                    </DataTable>
                </>
            ) : (
                <>
                    <h1>Reportes</h1>
                    <DataTable value={reportes} stripedRows tableStyle={{ minWidth: '50rem' }}>
                        <Column field="fechaReporte" header="Fecha del reporte"></Column>
                        <Column field="comentario" header="Comentario"></Column>
                        <Column field="tipoReporte.nombre" header="Tipo de reporte"></Column>
                        <Column field="obra.nombreProducto" header="Nombre de la obra"></Column>
                        <Column field="obra.categoria.nombreCategoria" header="Categoría"></Column>
                        <Column
                            body={(rowData) => (
                                <Link to={`/DetalleObras/${rowData.obra.pkCod_Producto}`} className="btn btn-sm">
                                    <button className='btn btn-primary'>Ver detalle de la obra</button>
                                </Link>
                            )}
                            header="Acciones"
                        ></Column>

                    </DataTable>
                </>
            )}
        </div>
    );
}