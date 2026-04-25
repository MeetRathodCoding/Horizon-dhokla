const Plan = require('../models/Plan.model');

const getPlan = async (req, res) => {
  try {
    let plan = await Plan.findOne({ user: req.user.id });
    if (!plan) {
      plan = await Plan.create({
        user: req.user.id,
        initialNetWorth: 10000,
        monthlySavings: 1000,
        annualGrowthRate: 0.07,
        milestones: []
      });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { initialNetWorth, monthlySavings, annualGrowthRate, milestones } = req.body;
    let plan = await Plan.findOne({ user: req.user.id });
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    plan.initialNetWorth = initialNetWorth ?? plan.initialNetWorth;
    plan.monthlySavings = monthlySavings ?? plan.monthlySavings;
    plan.annualGrowthRate = annualGrowthRate ?? plan.annualGrowthRate;
    if (milestones) {
      plan.milestones = milestones;
    }
    
    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPlan, updatePlan };
