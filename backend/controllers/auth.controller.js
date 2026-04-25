const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const user = await User.create({ 
      name, 
      email, 
      passwordHash, 
      isEmailVerified: true // Automatically set to true since we removed OTP
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { sub: googleId, email, name, picture } = ticket.getPayload();
    
    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        isEmailVerified: true,
      });
    } else if (!user.googleId) {
      // Link Google account to existing email user
      user.googleId = googleId;
      user.isEmailVerified = true;
      await user.save();
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: 'Google login failed: ' + error.message });
  }
};

module.exports = { registerUser, loginUser, googleLogin };
