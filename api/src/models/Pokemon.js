const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      deafaulValue:DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image:{
      type: DataTypes.STRING,
      allowNull: false
    },
    hp:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attack:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    defense:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    speed:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
    { timestamps:false }
    //evita que se añada createdAt y updatedAt a las tablas
  );
};
