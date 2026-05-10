// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
// Middleware
app.use(express.json()); // Allows parsing JSON from frontend
app.use(cors());
// Database Connection
mongoose.connect('mongodb://localhost:27017/rpharmacy')
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.log(err));
// Simple Route to test
app.get('/', (req, res) => {
    res.send('Backend is Working!');
});
// Import Admin Routes (We will create this next)
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Import Product Routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));