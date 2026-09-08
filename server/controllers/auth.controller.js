const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    //basic validation
    if(!name || !email || !password) {
        return res.status(400).json({
            message:"Name,email and password are required"
        });
    }

    //check if user already exists
    const existingUser = await User.findOne({ email });
    
    if(existingUser) {
        return res.status(409).json({
            message:"User with this email already exists"
        });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        message:"User registered successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    // Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    // Create JWT
    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.status(200).json({
        message: "Login successful",
        token
    });
};

module.exports = {
    registerUser,
    loginUser
};
