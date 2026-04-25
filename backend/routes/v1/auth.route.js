const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin } = require('../../controllers/auth.controller');
const { sendOTP, verifyOTP } = require('../../controllers/otp.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
