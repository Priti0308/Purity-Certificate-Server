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

const protectVendor = require('../middleware/authMiddleware');
const Vendor = require('../models/Vendor');

// 📌 Vendor Auth
router.post('/register', registerVendor);
router.post('/login', loginVendor);

// ✅ Vendor Self Profile (GET)
router.get('/me', protectVendor, async (req, res) => {
  try {
    res.json(req.vendor); // populated by authMiddleware
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// ✅ Vendor Self Profile (PUT update)
router.put('/me', protectVendor, async (req, res) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(req.vendor._id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

// ✅ Admin CRUD Routes
router.post('/', createVendor);
router.get('/', getAllVendors);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);
router.put('/:id/approve', approveVendor);
router.put('/:id/reject', rejectVendor);
router.put('/:id/set-password', setVendorPassword);

module.exports = router;
