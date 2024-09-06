import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PokemonDetail.css';

function PokemonDetail() {
  const { id } = useParams(); // Get the ID from the URL parameters
  const [pokemon, setPokemon] = useState(null); // State to store the Pokémon data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(response.data); // Set the Pokémon data
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setError('Failed to load Pokémon details'); // Handle error
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [id]); // Dependency array, fetches new data when the `id` changes

  const handleBackClick = () => {
    window.history.back(); // Navigate back to the previous page
  };

  if (loading) {
    return <p>Loading...</p>; // Loading state message
  }

  if (error) {
    return <p>{error}</p>; // Error message if data fails to load
  }

  if (!pokemon) {
    return <p>No Pokémon data available.</p>; // Display if no data is available
  }

  return (
    <div className="pokemon-detail">
      <h1>{pokemon.name}</h1>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="pokemon-detail-image"
      />
      <p>Height: {pokemon.height / 10} m</p>
      <p>Weight: {pokemon.weight / 10} kg</p>

      <h2>Abilities</h2>
      <ul>
        {pokemon.abilities.map((ability, index) => (
          <li key={index}>{ability.ability.name}</li>
        ))}
      </ul>

      <h2>Stats</h2>
      <ul>
        {pokemon.stats.map((stat, index) => (
          <li key={index}>
            {stat.stat.name}: {stat.base_stat}
          </li>
        ))}
      </ul>

      <h2>Types</h2>
      <ul>
        {pokemon.types.map((type, index) => (
          <li key={index}>{type.type.name}</li>
        ))}
      </ul>

      <button onClick={handleBackClick} className="back-button">Back</button>
    </div>
  );
}

export default PokemonDetail;
