
const Vendor = require('../models/Vendor')
const dotEnv = require('dotenv')
const jwt = require('jsonwebtoken')

dotEnv.config()

const secretkey = process.env.whatIsYourName

const verifyToken = async (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({error: "Token is required"})
    }
    try {
        const decoded = jwt.verify(token, secretkey)
        const vendor = await Vendor.findById(decoded.vendorId) ;
        if (!vendor) {
            return res.status(404).json({error: "vendor not found"})
        }

        req.vendorId = vendor._id

        next()
    }catch (error) {
        console.error(error)
        return res.status(500).json({error: "Invalid Token"})
    }
}


module.exports = verifyToken