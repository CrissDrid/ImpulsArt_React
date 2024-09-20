import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

const FilterButton = ({ onApplyFilters }) => {
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: null,
    priceOrder: null,
    type: null
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8086/api/categoria/all');
      if (response.data.status === 'success') {
        const formattedCategories = response.data.data.map(category => ({
          label: category.nombreCategoria,
          value: category.nombreCategoria  // Cambiamos esto para usar nombreCategoria como valor
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const types = [
    { label: 'Obra', value: 'obra' },
    { label: 'Subasta', value: 'subasta' }
  ];

  const priceOrders = [
    { label: 'Mayor a menor', value: 'desc' },
    { label: 'Menor a mayor', value: 'asc' }
  ];

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setVisible(false);
  };

  const clearFilters = () => {
    setFilters({
      category: null,
      priceOrder: null,
      type: null
    });
    onApplyFilters({
      category: null,
      priceOrder: null,
      type: null
    });
    setVisible(false);
  };

  const footer = (
    <>
      <Button label="Aplicar" onClick={handleApplyFilters} />
      <Button label="Limpiar Filtros" onClick={clearFilters} className="p-button-secondary" />
    </>
  );

  return (
    <>
      <Button icon="pi pi-filter" onClick={() => setVisible(true)} className="p-button-rounded p-button-info" />
      <Dialog header="Filtros" visible={visible} style={{ width: '30rem' }} footer={footer} onHide={() => setVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="category">Categoría</label>
            <Dropdown
              id="category"
              value={filters.category}
              options={categories}
              onChange={(e) => setFilters({...filters, category: e.value})}
              placeholder="Selecciona una categoría"
            />
          </div>
          
          <div className="p-field">
            <label htmlFor="priceOrder">Orden de precio</label>
            <Dropdown
              id="priceOrder"
              value={filters.priceOrder}
              options={priceOrders}
              onChange={(e) => setFilters({...filters, priceOrder: e.value})}
              placeholder="Selecciona el orden de precio"
            />
          </div>
          
          <div className="p-field">
            <label htmlFor="type">Tipo</label>
            <Dropdown
              id="type"
              value={filters.type}
              options={types}
              onChange={(e) => setFilters({...filters, type: e.value})}
              placeholder="Selecciona un tipo"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default FilterButton;