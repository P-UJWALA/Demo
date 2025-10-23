require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const fishRoutes = require('./routes/fishRoutes');
const qrRoutes = require('./routes/qrRoutes');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Your React frontend URL
  credentials: true
}));
app.use(express.json()); // body parser

// connect db
connectDB();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/fish', fishRoutes);
app.use('/api/qr', qrRoutes);

// basic health
app.get('/', (req, res) => res.send('Fish Supplychain Backend running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
