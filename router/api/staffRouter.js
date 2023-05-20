const AuthAdmin = require('../../middleware/AuthAdmin');
const AuthHeader = require('../../middleware/AuthHeader');
const AuthAddStaff = require('../../middleware/AuthAddStaff');
const AuthChangeStaff = require('../../middleware/AuthChangeStaff');
const StaffController = require('../../controllers/StaffController');
const router = require('express').Router();

router.post('/login', StaffController.login);
router.get('/all', AuthHeader, AuthAdmin, StaffController.getAllStaff);
router.get('/own', AuthHeader, StaffController.getOwnInfo);
router.post('/change', AuthHeader, AuthChangeStaff, StaffController.changeInfo);
router.post('/add', AuthHeader, AuthAdmin, AuthAddStaff, StaffController.addStaff);
router.get('/:id', AuthHeader, AuthAdmin, StaffController.getById);

module.exports = router;