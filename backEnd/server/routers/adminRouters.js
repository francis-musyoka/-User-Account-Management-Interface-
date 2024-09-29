const express = require('express');
const router = express.Router()


const adminController = require('../controllers/admin');
const {isAuthenticated,isAdmin} = require('../middlewares/auth');


router.get('/get-all-users', isAuthenticated, isAdmin, adminController.getAllUsers);

router.put('/edit-user-details/:id', isAuthenticated, isAdmin, adminController.editUserDetails);

router.post('/activate-user/:id',isAuthenticated, isAdmin,adminController.activateUser);

router.post('/deactivate-user/:id',isAuthenticated, isAdmin,adminController.deactivateUser);

router.post('/delete-user/:id', isAuthenticated, isAdmin, adminController.deleteUser);

module.exports =router;