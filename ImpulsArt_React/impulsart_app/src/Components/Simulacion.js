import axios from 'axios';
import React, { useEffect, useState } from 'react'
import 'jspdf-autotable';
import Navbar_init from './Navbar_init';


export const Simulacion = () => {
    const [listUsuario, setListUsuario] = useState([]);

    const [listObra, setListObra] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');

    useEffect(() => {
        getUsuario();
    }, []);


      //GET ALL USERS
      const getUsuario = () => {
        axios.get("http://localhost:8086/api/usuario/all")
            .then((response) => {
                setListUsuario(response.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

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
    const generateRandomGuideNumber = () => {
        return Math.floor(100000000 + Math.random() * 900000000); // Genera un número de 9 dígitos
    };   
    return (
        <>

<Navbar_init />

            <div className="container">



<br></br>
<br></br>

               <h1>Datos Producto</h1> 
               <table className="table">
                    
                    <thead className="table-head">
                        <tr>
                            <th scope="col">Numero de guia</th>
                            <th scope="col">Peso</th>
                            <th scope="col">Dimensiones</th>
                            <th scope="col">Valor Declarado</th>
                            
                            {/* Aquí puedes agregar más encabezados si es necesario */}
                        </tr>
                    </thead>
                    <tbody>
    {listObra.map((obra, index) => {
        return (
            <tr key={index}>
                <td>{generateRandomGuideNumber()}</td>
                <td>{obra.peso}</td>
                <td>{obra.alto}x{obra.ancho}</td>
                <td>{obra.costo}</td>

                {/* Aquí puedes agregar más columnas si es necesario */}
                <td>
                </td>
            </tr>
        );
    })}
</tbody>
                </table>

                <h1>Datos Usuario</h1>
                <table className="table">
                    <thead>
                        <tr>
                          <th scope="col">Identificacion</th>
                          <th scope="col">Nombre</th>
                          <th scope="col">Apellido</th>
                        
                          
                          <th scope="col">Celular</th>
                          <th scope="col">Direccion</th>
                          
                            {/* Aquí puedes agregar más encabezados si es necesario */}
                        </tr>
                    </thead>
                    <tbody>
                        {listUsuario.map((usuario, index) => (
                            <tr key={index}>
                                <td>{usuario.identificacion}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                
                                <td>{usuario.numCelular}</td>
                                <td>{usuario.direccion}</td>
                                {/* Aquí puedes agregar más columnas si es necesario */}
                                <td>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="btn btn-primary login-btn" type="button" >Buscar direccion </button>
            </div>
        </>
    );
};

export default Simulacion;