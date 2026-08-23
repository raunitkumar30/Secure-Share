const bcrypt =require("bcryptjs");
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

module.exports = {
    registerUser
};
