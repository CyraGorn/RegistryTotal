const AuthHeader = require('../../middleware/AuthHeader');
const AuthOffice = require('../../middleware/AuthOffice');
const InspectController = require('../../controllers/InspectController');
const router = require('express').Router();

router.post('/add', AuthHeader, AuthOffice, InspectController.createInspection);
router.get('/:id', AuthHeader, InspectController.getById);

module.exports = router;