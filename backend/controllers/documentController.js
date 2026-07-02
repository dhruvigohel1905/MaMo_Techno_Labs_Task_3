const Document = require('../models/Document');
const Analysis = require('../models/Analysis');
const { extractText } = require('../utils/extractor');

/**
 * @desc    Upload document and extract text
 * @route   POST /api/documents/upload
 * @access  Private
 */
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { originalname, mimetype, size, buffer } = req.file;

    // Run file extraction & cleaning
    let extractedText = '';
    try {
      extractedText = await extractText(buffer, mimetype);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!extractedText || extractedText.trim() === '') {
      return res.status(422).json({
        success: false,
        message: 'Could not extract text. The document might be empty or contain non-scannable scanned images.',
      });
    }

    // Save document details and text contents to database
    const document = await Document.create({
      userId: req.user._id,
      fileName: originalname,
      fileType: mimetype,
      fileSize: size,
      rawText: extractedText,
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded and text extracted successfully',
      data: {
        id: document._id,
        fileName: document.fileName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    console.error('File Upload Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error processing file upload' });
  }
};

/**
 * @desc    Get all documents for the current user
 * @route   GET /api/documents
 * @access  Private
 */
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .select('-rawText') // Exclude heavy raw text from the listing for performance
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error('Fetch Documents Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching documents' });
  }
};

/**
 * @desc    Get document details by ID (including rawText)
 * @route   GET /api/documents/:id
 * @access  Private
 */
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error('Fetch Document By ID Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving document details' });
  }
};

/**
 * @desc    Delete document & associated analyses (Cascade)
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Cascade delete any analyses associated with this document
    await Analysis.deleteMany({ documentId: document._id });

    // Delete the document itself
    await Document.deleteOne({ _id: document._id });

    res.status(200).json({
      success: true,
      message: 'Document and its analysis reports successfully deleted',
    });
  } catch (error) {
    console.error('Delete Document Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting document' });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};
