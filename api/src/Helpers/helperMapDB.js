module.exports = (pokemon) => {
    pokemon = pokemon.map( pokemonBD => {
        return {
            id: pokemonDB.id,
            name:pokemonDB.name,
            image: pokemonDB.image,
            hp: pokemonDB.hp,
            attack: pokemonDB.attack,
            defense: pokemonDB.defense,
            speed: pokemonDB.speed,
            height: pokemonDB.height,
            weight: pokemonDB.weight,
            types: pokemonDB.types.map( t => t.type.name),
            db: 'pokemon_DB'
        }
    })

    return pokemon;
}