import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../modules/User.js";

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password",
  },
});

// ==================== FORGOT PASSWORD ====================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;


  try {
    // Find user by email
    const user = await User.findOne({ Email: email });

    if (!user) {
      // For security, don't reveal if email exists
      return res.json({
        success: true,
        message: "If an account exists with this email, a password reset link has been sent."
      });
    }

    // Create reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      {
        userId: user._id,
        email: user.Email,
        type: "password_reset",
      },
      process.env.JWT_SECRET || "kunal@123",
      { expiresIn: "1h" }
    );

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

    // Email content
    const mailOptions = {
      from: `"Blood Donation System" <${process.env.EMAIL_FROM || "noreply@blooddonation.com"}>`,
      to: email,
      subject: "Password Reset Request - Blood Donation System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Blood Donation System</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Password Reset Request</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #111827; margin-top: 0;">Hello ${user.Name},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              You recently requested to reset your password for your Blood Donation System account. 
              Click the button below to reset it:
            </p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetLink}" 
                 style="background: #dc2626; color: white; padding: 14px 32px; 
                        text-decoration: none; border-radius: 6px; font-weight: bold;
                        display: inline-block;">
                Reset Your Password
              </a>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              If the button doesn't work, copy and paste the following link into your browser:
            </p>
            
            <div style="background: #f3f4f6; padding: 12px; border-radius: 4px; 
                       margin: 15px 0; word-break: break-all;">
              <code style="color: #1f2937;">${resetLink}</code>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              This password reset link is only valid for the next 
              <span style="color: #dc2626; font-weight: bold;">1 hour</span>.
            </p>
            
            <p style="color: #4b5563; line-height: 1.6;">
              If you did not request a password reset, please ignore this email or 
              contact support if you have concerns.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Need help? Contact our support team at support@blooddonation.com
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
                This is an automated message, please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);


    res.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent."
    });

  } catch (error) {
    console.error("❌ Forgot password error:", error);

    // Handle email errors gracefully - Report actual failure to user
    if (error.code === "EAUTH" || error.code === "EENVELOPE") {
      console.error("⚠️  Email configuration error.");
      return res.status(500).json({
        success: false,
        message: "Failed to send email. Invalid email credentials (Username/Password)."
      });
    }

    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
});

// ==================== RESET PASSWORD ====================
router.post("/reset-password", async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  try {
    // Validate passwords
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "kunal@123");

    // Check if token is for password reset
    if (decoded.type !== "password_reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token"
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.Password = hashedPassword;
    await user.save();


    res.json({
      success: true,
      message: "Password has been reset successfully. You can now login with your new password."
    });

  } catch (error) {
    console.error("❌ Reset password error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Reset link has expired. Please request a new one."
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid or corrupted reset link."
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
});

// ==================== VERIFY TOKEN ====================
router.post("/verify-reset-token", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "kunal@123");

    // Check if token is for password reset
    if (decoded.type !== "password_reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token"
      });
    }

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Token is valid",
      email: decoded.email
    });

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Reset link has expired"
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset link"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

export default router;
