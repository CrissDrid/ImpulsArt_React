import React, { useState, useEffect } from 'react';
import '../Styles/Pago.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';

function Pago({ direccionSeleccionada, datosCarrito, onAtras }) {
  const [userData, setUserData] = useState(null);
  const costoEnvio = 10000; // 10,000 pesos de envío

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await GetUserInfo();
        const response = await AuthToken.get(`/usuario/list/${userInfo.identificacion}`);
        setUserData(response.data.data);
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleAtras = () => {
    onAtras();
  };

  if (!userData || !datosCarrito) {
    return <div>Cargando...</div>;
  }

  const total = datosCarrito.subtotal + costoEnvio;

  return (
    <div className="container">
      <h1 className="text-center my-4">Pago</h1>
      <div className="row">
        {/* Datos de Envío */}
        <div className="col-md-6">
          <h4>Datos de Envío</h4>
          <div className="border p-3">
            <div><p><strong>Destinatario: </strong>{userData.nombre} {userData.apellido}</p></div>
            <div><p><strong>Departamento y Ciudad: </strong>{direccionSeleccionada ? `${direccionSeleccionada.departamento}, ${direccionSeleccionada.ciudad}` : 'Departamento y Ciudad'}</p></div>
            <div><p><strong>Dirección: </strong>{direccionSeleccionada ? `${direccionSeleccionada.direccion}, ${direccionSeleccionada.observaciones}` : 'Dirección, Detalles Adicionales'}</p></div>
            <div><p><strong>Teléfono: </strong>{userData.numCelular}</p></div>
          </div>
        </div>

        {/* Recibo */}
        <div className="col-md-6">
          <h4>Recibo</h4>
          <div className="border p-3">
            {datosCarrito.items.map((item, index) => (
              <div key={index} className="d-flex justify-content-between">
                <div>{item.nombre} x({item.cantidad})</div>
                <div>${item.total.toLocaleString()}</div>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between subtotal">
              <strong>Subtotal</strong>
              <strong>${datosCarrito.subtotal.toLocaleString()}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <div>Costo de Envío</div>
              <div>${costoEnvio.toLocaleString()}</div>
            </div>
            <hr />
            <div className="d-flex justify-content-between total">
              <strong>Total</strong>
              <strong>${total.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="row mt-4">
        <div className="col-md-6 text-start">
          <button id='atras' className="btn" onClick={handleAtras}>Atrás</button>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-comprar">Comprar</button>
        </div>
      </div>
    </div>
  );
}

export default Pago;
