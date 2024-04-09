import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ListPQRS = () => {
  
    const [listPQRS, setListPQRS] = useState([]);

    useEffect(() => {
        getPQRS();
    }, []);


      //GET ALL USERS
      const getPQRS = () => {
        axios.get("http://localhost:8086/api/pqrs/all")
            .then((response) => {
                setListPQRS(response.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    //GET ALL USERS

    //DELETE USERS
    const deletePQRS = async (pkCod_PQRS) => {
        await axios.delete(`http://localhost:8086/api/pqrs/delete/${pkCod_PQRS}`)
        getPQRS();
    }
    //DELETE USERS

    return (
        <>
            <Link to="/CreatePQRS" className='btn btn-primary'>Hacer PQRS</Link>
            <Link to="/Home" className='btn btn-danger'>Volver</Link>

            <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Estado</th>
                            <th scope="col">Motivo</th>
                            <th scope="col">Fecha PQRS</th>
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
                                    <Link to={`/EditPQRS/${pqrs.pkCod_PQRS}`} className="btn btn-outline-primary mx-2">Edit</Link>
                                    <button onClick={() => deletePQRS(pqrs.pkCod_PQRS)} className="btn btn-danger mx-2">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListPQRS;
