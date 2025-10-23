const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ethers } = require('ethers'); // ADD THIS for blockchain wallet creation

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Helper function to create blockchain wallet
const createBlockchainWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey
  };
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    
    // CREATE BLOCKCHAIN WALLET
    const wallet = createBlockchainWallet();
    
    // SAVE USER WITH BLOCKCHAIN DATA
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role,
      blockchainAddress: wallet.address,
      privateKey: wallet.privateKey // In production, encrypt this!
    });
    
    // TODO: Register user on blockchain smart contract (if needed)
    // await registerUserOnBlockchain(user._id, wallet.address, role);
    
    res.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        blockchainAddress: user.blockchainAddress // RETURN BLOCKCHAIN ADDRESS
      }, 
      token: genToken(user._id) 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    
    res.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        blockchainAddress: user.blockchainAddress // RETURN BLOCKCHAIN ADDRESS
      }, 
      token: genToken(user._id) 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  res.json(req.user);
};