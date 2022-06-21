var router = require('express').Router();

// split up route handling
router.use('/', require('./append_raffle.controller'))

module.exports = router;