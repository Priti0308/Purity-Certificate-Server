const express = require('express');
const multer = require('multer');
const protectVendor = require('../middleware/authMiddleware');
const {
  loginVendor,
  createVendor,
  getAllVendors,
  deleteVendor,
  approveVendor,
  rejectVendor,
  setVendorPassword,
  updateVendorProfile,
  updateVendorByAdmin
} = require('../controllers/vendorController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Vendor Routes
router.post('/login', loginVendor);
router.put('/profile', protectVendor, updateVendorProfile);

// Admin Routes
router.post('/', createVendor);
router.get('/', getAllVendors);
router.delete('/:id', deleteVendor);
router.put('/:id/approve', approveVendor);
router.put('/:id/reject', rejectVendor);
router.put('/:id/set-password', setVendorPassword);
router.put('/:id', updateVendorByAdmin);

module.exports = router;
