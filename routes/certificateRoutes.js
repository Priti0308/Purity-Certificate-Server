const express = require('express');
const router = express.Router();
const {
  createCertificate,
  getCertificates,
  deleteCertificate,
  getCertificateStats,
  getRecentActivities,
  updateCertificate, // ✅
} = require('../controllers/certificateController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createCertificate);
router.get('/', protect, getCertificates);
router.get('/stats', protect, getCertificateStats);
router.get('/recent', protect, getRecentActivities);
router.delete('/:id', protect, deleteCertificate);
router.put('/:id', protect, updateCertificate); // ✅ PUT route

module.exports = router;
