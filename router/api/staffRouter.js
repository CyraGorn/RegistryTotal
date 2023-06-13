const AuthAdmin = require('../../middleware/AuthAdmin');
const AuthHeader = require('../../middleware/AuthHeader');
const AuthAddStaff = require('../../middleware/AuthAddStaff');
const AuthChangeStaff = require('../../middleware/AuthChangeStaff');
const AuthResetPassword = require('../../middleware/AuthResetPassword');
const AuthChangePass = require('../../middleware/AuthChangePass');
const LoginRateLimit = require('../../middleware/LoginRateLimit');
const StaffController = require('../../controllers/StaffController');
const router = require('express').Router();

router.post('/login', LoginRateLimit, StaffController.login);
router.get('/all', AuthHeader, AuthAdmin, StaffController.getAllStaff);
router.get('/own', AuthHeader, StaffController.getOwnInfo);
router.put('/change', AuthHeader, AuthChangeStaff, StaffController.changeInfo);
router.post('/add', AuthHeader, AuthAdmin, AuthAddStaff, StaffController.addStaff);
router.post('/change-password', AuthHeader, AuthChangePass, StaffController.changePassword);
router.post('/forgot-password', StaffController.forgotPassword);
router.post('/reset-password/:token/:userid', AuthResetPassword, StaffController.resetPassword);
router.get('/:id', AuthHeader, AuthAdmin, StaffController.getById);

module.exports = router;
