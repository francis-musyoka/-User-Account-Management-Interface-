const express = require('express');
const router = express.Router()

const authController = require('../controllers/auth');
const {isAuthenticated} = require('../middlewares/auth');

//CREATE ROUTES
router.post('/signup',authController.signUp);

router.post('/signIn',authController.signIn);

router.get('/getsingleuser/:id',authController.getSingleUser);

router.get('/userprofile', isAuthenticated, authController.userProfile);

router.get('/logout',  authController.logout);

router.put('/updateuser/:id', isAuthenticated, authController.updateUserDetails);

router.put('/updateuserpassword/:id', isAuthenticated, authController.updateUserPassword);

router.post('/forgotpassword',authController.forgotPassword );
 
router.post('/reset-password/:token', authController.resetPassword);

router.post('/refreshaccesstoken', authController.refreshAccessToken);

router.post('/deactivate-account', isAuthenticated, authController.deactivateAccount)

module.exports = router