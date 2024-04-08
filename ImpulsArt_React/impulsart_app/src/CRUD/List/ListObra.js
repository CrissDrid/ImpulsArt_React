import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export const ListObra = () => {

    const [listObra, setListObra] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');

    useEffect(() => {
        // Verificar si se está buscando por categoría o por nombre de producto
        if (categoria && !nombreProducto) {
            getObraByCategoria();
        } else if (nombreProducto && !categoria) {
            getObraByNombreProducto();
        } else if (categoria && nombreProducto) {
            getObraByCategoriaAndNombreProducto();
        } else {
            getObra();
        }
    }, [categoria, nombreProducto]);

    const normalizeData = (data) => {
        if (Array.isArray(data)) {
            return data;
        } else if (data && data.data && Array.isArray(data.data)) {
            return data.data;
        } else {
            return [];
        }
    };

    const getObra = () => {
        axios.get("http://localhost:8086/api/obra/all")
            .then((response) => {
                setListObra(normalizeData(response.data));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const getObraByCategoria = () => {
        axios.get(`http://localhost:8086/api/obra/categoria/${categoria}`)
            .then((response) => {
                setListObra(normalizeData(response.data));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const getObraByNombreProducto = () => {
        axios.get(`http://localhost:8086/api/obra/nombreProducto/${nombreProducto}`)
            .then((response) => {
                setListObra(normalizeData(response.data));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const getObraByCategoriaAndNombreProducto = () => {
        axios.get(`http://localhost:8086/api/obra/categoria/${categoria}/nombreProducto/${nombreProducto}`)
            .then((response) => {
                setListObra(normalizeData(response.data));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    //DELETE USERS
    const deleteObra = async (pkCod_Producto) => {
        await axios.delete(`http://localhost:8086/api/obra/delete/${pkCod_Producto}`)
        getObra()
    }
    //DELETE USERS

    return (
        <>

            <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Buscar por categoría"/>

                <br></br>
                <br></br>

            <input
                type="text"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                placeholder="Buscar por nombre de producto"/>

                <br></br>
                <br></br>

            <Link to="/CreateObra" className='btn btn-primary'>Crear obra</Link>

            <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Acciones</th>
                            {/* Aquí puedes agregar más encabezados si es necesario */}
                        </tr>
                    </thead>
                    <tbody>
    {listObra.map((obra, index) => {
        return (
            <tr key={index}>
                <td>{obra.nombreProducto}</td>
                <td>{obra.categoria}</td>
                <td>{obra.cantidad}</td>
                <td><img src={obra.imagen} alt="" style={{ maxWidth: '100px' }} /></td>
                {/* Aquí puedes agregar más columnas si es necesario */}
                <td>
                    <Link to={`/EditObra/${obra.pkCod_Producto}`} className="btn btn-outline-primary mx-2">Edit</Link>
                    <button onClick={() => deleteObra(obra.pkCod_Producto)} className="btn btn-danger mx-2">Delete</button>
                </td>
            </tr>
        );
    })}
</tbody>
                </table>
            </div>
        </>
    );
};

export default ListObra;