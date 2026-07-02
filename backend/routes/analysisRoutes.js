const express = require('express');
const router = express.Router();
const {
  runAnalysis,
  getAnalysisById,
  getAnalysisHistory,
  deleteAnalysisHistory,
  chatWithDocument,
  updateAnalysisActionItems,
} = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Route to run/initiate AI analysis on a document
router.post('/analyze', runAnalysis);

// Route to fetch all past analyses (history list)
router.get('/history', getAnalysisHistory);

// Route to retrieve a single analysis detail record
router.get('/analyze/:id', getAnalysisById);

// Route to delete a single analysis from history
router.delete('/history/:id', deleteAnalysisHistory);

// Route to update action checklist items
router.put('/analyze/:id/action-items', updateAnalysisActionItems);

// Route for interactive RAG QA Chat with the document
router.post('/analyze/:id/chat', chatWithDocument);

module.exports = router;
