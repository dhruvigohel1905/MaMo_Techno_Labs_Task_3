const Analysis = require('../models/Analysis');
const Document = require('../models/Document');
const { analyzeDocument } = require('../services/aiService');
const { queryDocument } = require('../services/ragService');

/**
 * @desc    Perform AI Analysis on a document
 * @route   POST /api/analyze
 * @access  Private
 */
const runAnalysis = async (req, res) => {
  try {
    const { documentId, forceReanalyze } = req.body;

    if (!documentId) {
      return res.status(400).json({ success: false, message: 'Please provide a document ID' });
    }

    // Retrieve the document and check ownership
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found or access denied' });
    }

    // Check if an analysis report already exists (unless forced re-analysis is true)
    if (!forceReanalyze) {
      const existingAnalysis = await Analysis.findOne({ documentId: document._id });
      if (existingAnalysis) {
        return res.status(200).json({
          success: true,
          message: 'Retrieved existing document analysis',
          data: existingAnalysis,
        });
      }
    }

    // Trigger AI analysis service
    console.log(`Starting AI analysis for document: ${document.fileName} (${document._id})...`);
    const analysisJson = await analyzeDocument(document.rawText, document.fileName);

    // If there is an existing analysis and we are forcing reanalyze, delete the old one first
    if (forceReanalyze) {
      await Analysis.deleteOne({ documentId: document._id });
    }

    // Create the new analysis report
    const newAnalysis = await Analysis.create({
      documentId: document._id,
      userId: req.user._id,
      summary: analysisJson.summary,
      parties: analysisJson.parties,
      dates: analysisJson.dates,
      clauses: analysisJson.clauses,
      obligations: analysisJson.obligations,
      risks: analysisJson.risks,
      riskScore: analysisJson.riskScore,
      complianceInsights: analysisJson.complianceInsights,
      recommendations: analysisJson.recommendations,
      actionItems: analysisJson.actionItems,
    });

    console.log(`Analysis saved successfully for document ${document._id}`);
    res.status(201).json({
      success: true,
      message: 'Document analysis generated successfully',
      data: newAnalysis,
    });
  } catch (error) {
    console.error('Run Analysis Error:', error);
    res.status(500).json({ success: false, message: 'Server error generating document analysis' });
  }
};

/**
 * @desc    Get single analysis by ID
 * @route   GET /api/analyze/:id
 * @access  Private
 */
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('documentId', 'fileName fileType fileSize uploadedAt');

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Fetch Analysis Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching analysis report' });
  }
};

/**
 * @desc    Get all analysis history for user
 * @route   GET /api/history
 * @access  Private
 */
const getAnalysisHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ userId: req.user._id })
      .populate('documentId', 'fileName fileType fileSize uploadedAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error('Fetch History Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching analysis history' });
  }
};

/**
 * @desc    Delete analysis history item
 * @route   DELETE /api/history/:id
 * @access  Private
 */
const deleteAnalysisHistory = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis report not found' });
    }

    await Analysis.deleteOne({ _id: analysis._id });

    res.status(200).json({
      success: true,
      message: 'Analysis record deleted successfully from history',
    });
  } catch (error) {
    console.error('Delete History Item Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting analysis history record' });
  }
};

/**
 * @desc    Chat/QA with Document contents using RAG
 * @route   POST /api/analyze/:id/chat
 * @access  Private
 */
const chatWithDocument = async (req, res) => {
  try {
    const { question } = req.body;
    const analysisId = req.params.id;

    if (!question || question.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide a question' });
    }

    // Get the analysis context and document ID
    const analysis = await Analysis.findOne({
      _id: analysisId,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis context not found' });
    }

    // Retrieve the document raw text
    const document = await Document.findById(analysis.documentId);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Source document not found' });
    }

    console.log(`Running QA chat for Document ${document._id}. Query: "${question}"`);
    const answer = await queryDocument(document.rawText, question);

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error('RAG Chat Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error processing document QA' });
  }
};

/**
 * @desc    Update action items checkbox states
 * @route   PUT /api/analyze/:id/action-items
 * @access  Private
 */
const updateAnalysisActionItems = async (req, res) => {
  try {
    const { actionItems } = req.body;
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis report not found' });
    }

    if (actionItems) {
      analysis.actionItems = actionItems;
    }

    await analysis.save();

    res.status(200).json({
      success: true,
      message: 'Action items updated successfully',
      data: analysis,
    });
  } catch (error) {
    console.error('Update Action Items Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating checklist' });
  }
};

module.exports = {
  runAnalysis,
  getAnalysisById,
  getAnalysisHistory,
  deleteAnalysisHistory,
  chatWithDocument,
  updateAnalysisActionItems,
};
