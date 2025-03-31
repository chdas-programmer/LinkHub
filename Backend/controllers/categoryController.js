import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createToken from "../utils/createToken.js";
import db from "../db/config.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });



// Create a new category
const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    await db.promise().query(
        "INSERT INTO Categories (name, description) VALUES (?, ?)",
        [name, description]
    );

    res.status(201).json({ message: "Category created successfully" });
});

// Get all categories
const getCategories = asyncHandler(async (req, res) => {
    const [categories] = await db.promise().query("SELECT * FROM Categories");
    res.status(200).json(categories);
});

// Get a category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const [category] = await db.promise().query("SELECT * FROM Categories WHERE id = ?", [id]);

    if (category.length === 0) {
        return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category[0]);
});

// Update a category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const [result] = await db.promise().query(
        "UPDATE Categories SET name = ?, description = ? WHERE id = ?",
        [name, description, id]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully" });
});

// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const [result] = await db.promise().query("DELETE FROM Categories WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
});

export { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };
