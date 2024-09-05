// src/components/PokemonList.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import './PokemonList.css';

function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPokemon = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
      const pokemonWithDetails = await Promise.all(
        response.data.results.map(async (pokemon) => {
          const details = await axios.get(pokemon.url);
          return { name: pokemon.name, image: details.data.sprites.front_default };
        })
      );
      setPokemon((prev) => [...prev, ...pokemonWithDetails]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Failed to load Pokémon data');
    }
  }, [offset]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    setOffset((prev) => prev + 20);
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
    </div>
  );
}

export default PokemonList;
