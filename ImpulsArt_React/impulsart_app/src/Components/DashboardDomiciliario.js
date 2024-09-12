import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import '../Styles/PedidosAsignados.css'; // Asegúrate de crear este archivo con los estilos proporcionados
import Navbar_init from './Navbar_init';
import axios from 'axios';
import AuthToken from '../Auth/AuthToken';

const DashboardDomiciliario = () => {
  const [expandedRows, setExpandedRows] = useState(null);
  const [data, setData] = useState([]);

  // Obtener los datos cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AuthToken.get('despacho/all'); // Reemplaza con la URL de tu API
        const transformedData = response.data.data.map(despacho => ({
          referencia: despacho.referencia,
          fechaPedido: despacho.venta.fechaVenta,
          saldoCobrar: despacho.venta.costoTotal,
          estado: despacho.estado,
          nombreUsuario: despacho.usuario[0]?.nombre || 'No disponible',
          numeroContacto: despacho.usuario[0]?.numCelular || 'No disponible',
          direccionEntrega: `${despacho.direccion.direccion}, ${despacho.direccion.ciudad}, ${despacho.direccion.departamento}`,
          prioridad: despacho.venta.carrito.elementoCarrito.length > 0 ? 'Alta' : 'Media' // Ejemplo de lógica para prioridad
        }));
        setData(transformedData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  // Función para formatear el saldo en pesos colombianos
  const formatCurrency = (value) => {
    return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div>
        <h5>Datos de Envío</h5>
        <DataTable value={[data]} className="p-datatable-sm">
          <Column field="nombreUsuario" header="Nombre Usuario" />
          <Column field="numeroContacto" header="Número Contacto" />
          <Column field="direccionEntrega" header="Dirección Entrega" />
          <Column field="prioridad" header="Prioridad" />
        </DataTable>
      </div>
    );
  };

  const actionBodyTemplate = () => {
    return (
      <Button icon="pi pi-truck" className="p-button-rounded p-button-info" />
    );
  };

  const estadoBodyTemplate = (rowData) => {
    return <Tag value={rowData.estado} severity={getSeverity(rowData.estado)} />;
  };

  const getSeverity = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'warning';
      case 'En camino':
        return 'info';
      case 'Entregado':
        return 'success';
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar_init />
      <div className='title'>
        <h1>Pedidos Asignados</h1>
      </div>
      <div className="container-fluid mt-4 table">
        <DataTable
          value={data}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          className="custom-datatable p-datatable-sm"
        >
          <Column expander style={{ width: '3em' }} />
          <Column field="referencia" header="Referencia" />
          <Column field="fechaPedido" header="Fecha Pedido" />
          <Column field="saldoCobrar" header="Saldo a Cobrar" body={(rowData) => formatCurrency(rowData.saldoCobrar)} />
          <Column field="estado" header="Estado" body={estadoBodyTemplate} />
          <Column body={actionBodyTemplate} header="Botones" style={{ width: '5em' }} />
        </DataTable>
      </div>
    </>
  );
};

export default DashboardDomiciliario;