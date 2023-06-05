const AuthAdmin = require('../../middleware/AuthAdmin');
const AuthHeader = require('../../middleware/AuthHeader');
const AuthOffice = require('../../middleware/AuthOffice');
const AuthAddOffice = require('../../middleware/AuthAddOffice');
const OfficeController = require('../../controllers/OfficeController');
const router = require('express').Router();

router.get('/', AuthHeader, AuthOffice, AuthAdmin, OfficeController.getAllOffice);
router.post('/add', AuthHeader, AuthAdmin, AuthAddOffice, OfficeController.addOffice);
router.get('/recentregis', AuthHeader, OfficeController.getRecentRegistry);
router.get('/:id', AuthHeader, AuthOffice, OfficeController.getById);
router.post('/:id/newcar', AuthHeader, OfficeController.getNewCar);
router.post('/:id/car', AuthHeader, OfficeController.getCarRegisted);
router.post('/:id/outdatecar', AuthHeader, OfficeController.getCarOutDate);

module.exports = router;