import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar_init from "./Navbar_init";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';

const MySwal = withReactContent(Swal);

export default function DashboardAsesor() {
    const [activeTable, setActiveTable] = useState('subastas');
    const [subastas, setSubastas] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [despachos, setDespachos] = useState([]);
    const [pqrs, setPqrs] = useState([]);
    const [reportes, setReportes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [identificacion, setIdentificacion] = useState(null);
    const [estadisticas, setEstadisticas] = useState({
        ventas: 0,
        subastas: 0,
        despachos: 0,
        pqrs: 0,
        usuarios: 0
    });

    useEffect(() => {
        axios.get('http://localhost:8086/api/estadisticas/obtener')
            .then(response => {
                setEstadisticas(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las estadísticas:", error);
            });
    }, []);

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
            getData();
        }
    }, [activeTable, identificacion]);

    const getData = async () => {
        try {
            let response;
            switch (activeTable) {
                case 'subastas':
                    response = await AuthToken.get(`subasta/subastaYobras`);
                    setSubastas(response.data.data);
                    break;
                case 'ventas':
                    response = await AuthToken.get(`venta/all`);
                    setVentas(response.data.data);
                    break;
                case 'despachos':
                    response = await AuthToken.get(`despacho/all`);
                    setDespachos(response.data.data);
                    break;
                case 'pqrs':
                    response = await AuthToken.get(`pqrs/all`);
                    setPqrs(response.data.data);
                    break;
                case 'usuarios':
                    response = await AuthToken.get(`usuario/all`);
                    setUsuarios(response.data.data);
                    break;
                case 'reportes':
                    response = await AuthToken.get(`reporteObra/all`);
                    setReportes(response.data.data);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.warn(`Error en la solicitud de ${activeTable}:`, error);
        }
    };

    const handleTableClick = (table) => {
        setActiveTable(table);
    };

    const renderTable = () => {
        switch (activeTable) {
            case 'subastas':
                return (
                    <>
                    <h1>Subastas</h1>
                    <DataTable value={subastas} stripedRows tableStyle={{ minWidth: '50rem' }}>
                        <Column field="estado_subasta" header="Estado" />
                        <Column field="fecha_finalizacion" header="Fecha Finalizacion" />
                        <Column field="fecha_inicio" header="Fecha de inicio" />
                        <Column field="precio_inicial" header="Precio Inicial" />
                    </DataTable>
                    </>
                );
            case 'ventas':
                return (
                    <>
                    <h1>Ventas</h1>
                    <DataTable value={ventas} stripedRows tableStyle={{ minWidth: '50rem' }}>
                        <Column field="cantidad" header="Cantidad" />
                        <Column field="fecha_venta" header="Fecha de la Venta" />
                        <Column field="total_pago" header="Total de la Venta" />
                    </DataTable>
                    </>
                );
            case 'despachos':
                return (
                    <>
                    <h1>Despachos</h1>
                    <DataTable value={despachos} stripedRows tableStyle={{ minWidth: '50rem' }}>
                        <Column field="fecha_entrega" header="Fecha de entrega" />
                        <Column field="fecha_venta" header="Fecha de Venta" />
                        <Column field="estado" header="Estado" />
                    </DataTable>
                    </>
                );
            case 'pqrs':
                return (
                    <>
                    <h1>PQRS</h1>
                    <DataTable value={pqrs} stripedRows tableStyle={{ minWidth: '50rem' }}>
                        <Column field="descripcion" header="Descripcion" />
                        <Column field="estado" header="Estado" />
                        <Column field="fechapqrs" header="Fecha PQRS" />
                    </DataTable>
                    </>
                );
            case 'usuarios':
                return (
                    <>
                    <h1>Usuarios</h1>
                    <DataTable value={usuarios} stripedRows tableStyle={{ minWidth: '50rem' }}>
                        <Column field="nombre" header="Nombre" />
                        <Column field="apellido" header="Apellido" />
                        <Column field="email" header="Email" />
                        <Column field="fechaNacimiento" header="Fecha de Nacimiento" />
                        <Column field="num_celular" header="Numero" />
                        <Column field="tipo_usuario" header="Tipo de usuario" />
                    </DataTable>
                    </>
                );
            case 'reportes':
                return (
                    <>
                    <h1>Reportes</h1>
                    <DataTable value={reportes} stripedRows tableStyle={{ minWidth: '50rem' }}>
                        <Column field="comentario" header="Comentario" />
                        <Column field="fecha_reporte" header="Fecha del Reporte" />
                    </DataTable>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <Navbar_init />
            <div className="row mb-3">
                <div className="col-12 col-md-4 mb-2">
                    <div
                        className={`card ${activeTable === 'subastas' ? 'p-button-primary' : 'p-button-outlined'} cursor-pointer`}
                        onClick={() => handleTableClick('subastas')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body">
                            <i className="bi bi-gem card-icon"></i> {/* Icono para Subastas */}
                            <h5 className="card-title">Subastas</h5>
                            <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1.6rem' }}>{estadisticas.subastas}</h6>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 mb-2">
                    <div
                        className={`card ${activeTable === 'ventas' ? 'p-button-primary' : 'p-button-outlined'} cursor-pointer`}
                        onClick={() => handleTableClick('ventas')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body">
                            <i className="bi bi-cash card-icon"></i> {/* Icono para Ventas */}
                            <h5 className="card-title">Ventas</h5>
                            <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1.6rem' }}>{estadisticas.ventas}</h6>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 mb-2">
                    <div
                        className={`card ${activeTable === 'despachos' ? 'p-button-primary' : 'p-button-outlined'} cursor-pointer`}
                        onClick={() => handleTableClick('despachos')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body">
                            <i className="bi bi-truck card-icon"></i> {/* Icono para Despachos */}
                            <h5 className="card-title">Despachos</h5>
                            <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1.6rem' }}>{estadisticas.despachos}</h6>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 mb-2">
                    <div
                        className={`card ${activeTable === 'pqrs' ? 'p-button-primary' : 'p-button-outlined'} cursor-pointer`}
                        onClick={() => handleTableClick('pqrs')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body">
                            <i className="bi bi-question-circle card-icon"></i> {/* Icono para PQRS */}
                            <h5 className="card-title">PQRS</h5>
                            <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1.6rem' }}>{estadisticas.pqrs}</h6>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 mb-2">
                    <div
                        className={`card ${activeTable === 'usuarios' ? 'p-button-primary' : 'p-button-outlined'} cursor-pointer`}
                        onClick={() => handleTableClick('usuarios')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body">
                            <i className="bi bi-person card-icon"></i> {/* Icono para Usuarios */}
                            <h5 className="card-title">Usuarios</h5>
                            <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1.6rem' }}>{estadisticas.usuarios}</h6>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 mb-2">
                    <div
                        className={`card ${activeTable === 'reportes' ? 'p-button-primary' : 'p-button-outlined'} cursor-pointer`}
                        onClick={() => handleTableClick('reportes')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body">
                            <i className="bi bi-file-earmark-text card-icon"></i> {/* Icono para Reportes */}
                            <h5 className="card-title">Reportes</h5>
                            <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1.6rem' }}>{estadisticas.reportes}</h6>
                        </div>
                    </div>
                </div>
            </div>
            {renderTable()}
            <style jsx>{`
                .card {
                    border-radius: 0.25rem;
                    transition: color 0.3s ease, background-color 0.3s ease;
                    cursor: pointer;
                }
                .card-body h5,.card:hover .card-body h6{
                    transition: color 0.3s ease;
                }
                .card:hover .card-body h5,.card:hover .card-body h6{
                    color: white;
                }
                .p-button-primary {
                    border-color: purple !important;
                    background-color: #8D33FF;
                    color: white !important;
                }
                .p-button-outlined {
                    border-color: gray !important;
                    background-color: transparent !important;
                    color: gray !important;
                }
                .p-button-outlined:hover {
                    color: white !important;
                    background-color: gray !important;
                }
                .card-icon {
                    font-size: 1.5rem; /* Tamaño del ícono */
                    margin-right: 0.5rem;
                    
                }
            `}</style>
        </div>
    );
}
