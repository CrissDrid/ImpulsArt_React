import React, { useState, useEffect, useRef } from 'react';
import { PrimeIcons } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Navbar.css';
import AuthToken from '../Auth/AuthToken';

function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 0) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchSuggestions = async (query) => {
    setIsLoading(true);
    try {
      const response = await AuthToken.get(`obra/autocomplete?query=${query}`);
      const uniqueSuggestions = getUniqueSuggestions(response.data.data);
      setSuggestions(uniqueSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUniqueSuggestions = (suggestionsArray) => {
    return suggestionsArray.filter((suggestion, index, self) =>
      index === self.findIndex((s) => s === suggestion)
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateToSearchResults(searchQuery.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigateToSearchResults(suggestion);
  };

  const navigateToSearchResults = (query) => {
    navigate(`/SeccionSearch/${encodeURIComponent(query)}`);
  };

  return (
    <div ref={searchRef} className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="search-input"
          placeholder="Buscar obras..."
        />
        <button type="submit" className="search-button">
          <i className={PrimeIcons.SEARCH}></i>
        </button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="suggestion-item"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {isLoading && <div className="loading-suggestions">Cargando sugerencias...</div>}
    </div>
  );
}

export default SearchComponent;