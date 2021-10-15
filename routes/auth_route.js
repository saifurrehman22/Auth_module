const express = require('express');
const authController = require('../controllers/authController');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/auth_model');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middlewares/checkAuth');
var app = express();
const multer  = require('multer')


var cors = require('cors');
app.use(cors())


router.post('/signup',authController.signUp);
router.post('/login',authController.login);
router.get('/get',checkAuth,authController.get);
router.get('/getone/:id',checkAuth,authController.getone);
router.patch('/changepassword',checkAuth,authController.changePassword);

router.put('/forgetPassword',authController.forgetPassword);
router.put('/resetPassword',authController.resetPassword);


//router.post('/single',authController.uploadImage);



module.exports=router;