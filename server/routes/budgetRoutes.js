const express = require('express');
const router = express.Router();
const { getBudget, updateBudget } = require('../controllers/budgetController');

router.route('/')
  .get(getBudget)
  .put(updateBudget);

module.exports = router;
