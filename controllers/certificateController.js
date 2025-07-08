const Certificate = require('../models/Certificate');

// ✅ Create Certificate
const createCertificate = async (req, res) => {
  try {
    const newCert = new Certificate({
      ...req.body,
      vendor: req.vendor._id  // ✅ attach vendor ID from middleware
    });

    await newCert.save();
    res.status(201).json({ message: 'Certificate created successfully', certificate: newCert });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create certificate', error: error.message });
  }
};

// ✅ Get All Certificates
const getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ vendor: req.vendor._id });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get certificates', error: err.message });
  }
};

// ✅ Delete Certificate
const deleteCertificate = async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete certificate', error: err.message });
  }
};

// ✅ Update Certificate
const updateCertificate = async (req, res) => {
  try {
    const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update certificate', error: err.message });
  }
};

// ✅ Certificate Stats
const getCertificateStats = async (req, res) => {
  try {
    const total = await Certificate.countDocuments();
    const approved = await Certificate.countDocuments({ status: 'approved' });
    const rejected = await Certificate.countDocuments({ status: 'rejected' });
    const pending = await Certificate.countDocuments({ status: { $nin: ['approved', 'rejected'] } });

    res.json({ total, approved, rejected, pending });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get stats', error: err.message });
  }
};

// ✅ Recent Activities
const getRecentActivities = async (req, res) => {
  try {
    const recent = await Certificate.find().sort({ createdAt: -1 }).limit(5);
    res.json(recent);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get recent activities', error: err.message });
  }
};

// ✅ Approve Certificate
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

// ✅ Reject Certificate
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
