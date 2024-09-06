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

    useEffect(() => {
        // Obtener la información del usuario
        const { identificacion } = GetUserInfo();
        setIdentificacion(identificacion);

        const fetchCarrito = async () => {
            try {
                if (identificacion) {
                    const response = await AuthToken.get(`http://localhost:8086/api/carrito/usuarioPorCarrito/${identificacion}`);
                    setProductos(response.data.data.obra || []);
                }
            } catch (error) {
                console.error('Error al cargar el carrito:', error);
            }
        };

        fetchCarrito();
    }, [identificacion]);

    const increment = async (id) => {
        try {
            const producto = productos.find(p => p.pkCod_Producto === id);
            if (producto && producto.cantidad < producto.stock) {
                const response = await AuthToken.put(`http://localhost:8086/api/carrito/update-cantidad`, {
                    identificacion,  // Cambiamos carritoId por identificacion
                    obraId: id,
                    cantidad: producto.cantidad + 1
                });
                if (response.data.status === 'success') {
                    setProductos(productos.map(p =>
                        p.pkCod_Producto === id ? { ...p, cantidad: p.cantidad + 1 } : p
                    ));
                }
            }
        } catch (error) {
            console.error('Error al incrementar la cantidad:', error);
        }
    };

    const decrement = async (id) => {
        try {
            const producto = productos.find(p => p.pkCod_Producto === id);
            if (producto && producto.cantidad > 1) {
                const response = await AuthToken.put(`http://localhost:8086/api/carrito/update-cantidad`, {
                    identificacion,  // Cambiamos carritoId por identificacion
                    obraId: id,
                    cantidad: producto.cantidad - 1
                });
                if (response.data.status === 'success') {
                    setProductos(productos.map(p =>
                        p.pkCod_Producto === id ? { ...p, cantidad: p.cantidad - 1 } : p
                    ));
                }
            }
        } catch (error) {
            console.error('Error al decrementar la cantidad:', error);
        }
    };

    const eliminarProducto = async (id) => {
        try {
            const response = await AuthToken.delete(`http://localhost:8086/api/carrito/remove-obra`, {
                params: {
                    identificacion,  // Cambiamos carritoId por identificacion
                    obraId: id
                }
            });
    
            if (response.data.status === 'success') {
                // Recargar la página después de eliminar el producto
                window.location.reload();
            } else {
                console.error('Error al eliminar el producto:', response.data.message);
            }
        } catch (error) {
            if (error.response) {
                // Error en la respuesta del servidor
                console.error('Error al eliminar el producto:', error.response.data);
                console.error('Status:', error.response.status);
                console.error('Headers:', error.response.headers);
            } else {
                // Error en la solicitud
                console.error('Error al eliminar el producto:', error.message);
            }
        }
    };

    const calcularTotal = () => {
        return productos.reduce((total, producto) => total + (parseInt(producto.costo.replace(/[$,.]/g, '')) * producto.cantidad), 0);
    };

    return (
        <>
            <Navbar_init />
            <Stepts />
            <div id="carrito-compras" className='container'>
                <div className='row'>
                    <div className='col-md-8'>
                        {productos.map(producto => (
                            <div key={producto.pkCod_Producto} className='row border-bottom'>
                                <div className='col-md-3'>
                                    <div className='img'>
                                        <img src={producto.imagen} alt={producto.nombreProducto} />
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="card-body">
                                        <h5 className="card-title">{producto.nombreProducto}</h5>
                                        <p className="card-text text-muted">{producto.descripcion}</p>
                                        <small className="text-muted">Peso: {producto.peso} | Tamaño: {producto.tamano}</small>
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <h5 className='valorObra d-flex justify-content-end'>{producto.costo}</h5>
                                    <div className='col-md-3 d-flex justify-content-start'>
                                        <div className="d-flex align-items-center inputNumber">
                                            <button onClick={() => decrement(producto.pkCod_Producto)} className="btn btn-increment"><i className="pi pi-minus"></i></button>
                                            <input
                                                type="number"
                                                readOnly
                                                value={producto.cantidad}
                                                min="1"
                                                className="form-control input-cantidad text-center"
                                            />
                                            <button onClick={() => increment(producto.pkCod_Producto)} className="btn btn-decrement"><i className="pi pi-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-1'>
                                    <div className="p-2">
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarProducto(producto.pkCod_Producto)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-3">
                        <div className="card card-subtotal p-3">
                            <h6 className="text-center">Confirmación del Pedido</h6>
                            <ul className="list-group list-group-flush">
                                {productos.map(producto => (
                                    <li key={producto.pkCod_Producto} className="list-group-item nombrePrecio d-flex justify-content-between align-items-center">
                                        {producto.nombreProducto}
                                        <span>${parseInt(producto.costo.replace(/[$,.]/g, '')) * producto.cantidad}</span>
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
