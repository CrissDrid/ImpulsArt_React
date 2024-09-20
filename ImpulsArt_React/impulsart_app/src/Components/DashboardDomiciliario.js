import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Styles/PedidosAsignados.css'; // Asegúrate de incluir buenos estilos aquí
import Navbar_init from './Navbar_init';
import AuthToken from '../Auth/AuthToken';
import GetUserInfo from '../Auth/GetUserInfo';

const DashboardDomiciliario = () => {
  const [data, setData] = useState([]);
  const [identificacion, setIdentificacion] = useState('');
  const [viewType, setViewType] = useState('noAsignados');
  const [expandedRows, setExpandedRows] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [estado, setEstado] = useState('');

  const formatCurrency = (value) => {
    return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  useEffect(() => {
    const { identificacion } = GetUserInfo();
    setIdentificacion(identificacion);
  }, []);

  // Función para calcular la diferencia de días entre la fecha actual y la fecha del pedido
  const calculateDaysDifference = (fechaVenta) => {
    const currentDate = new Date();
    const ventaDate = new Date(fechaVenta);
    const timeDiff = currentDate.getTime() - ventaDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };


  // Función para obtener la severidad basada en los días de diferencia
  const getSeverityForDays = (dias) => {
    if (dias <= 1) {
      return 'success';
    } else if (dias >= 2 && dias <= 3) {
      return 'warning';
    } else if (dias >= 4) {
      return 'danger';
    } else {
      return 'info';
    }
  };

  // Función para renderizar la columna con el número de días y el Tag
  const diasBodyTemplate = (rowData) => {
    const dias = calculateDaysDifference(rowData.venta.fechaVenta);
    return <Tag value={`${dias} Días`} severity={getSeverityForDays(dias)} />;
  };

  useEffect(() => {
    const fetchDespachos = async () => {
      try {
        setData([]);

        let response;
        if (viewType === 'noAsignados') {
          response = await AuthToken.get('despacho/despachosNoAsignados');
        } else if (viewType === 'asignados') {
          response = await AuthToken.get(`despacho/despachosAsignados/${identificacion}`);
        } else if (viewType === 'entregados') {
          response = await AuthToken.get(`despacho/despachosEntregados/${identificacion}`);
        }
        setData(response.data.data);
      } catch (error) {
        console.error('Error al obtener los despachos:', error);
      }
    };

    if (identificacion) {
      fetchDespachos();
    }
  }, [viewType, identificacion]);

  const handleAsignarDespacho = (pkCod_Despacho) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres asignarte este despacho?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, asignar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Asignando...',
          text: 'Por favor, espera un momento.',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        AuthToken.post('despacho/asignarDespacho', null, {
          params: { pkCod_Despacho, identificacion },
        })
          .then((response) => {
            Swal.fire('Asignado', 'El despacho ha sido asignado con éxito.', 'success');
            setData(data.filter((item) => item.pkCod_Despacho !== pkCod_Despacho));
          })
          .catch((error) => {
            const errorMessage = error.response?.data || 'Hubo un error al asignar el despacho.';
            Swal.fire('Error', errorMessage, 'error');
          });
      }
    });
  };

  const handleCambiarEstado = (pedido) => {
    if (!pedido) {
      console.error('Pedido es null');
      return;
    }

    setSelectedPedido(pedido);
    setEstado(pedido.estado);

    Swal.fire({
      title: 'Cambiar Estado',
      input: 'select',
      inputOptions: {
        'en camino': 'En Camino',
        'entregado': 'Entregado',
      },
      inputValue: pedido.estado,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: (newEstado) => {
        return newEstado;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newEstado = result.value;
        Swal.fire({
          title: 'Guardando...',
          text: 'Por favor, espera un momento.',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        AuthToken.put(`despacho/updateEstado/${pedido.pkCod_Despacho}`, { estado: newEstado })
          .then((response) => {
            Swal.fire('Actualizado', 'El estado del pedido ha sido actualizado con éxito.', 'success');
            setData(data.map((item) => (item.pkCod_Despacho === pedido.pkCod_Despacho ? { ...item, estado: newEstado } : item)));
          })
          .catch((error) => {
            Swal.fire('Error', 'Hubo un error al actualizar el estado del pedido.', 'error');
          })
          .finally(() => {
            setSelectedPedido(null);
          });
      }
    });
  };

  const rowExpansionTemplate = (rowData) => {
    return (
      <div className="expanded-row">
        <h5>Datos de Envío</h5>
        <DataTable value={[rowData]} className="p-datatable-sm expanded-table">
          <Column field="venta.carrito.usuario.nombre" header="Nombre Usuario" />
          <Column field="venta.carrito.usuario.numCelular" header="Número Contacto" />
          <Column field="direccion.departamento" header="Departamento" />
          <Column field="direccion.ciudad" header="Ciudad" />
          <Column field="direccion.direccion" header="Dirección Entrega" />
        </DataTable>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    if (viewType === 'noAsignados') {
      return (
        <Button
          icon="pi pi-cart-plus"
          className="p-button-rounded p-button-success action-button"
          onClick={() => handleAsignarDespacho(rowData.pkCod_Despacho)}
          tooltip="Llevar Pedido"
          tooltipOptions={{ position: 'top' }}
        />
      );
    } else if (viewType === 'asignados') {
      return (
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-info action-button"
          onClick={() => handleCambiarEstado(rowData)}
          tooltip="Cambiar Estado"
          tooltipOptions={{ position: 'top' }}
        />
      );
    }
    return null; // No se muestra nada si el tipo de vista no coincide
  };


  const estadoBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.estado}
        severity={getSeverity(rowData.estado)}
        className="status-tag"
        style={{ fontSize: '12px', padding: '5px 10px' }}
      />
    );
  };

  const getSeverity = (estado) => {
    switch (estado) {
      case 'en camino':
        return 'warning';
      case 'entregado':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <>
      <Navbar_init />
      <div className="dashboard-domiciliario">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Pedidos</h1>
          <div className="button-group mt-4">
            <Button
              label="Ver Pedidos No Asignados"
              onClick={() => setViewType('noAsignados')}
              className={`p-button ${viewType === 'noAsignados' ? 'p-button-success' : 'p-button-outlined'} custom-button`}
            />
            <Button
              label="Ver Mis Pedidos Asignados"
              onClick={() => setViewType('asignados')}
              className={`p-button ${viewType === 'asignados' ? 'p-button-success' : 'p-button-outlined'} custom-button`}
            />
            <Button
              label="Ver Mis Pedidos Entregados"
              onClick={() => setViewType('entregados')}
              className={`p-button ${viewType === 'entregados' ? 'p-button-success' : 'p-button-outlined'} custom-button`}
            />
          </div>
        </div>

        <div className="dashboard-content container-fluid mt-4">
          <DataTable
            value={data}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            className="custom-datatable p-datatable-sm"
            paginator
            rows={10}
            responsiveLayout="scroll"
          >
            <Column expander style={{ width: '3em' }} />
            <Column field="referencia" header="Referencia" className="column-header" />
            <Column field="venta.fechaVenta" header="Fecha de Pedido" className="column-header" />
            {viewType === 'entregados' && (
              <Column
                field="fechaEntrega"
                header="Fecha de Entrega"
                className="column-header"
              />
            )}
            <Column
              field="venta.costoTotal"
              header="Costo Total"
              className="column-header"
              body={(rowData) => formatCurrency(rowData.venta.costoTotal)}
            />
            {viewType !== 'entregados' && (
              <Column body={diasBodyTemplate} header="Prioridad" className="column-header" />
            )}
            <Column body={estadoBodyTemplate} header="Estado" className="column-header" />
            {viewType !== 'entregados' && (
              <Column body={actionBodyTemplate} header={viewType === 'noAsignados' ? 'Llevar Pedido' : 'Acciones'} className="column-header" />
            )}
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default DashboardDomiciliario;