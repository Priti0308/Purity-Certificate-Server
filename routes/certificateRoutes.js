const express = require('express');
const router = express.Router();
const { createCertificate, getCertificates } = require('../controllers/certificateController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createCertificate);
router.get('/', protect, getCertificates);

module.exports = router;
