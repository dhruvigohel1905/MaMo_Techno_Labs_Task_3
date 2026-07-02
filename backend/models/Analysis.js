const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  parties: [{
    name: String,
    role: String,
  }],
  dates: [{
    date: String,
    label: String,
    description: String,
  }],
  clauses: [{
    type: {
      type: String, // e.g., 'Termination Clause', 'Confidentiality Clause'
    },
    description: String,
    snippet: String,
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
  }],
  obligations: [{
    party: String,
    obligation: String,
  }],
  risks: [{
    title: String,
    description: String,
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
  }],
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  complianceInsights: [String],
  recommendations: [String],
  actionItems: [{
    task: String,
    checked: {
      type: Boolean,
      default: false,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
