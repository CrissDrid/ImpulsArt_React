import React, { useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';  // Tema
import 'primereact/resources/primereact.min.css';          // Estilos de componentes
import 'primeicons/primeicons.css';                        // Íconos

export default function PurchaseHistory({ purchases }) {
  const [expandedPurchase, setExpandedPurchase] = useState(null);

  const toggleExpand = (purchaseId) => {
    setExpandedPurchase(expandedPurchase === purchaseId ? null : purchaseId);
  };

  const responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '600px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  const artworkTemplate = (artwork) => {
    return (
      <div key={artwork.id} className="px-2">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className="w-full h-48 object-cover rounded-md"
        />
        <p className="mt-2 text-sm text-center">{artwork.title}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Historial de Compras</h2>
      {purchases.map((purchase) => (
        <div key={purchase.id} className="mb-8 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold">Fecha: {purchase.date}</p>
              <p className="text-lg font-semibold">Total: ${purchase.totalPrice.toFixed(2)}</p>
            </div>
            <Carousel 
              value={purchase.artworks.slice(0, expandedPurchase === purchase.id ? undefined : 6)}
              numVisible={3} 
              numScroll={3}
              responsiveOptions={responsiveOptions}
              circular={false}
              autoplayInterval={3000}
              itemTemplate={artworkTemplate}
              className="custom-carousel"
            />
            {purchase.artworks.length > 6 && (
              <Button
                onClick={() => toggleExpand(purchase.id)}
                label={expandedPurchase === purchase.id ? 'Ver menos' : 'Ver más'}
                className="mt-4 p-button-info"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
