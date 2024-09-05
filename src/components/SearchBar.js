// src/components/SearchBar.js
import React from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="Search Pokémon..."
      onChange={(e) => onSearch(e.target.value)}
      className="search-bar"
    />
  );
}

export default SearchBar;
