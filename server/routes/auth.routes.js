const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");

const {
    registerUser
} = require("../controllers/auth.controller");

const router = express.Router();

router.post(
    "/register",
    asyncHandler(registerUser)
);

module.exports = router;