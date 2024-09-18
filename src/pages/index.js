import React, { useEffect, useState } from "react"
import hardcodedPokemonData  from "../consts/HARDCODE_POKEMONS_DATA.json"
import './styles.scss'
const IndexPage = () => {
  const [data, setData] = useState(null)
  const [pokemonsData, setPokemonsData] = useState([]);
  const [pokemonData, setPokemonData] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      const query = `query samplePokeAPIquery {
        pokemon_v2_pokemonspecies(where: {pokemon_v2_generation: {name: {_eq: "generation-i"}}}, order_by: {id: asc}) {
          name
          id
          pokemon_v2_pokemons(limit: 1) {
            pokemon_v2_pokemontypes {
              pokemon_v2_type {
                name
              }
            }
            pokemon_v2_pokemonstats {
              pokemon_v2_stat {
                name
              }
              base_stat
            }
            pokemon_v2_pokemonsprites {
              sprites(path: "other.official-artwork.front_default")
            }
          }
        }
      }`;

      try {
        const response = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
          }),
        });

        const { data } = await response.json();
        const { pokemon_v2_pokemonspecies } = data
        const pokemonsData = pokemon_v2_pokemonspecies.map(pokemon => {
          const { id, name, pokemon_v2_pokemons: additionalInfo  } = pokemon
          const { pokemon_v2_pokemonsprites: spriteInfo, pokemon_v2_pokemonstats: statsInfo, pokemon_v2_pokemontypes: typesInfo } = additionalInfo[0]
          const sprite = spriteInfo[0]?.sprites
          const stats = statsInfo?.reduce((obj, stat) => obj[stat.pokemon_v2_stat.name] = stat.base_stat, {})
          const types = typesInfo?.map(type => type.pokemon_v2_type.name)
          return ({
            id,
            name,
            sprite,
            stats,
            types
          })
        })
        setPokemonsData(pokemonsData)
      } catch (err) {
        setPokemonsData(hardcodedPokemonData)
      } finally {
        setLoading(false)
      }
    };

    fetchPokemon();
  }, []);
  

  return (
    <main>
      <h2>Base stats by pokemon</h2>
      {
        pokemonsData.map(pokemon => <button key={pokemon.id} onClick={() => setPokemonData(pokemon)}>{pokemon.id}</button>)
      }
      {
        pokemonData 
          ? <div>
            <h3>{pokemonData.name}</h3>
            <img src={pokemonData.sprite} />
          </div>
          : null
      }
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
