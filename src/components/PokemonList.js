import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import './PokemonList.css';

function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0); // Offset to manage pagination
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search state
  const [limit] = useState(20); // Limiting to 20 Pokémon per page

  const fetchPokemon = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
      const pokemonWithDetails = await Promise.all(
        response.data.results.map(async (pokemon) => {
          const details = await axios.get(pokemon.url);
          return { name: pokemon.name, image: details.data.sprites.front_default };
        })
      );
      setPokemon(pokemonWithDetails); // Set Pokémon list
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Failed to load Pokémon data');
    }
  }, [offset, limit]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  // Handlers for pagination
  const handleNext = () => {
    setOffset((prevOffset) => prevOffset + limit); // Move to the next page
  };

  const handlePrevious = () => {
    setOffset((prevOffset) => (prevOffset - limit >= 0 ? prevOffset - limit : 0)); // Move to the previous page
  };

  // Filter Pokémon by search query
  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pokemon-list">
      <SearchBar onSearch={setSearchQuery} />
      {error && <p>{error}</p>}
      <ul>
        {filteredPokemon.map((pokemon, index) => (
          <li key={index} className="pokemon-item">
            <Link to={`/pokemon/${pokemon.name}`}>
              <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
              <span className="pokemon-name">{pokemon.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrevious} disabled={offset === 0}>
          Previous
        </button>
        <button onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}

export default PokemonList;
