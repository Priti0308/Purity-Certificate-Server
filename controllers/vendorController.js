const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new vendor
const registerVendor = async (req, res) => {
  const { businessName, name, mobile, password } = req.body;

  try {
    const existingVendor = await Vendor.findOne({ mobile });
    if (existingVendor) return res.status(400).json({ message: 'Vendor already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = await Vendor.create({
      businessName,
      name,
      mobile,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Vendor registered successfully', vendor: newVendor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login vendor
const loginVendor = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ mobile });
    if (!vendor) return res.status(400).json({ message: 'Invalid mobile number or password' });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid mobile number or password' });

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      vendor: {
        id: vendor._id,
        businessName: vendor.businessName,
        name: vendor.name,
        mobile: vendor.mobile,
        address: vendor.address,
        logo: vendor.logo,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// Create vendor (admin use)
const createVendor = async (req, res) => {
  const { businessName, name, mobile, password, address } = req.body;

  try {
    const existingVendor = await Vendor.findOne({ mobile });
    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = await Vendor.create({
      businessName,
      name,
      mobile,
      password: hashedPassword,
      address,
    });

    res.status(201).json({ message: 'Vendor created', vendor: newVendor });
  } catch (err) {
    console.error('Error in vendor creation:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all vendors (admin)
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Fetch error', error: err.message });
  }
};

// Update vendor profile
const updateVendorProfile = async (req, res) => {
  try {
    if (!req.vendor) {
      return res.status(401).json({ message: 'Please login to update profile' });
    }

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.businessName) updates.businessName = req.body.businessName;
    if (req.body.mobile) updates.mobile = req.body.mobile;
    if (req.body.address) updates.address = req.body.address;

    // Handle logo file if uploaded
    if (req.files && req.files.logoFile) {
      const logoFile = req.files.logoFile;
      const logoPath = `/uploads/logos/${Date.now()}-${logoFile.name}`;
      await logoFile.mv(`.${logoPath}`);
      updates.logo = logoPath;
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.vendor._id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      vendor: updatedVendor
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Profile update failed', 
      error: err.message 
    });
  }
};

// Delete vendor
const deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete error', error: err.message });
  }
};

// Approve vendor
const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json({ message: 'Vendor approved', vendor });
  } catch (err) {
    res.status(500).json({ message: 'Approval failed', error: err.message });
  }
};

// Reject vendor
const rejectVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.json({ message: 'Vendor rejected', vendor });
  } catch (err) {
    res.status(500).json({ message: 'Rejection failed', error: err.message });
  }
};

// Set vendor password (admin)
const setVendorPassword = async (req, res) => {
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true });
    res.json({ message: 'Password set successfully', vendor: updatedVendor });
  } catch (err) {
    res.status(500).json({ message: 'Password set error', error: err.message });
  }
};
module.exports = {
  registerVendor,
  loginVendor,
  createVendor,
  getAllVendors,
  updateVendorProfile,
  deleteVendor,
  approveVendor,
  rejectVendor,
  setVendorPassword
};