const Certificate = require('../models/Certificate');

// @desc    Create new certificate
// @route   POST /api/certificates
// @access  Private
const createCertificate = async (req, res) => {
  try {
    const {
      serialNo, name, item, fineness, grossWeight, date, notes
    } = req.body;

    if (!serialNo || !name || !item || !fineness || !grossWeight || !date) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const certificate = await Certificate.create({
      serialNo,
      name,
      item,
      fineness,
      grossWeight,
      date,
      notes,
      vendor: req.vendor._id,
    });

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Private
const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ vendor: req.vendor._id }).sort({ createdAt: -1 });
    res.json(certificates); // ✅ return array directly
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
};
// @desc    Delete certificate by ID
// @route   DELETE /api/certificates/:id
// @access  Private
const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    if (certificate.vendor.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this certificate' });
    }

    await certificate.deleteOne();
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get certificate statistics
// @route   GET /api/certificates/stats
// @access  Private
const getCertificateStats = async (req, res) => {
  try {
    const total = await Certificate.countDocuments({ vendor: req.vendor._id });
    const approved = await Certificate.countDocuments({ 
      vendor: req.vendor._id,
      status: 'approved'
    });
    const pending = await Certificate.countDocuments({ 
      vendor: req.vendor._id,
      status: 'pending'
    });
    const rejected = await Certificate.countDocuments({ 
      vendor: req.vendor._id,
      status: 'rejected'
    });

    res.json({
      total,
      approved,
      pending,
      rejected
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch certificate statistics' });
  }
};

// @desc    Get recent certificate activities
// @route   GET /api/certificates/recent
// @access  Private
const getRecentActivities = async (req, res) => {
  try {
    const recentCertificates = await Certificate.find({ vendor: req.vendor._id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('status createdAt updatedAt serialNo');

    const activities = recentCertificates.map(cert => {
      let action = '';
      if (cert.createdAt.getTime() === cert.updatedAt.getTime()) {
        action = `Certificate #${cert.serialNo} created`;
      } else {
        action = `Certificate #${cert.serialNo} updated to ${cert.status}`;
      }
      return {
        action,
        timestamp: cert.updatedAt
      };
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent activities' });
  }
};

module.exports = {
  createCertificate,
  getCertificates,
  deleteCertificate,
  getCertificateStats,
  getRecentActivities
};
