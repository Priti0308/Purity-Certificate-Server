const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
  limits: { fileSize: 500 * 1024 }, // Limit file size to 500KB
  storage: multer.memoryStorage(),
});

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
// const Vendor = require('../models/Vendor');

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

// ✅ Vendor Self Profile (PUT update with logo upload)
router.put('/me', protectVendor, upload.single('logo'), async (req, res) => {
  try {
    const updates = req.body;

    // If a file is uploaded, convert it to base64 and include in the update
    if (req.file) {
      updates.logo = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const updated = await Vendor.findByIdAndUpdate(req.vendor._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json(updated);
  } catch (err) {
    console.error('Update error:', err.message);
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
