const pokeRoutes = require('express').Router();
const { createPokemon, getAllPokemons, getPokemonById} = require('../controllers/controllers')

pokeRoutes.post('/', createPokemon)
pokeRoutes.get('/pokemons', getAllPokemons)
pokeRoutes.get('/:idPokemon', getPokemonById)
// pokeRoutes.get('/next/:offset', nextList)
// pokeRoutes.get('/filter/:filter', filter)

module.exports = pokeRoutes;