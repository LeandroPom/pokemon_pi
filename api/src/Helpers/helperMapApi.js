module.exports = (arr) => {
    arr = arr.map( pokemon => {
        return {
            id: pokemon.data.id,
            name:pokemon.data.forms[0].name,
            image: pokemon.data.sprites.versions['generation-v']['black-white'].animated.front_default,
            hp: pokemon.data.stats[0].base_stat,
            attack: pokemon.data.stats[1].base_stat,
            defense: pokemon.data.stats[2].base_stat,
            speed: pokemon.data.stats[5].base_stat,
            height: pokemon.data.height+ ' ft',
            weight: pokemon.data.weight+ ' lb',
            types: pokemon.data.types.map( t => t.type.name)
        }
    })
    
    return arr;
}