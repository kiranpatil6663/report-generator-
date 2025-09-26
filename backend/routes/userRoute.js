import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import validator from 'validator'
import path from 'path'

const router=express.Router();

// path to user.json file
const userFilePath = path.join(process.cwd(), 'users.json');

//helper function to read users from JSON file
const readUsers=()=>{
    try{
        if(!fs.existsSync(userFilePath)){
            return [];
        }
        const data=fs.readFileSync(userFilePath,'utf8');
        return JSON.parse(data);
    }catch(error){
        console.log(error)
        return [];
    }
}

// helper function to write user from JSON file
const writeUsers=(users)=>{
    fs.writeFileSync(userFilePath,JSON.stringify(users,null,2));
}


/**
 * API for user registration
 * Expects: { name, email, password } in req.body
 * Returns: { success, token } or error message
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check for missing details
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "invalid email" });
        }

        // Check password length (should be at least 8 characters)
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" });
        }

        // Read existing users
        const users = readUsers();

        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Prepare user data for saving
        const userData = {
            id: Date.now(), // Simple ID generation
            name,
            email,
            password: hashedPassword
        };

        // Add new user to users array
        users.push(userData);
        
        // Save to file
        writeUsers(users);

        // Generate JWT token for the user
        const token = jwt.sign({ id: userData.id }, process.env.JWT_SECRET);

        res.json({ success: true, token });

    } catch (error) {
        // Handle errors
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * API for user login
 * Expects: { email, password } in req.body
 * Returns: { success, token } or error message
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Read users from file
        const users = readUsers();

        // Find user by email
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.json({ success: false, message: 'user not found' });
        }

        // Compare provided password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            // Generate JWT token if password matches
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        // Handle errors
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router