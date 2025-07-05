const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Vendor
exports.registerVendor = async (req, res) => {
  const { name, mobile, businessName, password } = req.body;

  try {
    const existingVendor = await Vendor.findOne({ name });
    if (existingVendor) return res.status(400).json({ message: 'Vendor already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = new Vendor({
      name,
      mobile,
      businessName,
      password: hashedPassword,
      status: 'pending',
    });

    await vendor.save();
    res.status(201).json({ message: 'Vendor registered successfully', vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login Vendor
exports.loginVendor = async (req, res) => {
  const { name, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ name });
    if (!vendor) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      vendor: {
        id: vendor._id,
        name: vendor.name,
        mobile: vendor.mobile,
        businessName: vendor.businessName,
        status: vendor.status,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Vendor (Admin)
exports.createVendor = async (req, res) => {
  const { name, mobile, businessName, password } = req.body;
  try {
    const existing = await Vendor.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Vendor already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = new Vendor({ name, mobile, businessName, password: hashedPassword, status: 'pending' });
    await vendor.save();
    res.status(201).json({ message: 'Vendor created successfully', vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Vendor
exports.updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Vendor
exports.deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Vendor deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve Vendor
exports.approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject Vendor
exports.rejectVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.setVendorPassword = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true });
    res.status(200).json({ message: 'Password updated successfully', vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};