const AuthHeader = require('../../middleware/AuthHeader');
const AuthOffice = require('../../middleware/AuthOffice');
const AuthAddInspection = require('../../middleware/AuthAddInspection');
const InspectController = require('../../controllers/InspectController');
const router = require('express').Router();

router.post('/add', AuthHeader, AuthAddInspection, InspectController.createInspection);
router.get('/:id', AuthHeader, InspectController.getById);

module.exports = router;