import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createToken from "../utils/createToken.js";
import db from "../db/config.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });







// Create a link
const createLink = asyncHandler(async (req, res) => {
    const { name,url, category } = req.body;


    const [categoryResponse]=await db.promise().query("Select id from Categories where name=?",[category]);
    const added_by = req.user.id; 
    // console.log(req.user);
    console.log(req.user.id);
    const admin=req.user.isAdmin;
    const category_id=categoryResponse[0].id;
    

    
    const isApproved = admin ? 1 : 0; // Auto-approved if admin
    
    await db.promise().query(
        "INSERT INTO Links (name,url, category_id, added_by, isApproved) VALUES (?,?, ?, ?, ?)",
        [name,url, category_id, added_by, isApproved]
    );
    res.status(201).json({ message: "Link created successfully", isApproved });
});

// Read all links
const getApprovedLinks = asyncHandler(async (req, res) => {
    const [links] = await db.promise().query(`
        SELECT 
            Links.id, 
            Links.name, 
            Links.url, 
            Categories.name AS category_name, 
            Links.added_by, 
            Links.isApproved  -- Ensure correct column name
        FROM Links
        INNER JOIN Categories ON Links.category_id = Categories.id
        WHERE Links.isApproved = 1
    `);

    res.json(links);
});
const getLinks = asyncHandler(async (req, res) => {
    const [links] = await db.promise().query(`
        SELECT 
            Links.id, 
            Links.name, 
            Links.url, 
            Categories.name AS category_name, 
            Links.added_by, 
            Links.isApproved  -- Ensure correct column name
        FROM Links
        INNER JOIN Categories ON Links.category_id = Categories.id
        
    `);

    res.json(links);
});

// Read a specific link
const getLinkById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const [[link]] = await db.promise().query("SELECT * FROM Links WHERE id = ? AND isApproved = 1", [id]);
    if (!link) return res.status(404).json({ message: "Link not found" });
    res.json(link);
});

// Update a link
const updateLinkById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name,url, category,isApproved } = req.body;
    const [categoryResponse]=await db.promise().query("Select id from Categories where name=?",[category]);
    const category_id=categoryResponse[0].id;
    await db.promise().query("UPDATE Links SET name=?,url = ?, category_id = ?,isApproved=? WHERE id = ?", [name,url, category_id,isApproved, id]);
    res.json({ message: "Link updated successfully." });
});

// Delete a link
const deleteLinkById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await db.promise().query("DELETE FROM Links WHERE id = ?", [id]);
    res.json({ message: "Link deleted successfully" });
});

// Admin approves a link
const verifyLink = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const admin_id = req.user.id; 
    const [[admin]] = await db.promise().query("SELECT isAdmin FROM Users WHERE id = ?", [admin_id]);
    if (!admin || !admin.isAdmin) return res.status(403).json({ message: "Only admins can verify links" });
    
    await db.promise().query("UPDATE Links SET isApproved = 1 WHERE id = ?", [id]);
    res.json({ message: "Link approved successfully" });
});

export { createLink, getApprovedLinks,getLinks, getLinkById, updateLinkById, deleteLinkById, verifyLink };
