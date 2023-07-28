const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pokeRoutes = require('./pokeRoutes.routes');

const typeRoutes = require('./typeRoutes')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
pokeRoutes.use('/pokemons', pokeRoutes);
pokeRoutes.use('/type', typeRoutes)

module.exports = router;
