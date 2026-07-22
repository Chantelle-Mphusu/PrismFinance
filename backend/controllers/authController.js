import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createSecretToken } from '../utils/createSecretToken.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  send2FACode,
  sendNewLoginEmail
} from '../utils/emailService.js';

function checkIfAdmin(email) {
  const adminEmails = ["mphusuc@btc.bw", 'chantellemphusu@gmail.com', "testingport@test.com"];
  return adminEmails.includes(email);
}

// ======================================
// SIGNUP
// ======================================
const Signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const isAdmin = checkIfAdmin(email);
    const role = isAdmin ? "admin" : "user";

    // ── Verification token ──
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      verificationTokenExpiry,
    });

    await sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      message: "User signed up successfully. Please check your email to verify your account.",
      success: true,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

// ======================================
// VERIFY EMAIL
// ======================================
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });

  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({ message: "Server error during email verification" });
  }
};

// ======================================
// LOGIN
// ======================================
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // ── Check verification ──
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        isVerified: false,
      });
    }

    // ── 2FA check ──
    if (user.settings?.twoFactorEnabled) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await User.findByIdAndUpdate(user._id, {
        twoFactorCode: code,
        twoFactorCodeExpiry: codeExpiry,
      });

      await send2FACode(email, code);

      return res.status(200).json({
        success: true,
        twoFactorRequired: true,
        userId: user._id,
        message: "A login code has been sent to your email.",
      });
    }

    // ── Normal login ──
    const token = createSecretToken(user._id, user.role, user.email);

    await User.findByIdAndUpdate(user._id, { loginTimestamp: new Date() });


    if (user.settings?.notifications?.securityUpdates) {
  await sendNewLoginEmail(user.email, user.firstName);
}

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: `User logged in successfully as ${user.role}`,
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// ======================================
// VERIFY 2FA CODE
// ======================================
const verify2FA = async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ message: "User ID and code are required" });
    }

    const user = await User.findOne({
      _id: userId,
      twoFactorCode: code,
      twoFactorCodeExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    await User.findByIdAndUpdate(user._id, {
      twoFactorCode: null,
      twoFactorCodeExpiry: null,
      loginTimestamp: new Date(),
    });

    if (user.settings?.notifications?.securityUpdates) {
      await sendNewLoginEmail(user.email, user.firstName);
    }

    const token = createSecretToken(user._id, user.role, user.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("2FA verify error:", error);
    return res.status(500).json({ message: "Server error during 2FA verification" });
  }
};

// ======================================
// FORGOT PASSWORD
// ======================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordTokenExpiry: resetTokenExpiry,
    });

    await sendPasswordResetEmail(email, resetToken);

    return res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error during password reset request" });
  }
};

// ======================================
// RESET PASSWORD
// ======================================
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error during password reset" });
  }
};

// ======================================
// GET ME
// ======================================
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error("GET /me error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ======================================
// LOGOUT
// ======================================
const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "lax",
      secure: false,
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Server error during logout" });
  }
};

export { Login, Signup, getMe, logout, verifyEmail, verify2FA, forgotPassword, resetPassword };