const typeRoutes = require('express').Router();
const { Type } = require('../db');
const axios = require('axios')

typeRoutes.get('/', async (req, res) =>{
    try {
        let types = await Type.findAll()
        if(types.length = 0){
            const {data} = await axios('https://pokeapi.co/api/v2/type')
            types = data.results?.map( (type, index) =>{
                Type.create({name: type.name})
                return {id: index+1, name: type.name}
            })
            res.status(200).json(types)
        }else{
            res.status(200).json(types)
        }

    } catch (error) {
        res.status(400).json(error.message)
    }
});

module.exports = typeRoutes;