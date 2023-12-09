const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController.js');

router.get('/', balanceController.getBalancesOfUser)
router.post('/', balanceController.addBalace)

module.exports = router;