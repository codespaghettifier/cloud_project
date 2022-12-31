const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/', userController.getAllUsers)
router.post('/', userController.addUser)

module.exports = router;