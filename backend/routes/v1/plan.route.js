const express = require('express');
const router = express.Router();
const { getPlan, updatePlan } = require('../../controllers/plan.controller');
const { protect } = require('../../middleware/auth.middleware');

router.route('/').get(protect, getPlan).put(protect, updatePlan);

module.exports = router;
