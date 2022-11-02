const User = require("../models/User");

exports.register = async (req, res, next) => {
    const {name, email, password}= req.body;
    try {
        const user = await User.create({
            name, email, password
        });

        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error:error.message,
        })
        
    }
}