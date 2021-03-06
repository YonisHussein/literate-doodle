// Routing from controllers/api/index.js to controllers/api/index.js
const router = require('express').Router();

const userRoutes = require('./user-routes');

router.use('/users', userRoutes);

module.exports = router;