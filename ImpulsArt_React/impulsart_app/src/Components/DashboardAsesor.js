import React from 'react';
import { Tag } from 'primereact/tag';
import Navbar_init from "./Navbar_init";

export default function DashboardAsesor() {
    const tasks = [
        { estado: 'Activa', fecha: 'Otto', prioridad: 2 },
        { estado: 'Activa', fecha: 'Thornton', prioridad: 5 },
        { estado: 'Activa', fecha: 'Thornton', prioridad: 9 }
    ];

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

    return (
        <div>
            <Navbar_init />
            <h1>PQRS</h1>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Estado</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col">Prioridad</th>
                        <th scope="col">Responder</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index}>
                            <td>{task.estado}</td>
                            <td>{task.fecha}</td>
                            <td></td>
                            <td></td>
                            <td>
                                <Tag value={`${task.prioridad} Días`} severity={getSeverity(task.prioridad)} />
                            </td>
                            <td>
                            <button
                                    className="btn btn-sm"
                                >
                                    <i className="bi bi-reply"></i> {/* Ícono de respuesta */}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h1>Reportes</h1>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID obra</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Motivo</th>
                        <th scope="col">Comentarios</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index}>
                            <td>{task.estado}</td>
                            <td>{task.fecha}</td>
                            <td></td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
