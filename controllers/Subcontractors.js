const Order = require("../models/Order");

exports.order = async (req, res, next) => {
    const {value ,images,length,sliderVal,name,email,contact,address,section,others,method,floor,
        date,postcode, city,description,orderstatus}= req.body;

    try {
        const order = await Order.create({
            value ,images,length,sliderVal,name,email,contact,address,section,others,method,floor,
            date,postcode, city,description,orderstatus
        });

        res.status(201).json({
            success: true,
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error:error.message,
        })
        
    }
}