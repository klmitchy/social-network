const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

router.use('/User', userRoutes);
router.use('/thought', thoughtRoutes);

module.exports = router;
