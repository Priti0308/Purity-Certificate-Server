const express = require('express');
const router = express.Router();
const {
  registerVendor,
  loginVendor,
  createVendor,
  getAllVendors,
  updateVendor,
  deleteVendor,
  approveVendor,
  rejectVendor,
  setVendorPassword,
} = require('../controllers/vendorController');

// Vendor Auth
router.post('/register', registerVendor);
router.post('/login', loginVendor);

// Admin CRUD
router.post('/', createVendor);
router.get('/', getAllVendors);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);
router.put('/:id/approve', approveVendor);
router.put('/:id/reject', rejectVendor);
router.put('/:id/set-password', setVendorPassword);

module.exports = router; 
