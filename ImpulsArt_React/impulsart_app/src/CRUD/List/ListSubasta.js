import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

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
        axios.get("http://localhost:8086/api/subasta/all")
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
        axios.get(`http://localhost:8086/api/subasta/estado/${estadoSubasta}`)
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
        await axios.delete(`http://localhost:8086/api/subasta/delete/${pkCodSubasta}`)
        getSubasta()
    };
    //DELETE SUBASTA

    return (
        <>
            <div>UsuarioAxios</div>

            <input
                type="text"
                value={estadoSubasta}
                onChange={(e) => setEstadoSubasta(e.target.value)}
                placeholder="Buscar por estado"
            />

            <Link to="/CreateSubasta" className='btn btn-primary'>Crear subasta</Link>

            <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Estado</th>
                            <th scope="col">Oferta mínima</th>
                            <th scope="col">Fecha inicio</th>
                            <th scope="col">Fecha finalización</th>
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
                                <td>
                                    <Link to={`/EditSubasta/${subasta.pkCodSubasta}`} className="btn btn-outline-primary mx-2">Editar</Link>
                                    <button onClick={() => deleteSubasta(subasta.pkCodSubasta)} className="btn btn-danger mx-2">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListSubasta;