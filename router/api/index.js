const router = require('express').Router();

router.use('/staff', require('./staffRouter'));
router.use('/inspection', require('./inspectRouter'));
router.use('/office', require('./officeRouter'));

module.exports = router;