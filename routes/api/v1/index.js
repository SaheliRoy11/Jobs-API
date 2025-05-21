
const router = require('express').Router();
const { auth } = require('../../../middleware/authentication');

router.use('/auth', require('./auth'));
router.use('/jobs', auth, require('./jobs'));

module.exports = router;
