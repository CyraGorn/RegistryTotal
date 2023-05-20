const AuthAdmin = require('../../middleware/AuthAdmin');
const AuthHeader = require('../../middleware/AuthHeader');
const AuthOffice = require('../../middleware/AuthOffice');
const OfficeController = require('../../controllers/OfficeController');
const router = require('express').Router();

router.get('/', AuthHeader, AuthOffice, AuthAdmin, OfficeController.getAllOffice);
router.post('/add', AuthHeader, AuthAdmin, OfficeController.addOffice);
router.get('/:id', AuthHeader, AuthOffice, OfficeController.getById);
router.post('/:id/car', AuthHeader, AuthOffice, OfficeController.getCarRegisted);
router.post('/:id/outdatecar', AuthHeader, AuthOffice, OfficeController.getCarOutDate);

module.exports = router;