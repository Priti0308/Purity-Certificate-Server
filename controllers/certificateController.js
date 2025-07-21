const Certificate = require('../models/Certificate');

// Create Certificate
const createCertificate = async (req, res) => {
  try {
    const newCert = new Certificate({
      ...req.body,
      vendor: req.vendor._id
    });

    await newCert.save();
    res.status(201).json({ message: 'Certificate created successfully', certificate: newCert });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create certificate', error: error.message });
  }
};

// Get All Certificates
const getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ vendor: req.vendor._id });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get certificates', error: err.message });
  }
};

// Delete Certificate
const deleteCertificate = async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete certificate', error: err.message });
  }
};

// Update Certificate
const updateCertificate = async (req, res) => {
  try {
    const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update certificate', error: err.message });
  }
};

// Certificate Stats
const getCertificateStats = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const total = await Certificate.countDocuments({ vendor: vendorId });
    const approved = await Certificate.countDocuments({ vendor: vendorId, status: 'approved' });
    const rejected = await Certificate.countDocuments({ vendor: vendorId, status: 'rejected' });
    const pending = await Certificate.countDocuments({ vendor: vendorId, status: { $nin: ['approved', 'rejected'] } });

    res.json({ total, approved, rejected, pending });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get stats', error: err.message });
  }
};

// Recent Activities
const getRecentActivities = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const recent = await Certificate.find({ vendor: vendorId })
      .select('item serialNo status createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(10);

    const activities = recent.map(cert => {
      const isNew = cert.createdAt.getTime() === cert.updatedAt.getTime();
      return {
        id: cert._id,
        action: isNew 
          ? `New certificate created for ${cert.item} (${cert.serialNo})`
          : `Certificate for ${cert.item} (${cert.serialNo}) was ${cert.status}`,
        timestamp: isNew ? cert.createdAt : cert.updatedAt,
        status: cert.status,
        serialNo: cert.serialNo,
        item: cert.item
      };
    });

    res.json(activities);
  } catch (err) {
    console.error('Recent Activities Error:', err);
    res.status(500).json({ 
      message: 'Failed to get recent activities', 
      error: err.message 
    });
  }
};


// Approve Certificate
const approveCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    cert.status = 'approved';
    await cert.save();
    res.json({ message: 'Certificate approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve certificate', error: err.message });
  }
};

// Reject Certificate
const rejectCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    cert.status = 'rejected';
    await cert.save();
    res.json({ message: 'Certificate rejected successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject certificate', error: err.message });
  }
};

module.exports = {
  createCertificate,
  getCertificates,
  deleteCertificate,
  getCertificateStats,
  getRecentActivities,
  updateCertificate,
  approveCertificate,
  rejectCertificate
};
