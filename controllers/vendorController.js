const dotEnv = require('dotenv');
const Vendor = require('../models/Vendor');
const jwt  = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


dotEnv.config()

const secretkey = process.env.whatIsYourName

const vendorRegister = async (req, res) => {
    const {username, email, password} = req.body
    try {
        const vendorEmail = await Vendor.findOne({"email": email});
        if (vendorEmail) {
            return res.status(400).json("Email Already Exists")
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });
        await newVendor.save();
        res.status(201).json({message: "Vendor Registered sucessfully"});
        console.log("registered");
    }catch(error) {
        
        console.error(error)
        res.status(501).json({error: "Internal server Error"})
    }

}

const vendorLogin = async (req, res) => {
    const {email, password } = req.body
    try {
        const vendor = await Vendor.findOne({email}) ;
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({error: "Invalid username or Password"});
        }

        const token = jwt.sign({vendorId: vendor._id}, secretkey, {expiresIn: "90h"})

        res.status(200).json({success: "Login Successful", token})
        console.log(token)

    }catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server error"})
    }
 }

 const getAllvendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        return res.json({vendors})
    }catch(error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
 }

 const getVendorById = async (req, res) => {
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({error: "vendor not found"});
        }
        res.status(200).json({vendor});
    }catch(error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"}) ;
    }
 }

module.exports =  {vendorRegister, vendorLogin, getAllvendors, getVendorById}