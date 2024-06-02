
const express = require("express");
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require("./routes/firmRouter");
const productRoute = require("./routes/productRoutes");
const path = require('path')

const app = express() ;

const PORT = process.env.PORT || 4000 ;

dotEnv.config()

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connnected Succesfully!"))
.catch((e) => console.log(e))

app.use(bodyParser.json())
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use("/product", productRoute);
app.use('/uploads', express.static('uploads'));


app.listen(PORT, () => {
    console.log(`server started and running at ${PORT}`)
});

app.use("/", (req, res) => {
    res.send("Welcome to Node")
})
