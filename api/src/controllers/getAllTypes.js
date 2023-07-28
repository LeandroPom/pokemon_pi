const axios = require('axios');
const { Type } = require('../db')

const getType = async (req, res) => {
    try {
      const response = await axios('https://pokeapi.co/api/v2/type');
      const types = response.data.results;
      const typesPoke = [];
  
      for (const type of types) {
        const find = await Type.findOne({
          where: { name: type.name.charAt(0).toUpperCase() + type.name.slice(1) }
        });
  
        if (!find) {
          const pokeType = await Type.create({
            name: type.name.charAt(0).toUpperCase() + type.name.slice(1)
          });

          typesPoke.push(pokeType);
        } else {
          typesPoke.push(find);
        }
      }
      res.status(200).json(typesPoke);
    } catch (error) {
      res.status(400).json(error.message);
    }
  };
  
  module.exports = getType;