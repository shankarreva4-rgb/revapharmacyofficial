// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Product = require('../models/Product');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// CSV Upload Endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const products = [];
        const filePath = req.file.path;

        // Read CSV file
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Each row becomes a product - no hardcoded fields!
                products.push(row);
            })
            .on('end', async () => {
                try {
                    // Bulk insert all products
                    await Product.insertMany(products);

                    // Delete temporary file
                    fs.unlinkSync(filePath);

                    res.status(201).json({
                        message: `Successfully uploaded ${products.length} products!`,
                        count: products.length
                    });
                } catch (error) {
                    // Delete file even if insert fails
                    fs.unlinkSync(filePath);
                    res.status(500).json({ message: "Error saving products", error: error.message });
                }
            })
            .on('error', (error) => {
                // Delete file on read error
                fs.unlinkSync(filePath);
                res.status(500).json({ message: "Error reading CSV", error: error.message });
            });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// Get Products by Category
router.get('/category/:categoryName', async (req, res) => {
    try {
        const { categoryName } = req.params;

        // Find products where Category field matches (handle both structures)
        const products = await Product.find({
            $or: [
                { Category: categoryName },           // Direct field
                { 'data.Category': categoryName }     // Nested under data
            ]
        });


        res.status(200).json({
            products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
