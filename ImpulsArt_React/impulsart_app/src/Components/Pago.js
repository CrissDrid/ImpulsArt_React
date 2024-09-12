import React, { useState, useEffect } from 'react';
import '../Styles/Pago.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';
import Swal from 'sweetalert2'; // Para mostrar alertas de éxito o error
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function Pago({ direccionSeleccionada, datosCarrito, onAtras }) {
  const [userData, setUserData] = useState(null); // Datos del usuario
  const [carritoId, setCarritoId] = useState(null); // ID del carrito
  const [direccionId, setDireccionId] = useState(null); // ID de la dirección
  const costoEnvio = 10000; // 10,000 pesos de envío
  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await GetUserInfo();
        if (userInfo && userInfo.identificacion) {
          // Obtener datos del carrito
          const carritoResponse = await AuthToken.get(`carrito/usuarioPorCarrito/${userInfo.identificacion}`);
          const carritoData = carritoResponse.data.data;
          setCarritoId(carritoData.pkCod_Carrito); // Asignar el carritoId

          // Obtener datos del usuario
          const userResponse = await AuthToken.get(`usuario/list/${userInfo.identificacion}`);
          const userData = userResponse.data.data;
          setUserData(userData);

          // Establecer el ID de la dirección seleccionada si está disponible
          if (direccionSeleccionada && direccionSeleccionada.id) {
            setDireccionId(direccionSeleccionada.id);
          }
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
      }
    };

    fetchData();
  }, [direccionSeleccionada]);

  const handleAtras = () => {
    onAtras();
  };

  const handleComprar = async () => {
    if (!userData || !direccionId || carritoId === null) {
      Swal.fire('Error', 'Faltan datos para completar la compra', 'error');
      return;
    }

    // Mostrar alerta de carga
    Swal.fire({
      title: 'Procesando...',
      text: 'Por favor, espere mientras se completa la compra.',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await AuthToken.post('venta/create', null, {
        params: {
          carritoId: carritoId,
          fkCodDireccion: direccionId,
          FkCod_Usuarios: userData.identificacion
        }
      });
      if (response.status === 200 || response.status === 201) {
        Swal.fire('Éxito', 'La compra se ha realizado con éxito', 'success').then(() => {
          // Redirigir al usuario a la página de inicio
          navigate('/Home'); // Redirige al usuario a la página de inicio
        });
      }
    } catch (error) {
      console.error('Error al crear la venta:', error);
      Swal.fire('Error', 'Ocurrió un error al procesar la compra', 'error');
    }
  };

  if (!userData || !datosCarrito || !direccionSeleccionada || carritoId === null) {
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
            <div><p><strong>ID de la Dirección: </strong>{direccionId}</p></div> {/* Mostrar ID de la dirección */}
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
          <button className="btn btn-comprar" onClick={handleComprar}>Comprar</button>
        </div>
      </div>
    </div>
  );
}

export default Pago;
