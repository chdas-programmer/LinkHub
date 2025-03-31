import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createToken from "../utils/createToken.js";
import db from "../db/config.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });// Import MySQL connection pool

const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ( !email || !password ) {
        return res.status(400).json({ message: "All fields are required." });
    }


    // Check if user already exists
    const [existingUser] = await db.promise().query("SELECT * FROM Users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    try {

      
        const [result] = await db.promise().query(
            "INSERT INTO Users (name, email, password_hash) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );
        console.log(result);

        // Generate JWT token
        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({
            id: result.insertId,
            name,
            email,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating employee", error });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log("Email:", email);
    console.log("Password:", password);

    try {
        // Fetch user from MySQL database
        const [users] = await db.promise().query(
            "SELECT id, name, email, password_hash FROM Users WHERE email = ?",
            [email]
        );

        // Check if user exists
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingUser = users[0];

        // Compare entered password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        createToken(res, existingUser.id);

        console.log("Login successfully");

        // Send response
        res.status(200).json({
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            verification:existingUser.verification
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
      httyOnly: true,
      expires: new Date(0),
    });
  
    res.status(200).json({ message: "Logged out successfully" });
  });



  
  // Get all users (MySQL version)
  const getAllUser = asyncHandler(async (req, res) => {
      try {
          // Fetch all employees from the database
          const [users] = await db.promise().query("SELECT id, name, email,isAdmin,isVerified FROM Users");
        
          res.status(200).json(users);
      } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ message: "Internal Server Error" });
      }
  });

  
//It will be needed in adminController
  const verifyUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);     // ✅ Corrected Syntax

    try {
       
        const [r]=await db.promise().query("SELECT * from Users where id = ?",
            [id]
        )
        if(!r[0].isAdmin){
            return res.status(400).json({message:"Not an Admin"});
        }
        
        const [result] = await db.promise().query(
            "UPDATE Users SET isVerified = 1 WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Admin verified successfully" });
    } catch (error) {
        console.error("Error verifying Admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// Get Current User Profile (MySQL version)
const getCurrentUserById = asyncHandler(async (req, res) => {
    const {id} = req.params; 
    console.log(id);
    // Get the user ID from `req.user`

    try {
        // Fetch user from MySQL by ID
        const [rows] = await db.promise().query(
            "SELECT id, name , email,isAdmin,isVerified FROM Users WHERE id = ?",
            [id]
        );

        

       


        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];

        res.status(200).json({
            user:user
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const id = req.userId; 
    console.log(id);
    // Get the user ID from `req.user`

    try {
        // Fetch user from MySQL by ID
        const [rows] = await db.promise().query(
            "SELECT id,name,email,isAdmin,isVerified FROM Users WHERE id = ?",
            [id]
        );

        



        // if (rows.length === 0) {
        //     return res.status(404).json({ message: "User not found" });
        // }

        const user = rows[0];

        res.status(200).json({
            user:user,
            
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// Update User by ID (MySQL version)
const updateUserById = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get user ID from URL params
    const { name, email,isAdmin,isVerified } = req.body; // Get new data from request body

    try {
        // Check if user exists
        const [existingUser] = await db.promise().query("SELECT * FROM Users WHERE id = ?", [id]);

        if (existingUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user with new values or keep existing values if not provided
        const updatedName = name || existingUser[0].name;
        const updatedEmail = email || existingUser[0].email;
        const updatedAdmin = isAdmin !== undefined ? isAdmin : existingUser[0].isAdmin;
        const updatedVerified = isVerified !== undefined ? isVerified : existingUser[0].isVerified;
        
        

        

        // Update user data in MySQL
        await db.promise().query(
            "UPDATE Users SET name = ?, email = ?, isAdmin=?,isVerified=? WHERE id = ?",
            [updatedName, updatedEmail,updatedAdmin,updatedVerified, id]
        );

        // Fetch updated user
        const [updatedUser] = await db.promise().query(
            "SELECT id, name, email, isAdmin,isVerified FROM Users WHERE id = ?", 
            [id]
        );

        

        res.status(200).json({
            updatedUser: updatedUser[0],  
            // Changed key to 'department' for clarity
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const deleteUserById = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the user ID from the URL params
  
    try {
      // Check if user exists
      const [existingUser] = await db.promise().query("SELECT * FROM Users WHERE id = ?", [id]);
  
      if (existingUser.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the user is an admin (assuming 'role' is stored in the employee table)
      if (existingUser[0].isAdmin && existingUser[0].isVerified ) {
        return res.status(400).json({ message: "Cannot delete admin user" });
      }
  
      // Delete the user
      await db.promise().query("DELETE FROM Users WHERE id = ?", [id]);
  
      res.json({ message: "User removed" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  






  
  
  


export { getCurrentUserById,verifyUser,loginUser,createUser,logoutCurrentUser,getAllUser,getCurrentUserProfile,updateUserById ,deleteUserById};



