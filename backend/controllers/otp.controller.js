const OTP = require('../models/OTP.model');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
});

const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to DB
    await OTP.deleteMany({ email }); // Clear previous
    await OTP.create({ email, otp: otpCode });

    // Send Email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your Horizon Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Verify your account</h2>
          <p>Use the following code to complete your registration:</p>
          <h1 style="color: #6d28d9; letter-spacing: 5px;">${otpCode}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Check SMTP settings.' });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    res.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendOTP, verifyOTP };
