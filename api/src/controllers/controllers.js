const pokeRoutes = require('express').Router();
const { Pokemon, Type } = require('../db');
const { Op } = require('sequelize');
const axios = require('axios');
const  helperApi  = require('../Helpers/helperApi')
const helperMapApi = require('../Helpers/helperMapApi')
const helperDB = require('../Helpers/helperBD')
const helperMapDB = require('../Helpers/helperMapDB')




const createPokemon = async (req, res) => {
    try {
        const {name, image, hp, attack, defense, speed, height, weight, types}= req.body;

        // valida si existe en la api
        let apiResponse = await axios(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
            .catch(error =>{
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

        res.status(201).json(createPokemon)

    } catch (error) {
        res.status(500).json(error.messge)
    }
};

const getAllPokemons = async (req, res) => {

    try {
        const getDataApi = await axios('https://pokeapi.co/api/v2/pokemon?limit=151');
        const getPokemonApi = getDataApi.data.results;


        const allPokemonApi = await Promise.all(getPokemonApi.map(async e => {
            const pokemonData = await axios(e.url)
            return helperApi(pokemonData);
        }));


        const allPokemonDB = await Pokemon.findAll({
            include: [{
                model: Type,
                attributes: ['name'],
                through: {
                    attributes: [],
                }
            }]
        })

        const getDBpoke = allPokemonDB.map(pokeDB => getPokedB(pokeDB)) 

        let arrAllPoke = [...allPokemonApi, ...getDBpoke]

        res.stats(200).json(arrAllPoke)

    } catch (error) {
        res.stats(400).json(error.messge)
    }
};

const getPokemonsName = async (req, res) => {
    const {name} = req.query;
    try {
        if(name){
            const nameLower = name.toLowerCase();
            const getNameToApi = await axios(`https://pokeapi.co/api/v2/pokemon/${nameLower}`);

            if(getNameToApi){
                const infoNamePoke = helperApi(getNameToApi);
                return res.status(200).json(infoNamePoke)
            }else{
                const pokeNameDB = await Pokemon.findOne({
                  where: {
                    name: name
                  },
                  include: [
                    {
                      model: Type,
                      attributes: ["name"]
                    }
                  ],
                });
                if(pokeNameDB){
                    const searchPokeDB = helperDB(pokeNameDB);
                    return res.status(200).json(searchPokeDB)
                }else{
                    throw new Error('No existen Pokemon con este nombre')
                }
            }

        }else{
            throw new Error('Unspecified name')
        }

    } catch (error) {
        res.status(400).json(error.message)
    }
}

const getPokemonById = async (req, res) => {
    const { idPokemon } = req.params;
    const search = isNaN(idPokemon) ? 'db' : 'api';
  
    try {
      const data = search === 'api'
        ? await axios(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
        : await Pokemon.findByPk(idPokemon, {
            include: [{
              model: Type,
              attributes: ['id'],
              through: {
                attributes: [],
              },
            }],
        });
  
      if (!data) {
        throw new Error('Pokemon no encontrado');
      }
  
      const pokemonFind = search === 'api' ? helperApi([data]) : helperDB([data]);
  
      if (search === 'api') {
        pokemonFind.filter(pokeID => pokeID.id === Number(idPokemon));
      }
  
      res.status(200).json(pokemonFind[0]);
    } catch (error) {
      res.status(404).json({ msg: error.message });
    }
};

module.exports = {createPokemon, getAllPokemons, getPokemonById, getPokemonsName} //, nextList, filter}