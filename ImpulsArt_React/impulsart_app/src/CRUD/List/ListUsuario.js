import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ListUsuario = () => {
    const [listUsuarios, setListUsuarios] = useState([]);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = () => {
        axios.get("http://localhost:8086/api/usuario/all")
            .then((response) => {
                setListUsuarios(response.data);
            })
            .catch((error) => {
                console.error('Error fetching usuarios:', error);
            });
    };

    const deleteUser = async (identificacion) => {
        try {
            await axios.delete(`http://localhost:8086/api/usuario/delete/${identificacion}`);
            fetchUsuarios(); // Refetch users after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <>
            <div className="container">
                <h2>Listado de Usuarios</h2>
                <Link to="/CreateUsuario" className='btn btn-primary'>Crear usuario</Link>

                <br/><br/>

                <table className="table">
                    <thead className="table-head">
                        <tr>
                            <th scope="col">Identificacion</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">UserName</th>
                            <th scope="col">Fecha de Nacimiento</th>
                            <th scope="col">Email</th>
                            <th scope="col">Número de Celular</th>
                            <th scope="col">Dirección</th>
                            <th scope="col">Contraseña</th>
                            <th scope="col">Tipo de Usuario</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUsuarios.map((usuario, index) => (
                            <tr key={index}>
                                <td>{usuario.identificacion}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                <td>{usuario.userName}</td>
                                <td>{usuario.fechaNacimiento}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.numCelular}</td>
                                <td>{usuario.direccion}</td>
                                <td>{usuario.contrasena}</td>
                                <td>{usuario.tipoUsuario}</td>
                                <td>
                                    <Link to={`/EditUsuario/${usuario.identificacion}`} className="btn btn-outline-primary mx-2">Editar</Link>
                                    <button onClick={() => deleteUser(usuario.identificacion)} className="btn btn-danger mx-2">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListUsuario;