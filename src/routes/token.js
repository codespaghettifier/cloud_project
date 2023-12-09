const express = require('express');
const router = express.Router();
const userController = require('../controllers/tokenController.js');

router.get('/', userController.getAllTokens)
router.post('/', userController.addToken)

module.exports = router;