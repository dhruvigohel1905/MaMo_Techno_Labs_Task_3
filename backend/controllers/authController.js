const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Document = require('../models/Document');
const Analysis = require('../models/Analysis');

// Helper to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate request body
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user (hashing occurs in User model pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user (explicitly request password field)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

/**
 * @desc    Get current user profile & dashboard statistics
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    // req.user is loaded by the protect middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch dashboard stats for this user
    const totalDocs = await Document.countDocuments({ userId: user._id });
    const analyzedDocs = await Analysis.countDocuments({ userId: user._id });
    
    // Calculate total high/medium risk alerts found across their analyses
    const userAnalyses = await Analysis.find({ userId: user._id });
    let riskAlerts = 0;
    userAnalyses.forEach(analysis => {
      const issues = analysis.risks || [];
      issues.forEach(issue => {
        if (issue.riskLevel === 'High' || issue.riskLevel === 'Medium') {
          riskAlerts++;
        }
      });
    });

    // Get last upload date
    const lastDoc = await Document.findOne({ userId: user._id }).sort({ uploadedAt: -1 });
    const lastUploadDate = lastDoc ? lastDoc.uploadedAt : null;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      stats: {
        totalDocuments: totalDocs,
        documentsAnalyzed: analyzedDocs,
        riskAlertsFound: riskAlerts,
        lastUploadDate: lastUploadDate,
      },
    });
  } catch (error) {
    console.error('Profile Retrieval Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

/**
 * @desc    Update user profile (Name / Password)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update name if passed
    if (req.body.name) {
      user.name = req.body.name;
    }

    // Update password if passed (triggers pre-save hashing hook)
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Profile Update Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating profile details' });
  }
};

module.exports = { register, login, getProfile, updateProfile };
