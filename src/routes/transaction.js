const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/transactionController.js');

router.get('/', balanceController.getTransactions)
router.post('/', balanceController.addTransaction)

module.exports = router;