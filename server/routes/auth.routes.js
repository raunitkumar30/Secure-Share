const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/auth.middleware");

const {
    registerUser,
    loginUser
} = require("../controllers/auth.controller");

const router = express.Router();

router.get(
    "/me",
    protect,
    (req, res) => {
        res.json({
            message: "Authentication successful",
            user: req.user
        });
    }
);

router.post(
    "/register",
    asyncHandler(registerUser)
);

router.post(
    "/login",
    asyncHandler(loginUser)
);

module.exports = router;