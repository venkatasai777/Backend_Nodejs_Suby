

const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
    try {
        const {firmName, area, category, region , offer} = req.body


        const image = req.file ? req.file.filename : undefined;


        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            res.status(404).json({message: "Vendor Not Found"})
        }else {
            const isFirmAlreadyExists = vendor.firm.find(element => element.firmName === firmName);
            if (isFirmAlreadyExists) {
                return res.status(401).json({message: "Firm Already exists"})
            }
            const firm = new Firm({
                firmName, area, category, region , offer, image, vendor: vendor._id
            })
            const savedFirm = await firm.save();
            vendor.firm.push(savedFirm)
    
            await vendor.save()
    
            return res.status(200).json({message: "Firm added successfully"});
        }
    }catch(error) {
        console.error(error) ;
        res.status(500).json("Internal server error")
    }
    
}


const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const deleteFirm = await Firm.findByIdAndDelete(firmId) ;
        if (!deleteFirm) {
            return res.status(404).json({error : "No Firm Found"});
        }
        
    }catch(error) {
            console.error(error)
            res.status(500).json({error : "Internal server Error"});
    }
}

module.exports = {addFirm: [upload.single('image'), addFirm], deleteFirmById}