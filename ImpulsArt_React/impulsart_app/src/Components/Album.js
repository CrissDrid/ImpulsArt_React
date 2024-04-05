import React, { useState } from 'react';

function Album() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const cardsData = [
    {
      title: 'Mona Lisa',
      description: 'Réplica de la Mona Lisa con técnica de acuarelas, reinterpretando la expresión y los detalles para resaltar su belleza enigmática.',
    },
    {
      title: 'La noche estrellada',
      description: 'Réplica de La noche estrellada con técnica de óleo, intensificando los colores y los remolinos para crear un efecto más dinámico y cautivador.',
    },
    {
        title: 'El nacimiento de Venus',
        description: 'Réplica de El nacimiento de Venus con técnica de acrílico, resaltando la gracia y la serenidad de la diosa en su concha marina.',
      },
      {
        title: 'Guernica',
        description: 'Réplica de Guernica con técnica mixta, reinterpretando las figuras y los símbolos para transmitir la brutalidad del bombardeo de Guernica.',
      },
      {
        title: 'La persistencia de la memoria',
        description: 'Réplica de La persistencia de la memoria con técnica de surrealismo, enfatizando los relojes derretidos y los paisajes oníricos.',
      },
      {
        title: 'El jardín de las delicias',
        description: 'Réplica de El jardín de las delicias con técnica de acuarelas, resaltando los detalles surrealistas y el simbolismo moral.6',
      },
      {
        title: 'La última cena',
        description: 'Réplica de La última cena con técnica de óleo, capturando la emoción y la intensidad del momento.',
      },
      {
        title: 'La primavera',
        description: 'Réplica de La primavera con técnica de acrílico, realzando la belleza y el simbolismo mitológico de la obra.',
      },
      {
        title: 'Los girasoles',
        description: 'Réplica de Los girasoles con técnica de óleo, destacando la textura y el colorido de las flores.',
      },
      {
        title: 'La creación de Adán',
        description: 'Réplica de La creación de Adán con técnica de acrílico, resaltando el dramatismo y la belleza del momento.',
      },
      {
        title: 'El grito',
        description: 'Réplica de El grito con técnica de acrílico, resaltando la angustia y la desesperación de la figura.',
      },
      {
        title: 'Las meninas',
        description: 'Réplica de Las meninas con técnica de óleo, recreando la complejidad y la profundidad de la obra maestra de Velázquez.',
      },
  ];

  const cards = cardsData.map((data, index) => (
    <div className="col" key={index}>
      <div className="card shadow-sm">
        <svg
          className="bd-placeholder-img card-img-top"
          width="100%"
          height="225"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={`Imagen: ${data.title}`}
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <title>{data.title}</title>
          <rect width="100%" height="100%" fill="#55595c" />
          <text x="50%" y="50%" fill="#eceeef" dy=".3em">
            {data.title}
          </text>
        </svg>
        <div className="card-body">
          <p className="card-text">{data.description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <button type="button" className="btn btn-sm btn-outline-secondary">
                View
              </button>
              <button type="button" className="btn btn-sm btn-outline-secondary">
                Edit
              </button>
            </div>
            <small className="text-body-secondary">9 mins</small>
          </div>
        </div>
      </div>
    </div>
  ));

  const currentCards = cards.slice(startIndex, endIndex);

  return (
    <div className="album py-5 bg-custom-color">
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">{currentCards}</div>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <nav aria-label="Page navigation example">
          <ul className="pagination" style={{ margin: '0' }}>
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {[...Array(Math.ceil(cards.length / itemsPerPage)).keys()].map((num) => (
              <li
                key={num}
                className={`page-item ${currentPage === num + 1 && 'active'}`}
                onClick={() => setCurrentPage(num + 1)}
                style={{ margin: '0' }}
              >
                <button className="page-link">{num + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === Math.ceil(cards.length / itemsPerPage) && 'disabled'}`}>
              <button
                className="page-link custom-page"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(cards.length / itemsPerPage)))
                }
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Album;
