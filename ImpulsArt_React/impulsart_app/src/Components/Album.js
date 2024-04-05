import React, { useState } from 'react';

function Album() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const cards = Array.from({ length: 22 }, (_, index) => (
    <div className="col" key={index}>
      <div className="card shadow-sm">
        <svg
          className="bd-placeholder-img card-img-top"
          width="100%"
          height="225"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Placeholder: Thumbnail"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <title>Placeholder</title>
          <rect width="100%" height="100%" fill="#55595c" />
          <text x="50%" y="50%" fill="#eceeef" dy=".3em">
            Thumbnail
          </text>
        </svg>
        <div className="card-body">
          <p className="card-text">
            This is a wider card with supporting text below as a natural lead-in to additional content. This content is a
            little bit longer.
          </p>
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
