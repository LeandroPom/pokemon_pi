const pokeRoutes = require('express').Router();
const { Pokemon, Type } = require('../db');
const { Op } = require('sequelize');
const axios = require('axios');




const createPokemon = async (req, res) => {
    try {
        const {name, image, hp, attack, defense, speed, height, weight, types}= req.body;

        // valida si existe en la api
        let apiResponse = await axios(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
            .catch(errror =>{
                console.log(error.response.data);
            })
        if(apiResponse) return res.status(400).json('this pokemon already exists')

        //valida si existe en la db 
        const pokemonInDb = await Pokemon.findOne({where: { name }})
        if(pokemonInDb) throw new Error('this pokemon already exists')

        //crea el pokemon
        let typesDb = await Type.findAll({
            where: { name: types }
        });

        const createPokemon = await Pokemon.create({name, image, hp, attack, defense, speed, height, weight, types});
        createPokemon.addType(typesDb)

        res.status(200).json({...createPokemon.dataValues, image: createPokemon.dataValues.image.toString(), types: types})

    } catch (error) {
        res.status(400).json(error.messge)
    }
};

const getAllPokemons = async (req, res) => {
    let name = req.query.name || undefined
    try {
        //sin nombre
        if(!name) {
            let allpokemons = await Pokemon.findAll();
            allpokemons = await Promise.all(allpokemons.map( async e =>{
                const pokemon = await Pokemon.findByPk(e.dataValues.id);
                const types = await pokemon.getTypes();
                return {
                        ...e.dataValues,
                    types: types.map(type => type.name),
                    db:'db'
                }
            }))

            const datos = await axios('https://pokeapi.co/api/v2/pokemon?limit=151')
            let pokemonsApi = await Promise.all(datos.data.results.map( async e => {
                let poke = await axios(e.url)
                return{
                    id: poke.data.id,
                    name:poke.data.forms[0].name,
                    image: poke.data.sprites.versions['generation-v']['black-white'].animated.front_default,
                    hp: poke.data.stats[0].base_stat,
                    attack: poke.data.stats[1].base_stat,
                    defense: poke.data.stats[2].base_stat,
                    speed: poke.data.stats[5].base_stat,
                    height: poke.data.height+ ' ft',
                    weight: poke.data.weight+ ' lb',
                    types: poke.data.types.map( t => t.type.name),
                    db: 'pokemon_api'
                }
            }))

            res.stats(200).json([...allpokemons, ...pokemonsApi])
        }

        // por nombre
        else{
            let pokemon = await pokemon.findOne({where: { name: {[Op.iLike]:name} }});
            //Op.iLike se utiliza para realizar consultas de búsqueda de texto insensibles a mayúsculas y minúsculas 
            if(pokemon){
                const types = await pokemon.getTypes();
                pokemon = {
                    ...pokemon.dataValues, 
                    types: types.map(type => type.name)
                }
                res.stats(200).json([pokemon])

            }else{
                name = req.query.name.toLowerCase()
                console.log(name)
                const poke = await axios(`https://pokeapi.co/api/v2/pokemon/${name}`)
                pokemon = {
                    id: poke.data.id,
                    name:poke.data.forms[0].name,
                    image: poke.data.sprites.versions['generation-v']['black-white'].animated.front_default,
                    hp: poke.data.stats[0].base_stat,
                    attack: poke.data.stats[1].base_stat,
                    defense: poke.data.stats[2].base_stat,
                    speed: poke.data.stats[5].base_stat,
                    height: poke.data.height+ ' ft',
                    weight: poke.data.weight+ ' lb',
                    types: poke.data.types.map( t => t.type.name)
                }
                res.status(200).json([pokemon])
            }
        }

    } catch (error) {
        res.stats(400).json(error.messge)
    }
};

const getPokemonById = async (req, res) => {
    try {
        const id = req.params.idPokemon
        //funcion regular que representa caracteres que no sean numericos
        const idContainsLetter = /\D/.test()

        if( parseInt(id) > 0 && parseInt(id) < 1281 && !idContainsLetter){

            let url = `https://pokeapi.co/api/v2/pokemon/${id}/`

            const poke = await axios(url)

            const pokemonApi = {
                id: poke.data.id,
                name:poke.data.forms[0].name,
                image: poke.data.sprites.versions['generation-v']['black-white'].animated.front_default,
                hp: poke.data.stats[0].base_stat,
                attack: poke.data.stats[1].base_stat,
                defense: poke.data.stats[2].base_stat,
                speed: poke.data.stats[5].base_stat,
                height: poke.data.height+ ' ft',
                weight: poke.data.weight+ ' lb',
                types: poke.data.types.map( t => t.type.name),
                db:'pokemon_api'
            }
            res.stats(200).json(pokemonApi)

        }else{
            let pokemonById = await pokemon.findByPk(id)
            if(pokemonById){

                const types = await pokemonById.getTypes();
                pokemonById = {...pokemonById.dataValues, types: types.map( type => type.name), db:'db'}

                res.stats(200).json(pokemonById)
            }
        }

    } catch (error) {
        res.stats(400).json(error.messge)
    }
}

// const nextList = async (req, res) => {
//     try {
//         const offset = req.params.offset
//         const datos = await axios(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=12`)

//         const pokemons = await Promise.all(datos.data.results.map( async e =>{
//             const poke = await axios(e.url)
//             return{
//                 id:poke.data.id,
//                 name:poke.data.forms[0].name,
//                 image: poke.data.sprites.versions.generation_v.black_white.animated.front_default,
//                 hp: poke.data.stats[0].base_stat,
//                 attack: poke.data.stats[1].base_stat,
//                 defense: poke.data.stats[2].base_stat,
//                 speed: poke.data.stats[5].base_stat,
//                 height: poke.data.height,
//                 weight: poke.data.weight,
//                 types: poke.data.types.map( t => t.type.name),
//                 db: 'pokemon_api'
//             }
//         }))
//         res.status(200).json(pokemons)

//     } catch (error) {
//         res.status(400).json(error.messge)
//     }
// }

// const filter = async (req, res) => {
//     let filter = req.params.filter
//     if(req.paramas.filter == '---') filter = 'unknown'

//     try {
//         let allPokemons = await Promise.all(type[filter].map( async pokemon =>{
//             const poke = await axios(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
//             return {
//                 id:poke.data.id,
//                 name:poke.data.forms[0].name,
//                 image: poke.data.sprites.versions.generation_v.black_white.animated.front_default,
//                 hp: poke.data.stats[0].base_stat,
//                 attack: poke.data.stats[1].base_stat,
//                 defense: poke.data.stats[2].base_stat,
//                 speed: poke.data.stats[5].base_stat,
//                 height: poke.data.height,
//                 weight: poke.data.weight,
//                 types: poke.data.types.map( t => t.type.name),
//                 db: 'pokemon_api'
//             }
//         }))
//         res.status(200).json([...allPokemons])

//     } catch (error) {
//         res.status(400).json(error.messge)
//     }
// }

module.exports = {createPokemon, getAllPokemons, getPokemonById} //, nextList, filter}