import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

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

    return (
        <>
            <div>Despachos</div>

            <Link to="/CreateDespacho" className='btn btn-primary'>Hacer despacho</Link>
            <Link to="/Home" className='btn btn-danger'>Volver</Link>

            <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Estado</th>
                            <th scope="col">Fecha Entrega</th>
                            <th scope="col">Fecha_venta</th>
                            <th scope="col">Acciones</th>
                            {/* Aquí puedes agregar más encabezados si es necesario */}
                        </tr>
                    </thead>
                    <tbody>
                        {listDespacho.map((despacho, index) => (
                            <tr key={index}>
                                <td>{despacho.estado}</td>
                                <td>{despacho.fechaEntrega}</td>
                                <td>{despacho.fecha_Venta}</td>
                                {/* Aquí puedes agregar más columnas si es necesario */}
                                <td>
                                    <Link to={`/EditDespacho/${despacho.pkCod_Despacho}`} className="btn btn-outline-primary mx-2">Edit</Link>
                                    <button onClick={() => deleteDespacho(despacho.pkCod_Despacho)} className="btn btn-danger mx-2">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListDespacho;