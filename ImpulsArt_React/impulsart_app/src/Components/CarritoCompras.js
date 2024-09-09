import React, { useState, useEffect } from 'react';
import Navbar_init from './Navbar_init';
import Footer from './Footer';
import Stepts from './Stepts';
import { Button } from 'primereact/button';
import '../Styles/CarritoCompras.css';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';

function CarritoCompras() {
    const [identificacion, setIdentificacion] = useState('');
    const [productos, setProductos] = useState([]);
    const [elementoCarrito, setElementoCarrito] = useState([]);
    const [carritoId, setCarritoId] = useState(null);

    useEffect(() => {
        // Obtener la información del usuario
        const { identificacion } = GetUserInfo();
        setIdentificacion(identificacion);

        useEffect(() => {
            const { identificacion } = GetUserInfo();
            setIdentificacion(identificacion);
        
            const fetchCarrito = async () => {
                try {
                    if (identificacion) {
                        const response = await AuthToken.get(`${process.env.REACT_APP_API_BASE_URL}carrito/usuarioPorCarrito/${identificacion}`);
                        const { data } = response.data;
                        const elementosCarrito = data.elementoCarrito || [];
                        setElementoCarrito(elementosCarrito);
                        setCarritoId(data.pkCod_Carrito); // Asignar el carritoId
                        console.log('Carrito ID obtenido:', data.pkCod_Carrito);
        
                        const productos = elementosCarrito.map(item => ({
                            ...item.obra,
                            cantidad: item.cantidad // Incluir la cantidad del elementoCarrito
                        }));
                        setProductos(productos);
                    }
                } catch (error) {
                    console.error('Error al cargar el carrito:', error);
                }
            };
        
            fetchCarrito();
        }, [identificacion]);

        fetchCarrito();
    }, [identificacion]);

    const actualizarCantidad = async (elementoId, nuevaCantidad) => {
        try {
            const response = await AuthToken.put(`${process.env.REACT_APP_API_BASE_URL}carrito/updateCantidad`, null, {
                params: {
                    carritoId: carritoId,
                    elementoId: elementoId,
                    nuevaCantidad: nuevaCantidad
                }
            });

            if (response.status === 200) {
                // Actualizar la lista de productos después de la actualización
                setElementoCarrito(prevElementos => prevElementos.map(item =>
                    item.pkCod_Elemento === elementoId ? { ...item, cantidad: nuevaCantidad } : item
                ));
                setProductos(prevProductos => prevProductos.map(producto =>
                    producto.pkCod_Producto === elementoId ? { ...producto, cantidad: nuevaCantidad } : producto
                ));
            } else {
                console.error('Error al actualizar la cantidad:', response.data.message);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error al actualizar la cantidad:', error.response.data);
            } else {
                console.error('Error al actualizar la cantidad:', error.message);
            }
        }
    };

    const incrementarCantidad = (id, cantidadActual) => {
        const nuevaCantidad = cantidadActual + 1;
        actualizarCantidad(id, nuevaCantidad);
    };

    const decrementarCantidad = (id, cantidadActual) => {
        if (cantidadActual > 1) {
            const nuevaCantidad = cantidadActual - 1;
            actualizarCantidad(id, nuevaCantidad);
        }
    };

    const eliminarProducto = async (id) => {
        if (!carritoId) {
            console.error('Carrito ID no disponible');
            return;
        }
    
        const url = `${process.env.REACT_APP_API_BASE_URL}carrito/removeObras/${carritoId}/${id}`;
        console.log('URL de eliminación:', url);
    
        try {
            const response = await AuthToken.delete(url);
            
            if (response.status === 200) {
                // Actualizar el estado del carrito para eliminar el producto
                setElementoCarrito(prevElementos => prevElementos.filter(item => item.pkCod_Elemento !== id));
                setProductos(prevProductos => prevProductos.filter(producto => producto.pkCod_Producto !== id));
            } else {
                console.error('Error al eliminar el producto:', response.data.message);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error al eliminar el producto:', error.response.data);
            } else {
                console.error('Error al eliminar el producto:', error.message);
            }
        }
    };

    const calcularTotal = () => {
        return elementoCarrito.reduce((total, item) => total + (parseInt(item.obra.costo.replace(/[$,.]/g, '')) * item.cantidad), 0);
    };

    return (
        <>
            <Navbar_init />
            <Stepts />
            <div id="carrito-compras" className='container'>
                <div className='row'>
                    <div className='col-md-8'>
                        {elementoCarrito.map(item => (
                            <div key={item.pkCod_Elemento} className='row border-bottom'>
                                <div className='col-md-3'>
                                    <div className='img'>
                                        <img  src={`data:${item.obra.TipoImagen};base64,${item.obra.imagen}`} alt={item.obra.nombreProducto} />
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="card-body">
                                        <h5 className="card-title">{item.obra.nombreProducto}</h5>
                                        <p className="card-text text-muted">{item.obra.descripcion}</p>
                                        <small className="text-muted">Peso: {item.obra.peso} | Tamaño: {item.obra.tamano}</small>
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <h5 className='valorObra d-flex justify-content-end'>{item.obra.costo}</h5>
                                    <div className='col-md-3 d-flex justify-content-start'>
                                        <div className="d-flex align-items-center inputNumber">
                                            <button 
                                                className="btn btn-increment"
                                                onClick={() => decrementarCantidad(item.pkCod_Elemento, item.cantidad)}
                                            >
                                                <i className="pi pi-minus"></i>
                                            </button>
                                            <input
                                                type="number"
                                                readOnly
                                                value={item.cantidad}
                                                min="1"
                                                className="form-control input-cantidad text-center"
                                            />
                                            <button 
                                                className="btn btn-decrement"
                                                onClick={() => incrementarCantidad(item.pkCod_Elemento, item.cantidad)}
                                            >
                                                <i className="pi pi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-1'>
                                    <div className="p-2">
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarProducto(item.pkCod_Elemento)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-3">
                        <div className="card card-subtotal p-3">
                            <h6 className="text-center">Confirmación del Pedido</h6>
                            <ul className="list-group list-group-flush">
                                {elementoCarrito.map(item => (
                                    <li key={item.pkCod_Elemento} className="list-group-item nombrePrecio d-flex justify-content-between align-items-center">
                                        {item.obra.nombreProducto}
                                        <span>${parseInt(item.obra.costo.replace(/[$,.]/g, '')) * item.cantidad}</span>
                                    </li>
                                ))}
                                <li className="list-group-item total d-flex justify-content-between align-items-center font-weight-bold">
                                    Total
                                    <span>${calcularTotal()}</span>
                                </li>
                            </ul>
                            <button className="btn btn-finalizarCompra mt-3 w-100">Finalizar Compra</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default CarritoCompras;
