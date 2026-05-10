// backend/models/Product.js
const mongoose = require('mongoose');

// Dynamic schema - accepts any fields from CSV directly
const ProductSchema = new mongoose.Schema({}, {
    strict: false, // Allows any fields from CSV
    timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Product', ProductSchema);
