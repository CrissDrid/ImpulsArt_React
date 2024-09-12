import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import '../Styles/PedidosAsignados.css'; // Asegúrate de crear este archivo con los estilos proporcionados
import Navbar_init from './Navbar_init';

const DashboardDomiciliario = () => {
  const [expandedRows, setExpandedRows] = useState(null);

  const data = [
    {
      referencia: '001',
      fechaPedido: '2024-09-11',
      saldoCobrar: 50.00,
      estado: 'Pendiente',
      nombreUsuario: 'Juan Pérez',
      numeroContacto: '123-456-7890',
      direccionEntrega: 'Calle 123 #45-67',
      prioridad: 'Alta'
    },
    {
      referencia: '002',
      fechaPedido: '2024-09-12',
      saldoCobrar: 75.50,
      estado: 'En camino',
      nombreUsuario: 'María Rodríguez',
      numeroContacto: '098-765-4321',
      direccionEntrega: 'Avenida Principal 456',
      prioridad: 'Media'
    },
  ];

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
    <Navbar_init/>
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
        <Column field="saldoCobrar" header="Saldo a Cobrar" body={(rowData) => `$${rowData.saldoCobrar.toFixed(2)}`} />
        <Column field="estado" header="Estado" body={estadoBodyTemplate} />
        <Column body={actionBodyTemplate} header="Botones" style={{ width: '5em' }} />
      </DataTable>
    </div>
    </>
  );
};

export default DashboardDomiciliario;