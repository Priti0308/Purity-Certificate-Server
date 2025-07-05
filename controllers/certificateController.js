const Certificate = require('../models/Certificate');

// Create Certificate
const createCertificate = async (req, res) => {
  try {
    const { serialNo, name, item, fineness, grossWeight, date, notes } = req.body;

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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Certificates
const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ vendor: req.vendor._id }).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch certificates', error: err.message });
  }
};

// Delete Certificate
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Certificate Stats
const getCertificateStats = async (req, res) => {
  try {
    const total = await Certificate.countDocuments({ vendor: req.vendor._id });
    const approved = await Certificate.countDocuments({ vendor: req.vendor._id, status: 'approved' });
    const pending = await Certificate.countDocuments({ vendor: req.vendor._id, status: 'pending' });
    const rejected = await Certificate.countDocuments({ vendor: req.vendor._id, status: 'rejected' });

    res.json({ total, approved, pending, rejected });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch certificate statistics', error: error.message });
  }
};

// Get Recent Activities
const getRecentActivities = async (req, res) => {
  try {
    const recentCertificates = await Certificate.find({ vendor: req.vendor._id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('status createdAt updatedAt serialNo');

    const activities = recentCertificates.map(cert => {
      const action = (cert.createdAt.getTime() === cert.updatedAt.getTime())
        ? `Certificate #${cert.serialNo} created`
        : `Certificate #${cert.serialNo} updated to ${cert.status}`;

      return { action, timestamp: cert.updatedAt };
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent activities', error: error.message });
  }
};
//update certificate
// Update Certificate
const updateCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    if (cert.vendor.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this certificate' });
    }

    const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update certificate', error: error.message });
  }
};

module.exports = {
  createCertificate,
  getCertificates,
  deleteCertificate,
  getCertificateStats,
  getRecentActivities,
  updateCertificate,
};
