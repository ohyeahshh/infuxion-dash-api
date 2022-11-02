const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Controllers
// const {
//   login,
//   register,
//   forgotPassword,
//   resetPassword,
// } = require("../controllers/Auth");


router.post("/register", async function register (req, res, next) {
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
)

// router.route("/login").post(login);

// router.route("/forgotpassword").post(forgotPassword);

// router.route("/passwordreset/:resetToken").put(resetPassword);

module.exports = router;