const OTP = require('../models/OTP.model');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOTP = async (req, res) => {
  const { email } = req.body;
  
  // Check if credentials are still placeholders
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
    return res.status(400).json({ 
      message: 'SMTP credentials not configured. Please update your backend/.env file with a real Gmail address and App Password.' 
    });
  }

  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to DB
    await OTP.deleteMany({ email }); 
    await OTP.create({ email, otp: otpCode });

    // Send Real Email via Gmail
    const mailOptions = {
      from: `"Horizon Auth" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Verification Code: ${otpCode}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; max-width: 500px; margin: auto; border: 1px solid #1e293b;">
          <h2 style="color: #8b5cf6; margin-bottom: 20px; font-size: 24px;">Verify your Email</h2>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">Welcome to Horizon! Use the verification code below to complete your registration. It will expire in 5 minutes.</p>
          <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; text-align: center; margin: 30px 0; border: 1px solid #334155;">
            <h1 style="color: #ffffff; letter-spacing: 8px; font-size: 36px; margin: 0;">${otpCode}</h1>
          </div>
          <p style="color: #64748b; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully to your Gmail' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    res.status(500).json({ message: 'Email service error. Ensure you use a Gmail "App Password", not your regular password.' });
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
