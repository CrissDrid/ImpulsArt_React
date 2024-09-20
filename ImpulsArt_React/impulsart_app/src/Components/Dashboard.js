import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar_init from "./Navbar_init";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';
import { Link } from 'react-router-dom';

const MySwal = withReactContent(Swal);

export default function Dashboard() {
    const [activeTable, setActiveTable] = useState('subastas');
    const [subastas, setSubastas] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [despachos, setDespachos] = useState([]);
    const [pqrs, setPqrs] = useState([]);
    const [reportes, setReportes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [identificacion, setIdentificacion] = useState(null);
    const [rol, setRol] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null); // Agregado
    const [estadisticas, setEstadisticas] = useState({
        ventas: 0,
        subastas: 0,
        despachos: 0,
        pqrs: 0,
        usuarios: 0,
        reportes: 0
    });

    useEffect(() => {
        AuthToken.get('estadisticas/obtener')
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

        const fetchRoles = async () => {
            try {
                const response = await AuthToken.get('rol/all');
                console.log('Roles:', response.data); // Verifica que los roles están siendo recibidos
                setRol(response.data);
                return response;  // Asegúrate de devolver la respuesta
            } catch (error) {
                console.error('Error al obtener roles:', error);
                throw error;  // Lanza el error si ocurre
            }
        };
    
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
                    response = await AuthToken.get(`obra/obrasEnSubasta`);
                    const products = response.data.data;
                    // Flatten subastas array from each product
                    const allSubastas = products.flatMap(product => product.subastas);
                    setSubastas(allSubastas);
                    break;
                case 'pqrs':
                    response = await AuthToken.get(`pqrs/all`);
                    setPqrs(response.data.data);
                    break;
                case 'usuarios':
                    response = await AuthToken.get(`usuario/all`);
                    setUsuarios(response.data.data);
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

    const getEditUserHtml = (currentRole, rol) => {
        if (!Array.isArray(rol) || rol.length === 0) {
            return `<div>No se pudieron cargar los roles.</div>`;
        }
        return `
            <div class="form-floating">
                <select
                    class="form-control"
                    id="floatingRolId"
                    name="rolId"
                    value="${currentRole || ''}"
                >
                    <option value="">Seleccione un rol</option>
                    ${rol.map(r => `
                    <option value="${r.pkCod_Rol}" ${r.pkCod_Rol == currentRole ? 'selected' : ''}>
                        ${r.nombre}
                    </option>
                    `).join('')}
                </select>
                <label for="floatingRolId">Rol</label>
            </div>
        `;
    };
    
    const openEditModal = async (usuarios) => {
        try {
            const response = await fetchRoles();  // Asegúrate de que fetchRoles esté funcionando correctamente
            const roles = response.data.data;  // Verifica que response.data tenga el formato correcto
    
            console.log('Roles obtenidos:', roles);  // Imprime los roles para depurar
    
            if (!roles || roles.length === 0) {
                throw new Error('No se encontraron roles');
            }
    
            MySwal.fire({
                title: 'Editar Usuario',
                html: getEditUserHtml(usuarios.rol ? usuarios.rol.pkCod_Rol : null, roles),  // Aquí pasa los roles al HTML
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                preConfirm: () => {
                    const selectedRole = document.getElementById('floatingRolId').value;
                    if (!selectedRole) {
                        Swal.showValidationMessage('Por favor, selecciona un rol');
                        return false;
                    }
                    return {
                        rol: { pkCod_Rol: selectedRole }
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const updatedUsuario = {
                        ...usuarios,
                        rol: result.value.rol,
                    };
                    updateUser(updatedUsuario);
                }
            });
        } catch (error) {
            console.error('Error al obtener los roles:', error);
            Swal.fire('Error', 'No se pudieron cargar los roles.', 'error');
        }
    };
    
    const updateUser = async (usuarios) => {
        try {
            const response = await AuthToken.put(`usuario/updateRol/${usuarios.identificacion}`, {
                rolId: usuarios.rol.pkCod_Rol
            });
            Swal.fire('Usuario actualizado', '', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
            console.error('Error en la actualización:', error);
        }
    };

    const renderTable = () => {
        switch (activeTable) {
            case 'subastas':
                return (
                    <>
                    <h1>Subastas</h1>
                    <DataTable value={subastas} stripedRows tableStyle={{ minWidth: '50rem' }}>
                        <Column field="estadoSubasta" header="Estado" />
                        <Column field="fechaFinalizacion" header="Fecha Finalización" />
                        <Column field="fechaInicio" header="Fecha de Inicio" />
                        <Column field="precioInicial" header="Precio Inicial"/>
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
                        <Column field="fechaPQRS" header="Fecha PQRS" />
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
                        <Column field="numCelular" header="Numero" />
                        <Column field="rol.nombre" header="Tipo de usuario" />
                        <Column
                            header="Acciones"
                            body={(rowData) => (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => openEditModal(rowData)}
                                >
                                    Editar
                                </button>
                            )}
                        />
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
                            <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1.6em' }}>{estadisticas.subastas}</h6>
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
                            <i className="bi bi-flag card-icon"></i> {/* Icono para PQRS */}
                            <h5 className="card-title">PQRS</h5>
                            <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1.6em' }}>{estadisticas.pqrs}</h6>
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
                            <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1.6em' }}>{estadisticas.usuarios}</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-container">
                {renderTable()}
            </div>
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