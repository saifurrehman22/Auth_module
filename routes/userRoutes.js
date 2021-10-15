const express = require('express');
const userController = require('../controllers/users');
const router = express.Router();

router.get('/users', userController.getUsers);

module.exports=router;
