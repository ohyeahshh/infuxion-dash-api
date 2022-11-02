const express = require("express");
const router = express.Router();
const Order = require("../models/Order");



router.post("/order", async function register (req, res, next) {
    const {value ,images,length,sliderVal,name,email,contact,address,section,others,method,floor,
        date,postcode, city,description,orderstatus}= req.body;
    try {
        const order = await Order.create({
            value ,images,length,sliderVal,name,email,contact,address,section,others,method,floor,
                date,postcode, city,description, orderstatus
        });

        res.status(201).json({
            success: true,
            order:order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error:error.message,
        })
        
    }
}
)

// router.route("/login").post(login);

// router.route("/forgotpassword").post(forgotPassword);

// router.route("/passwordreset/:resetToken").put(resetPassword);

module.exports = router;