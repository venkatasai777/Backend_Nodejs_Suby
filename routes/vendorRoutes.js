const vendorController = require('../controllers/vendorController');
const express = require('express');

const router = express.Router();
const {vendorRegister, vendorLogin, getAllvendors, getVendorById} =  vendorController

router.post('/register',  vendorRegister);
router.post('/login', vendorLogin);

router.get('/all-vendors', getAllvendors);
router.get('/single-vendor/:id', getVendorById)

module.exports = router;