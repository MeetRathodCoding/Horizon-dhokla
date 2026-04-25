const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  age: { type: Number, required: true },
  cost: { type: Number, required: true },
  category: { type: String, required: true },
});

const planSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  initialNetWorth: { type: Number, default: 10000 },
  monthlySavings: { type: Number, default: 1000 },
  annualGrowthRate: { type: Number, default: 0.07 },
  milestones: [milestoneSchema]
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
