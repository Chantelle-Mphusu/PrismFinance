import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendPasswordChangedEmail } from "../utils/emailService.js";
// ======================================
// GET SETTINGS
// ======================================
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE PROFILE SETTINGS
// ======================================
const updateSettings = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      currency,
      language,
      notifications,
      twoFactorEnabled,
    } = req.body;

    // const updatedUser = await User.findByIdAndUpdate(
    //   req.user.id,
    //   {
    //     firstName,
    //     lastName,
    //     email,

    //     settings: {
    //       currency,
    //       language,
    //       notifications,
    //       twoFactorEnabled,
    //     },
    //   },
    //   {
    //     new: true,
    //     runValidators: true,
    //   }
    // ).select("-password");

    //NEW

    const updatedUser = await User.findByIdAndUpdate(
  req.user.id,
  {
    firstName,
    lastName,
    email,
    "settings.currency": currency,
    "settings.language": language,
    "settings.notifications": notifications,
    "settings.twoFactorEnabled": twoFactorEnabled,
  },
  { new: true, runValidators: true }
).select("-password");
    res.status(200).json({
      message: "Settings updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update settings",
      error: error.message,
    });
  }
};

// ======================================
// CHANGE PASSWORD
// ======================================
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // const salt = await bcrypt.genSalt(10);

    // user.password = await bcrypt.hash(
    //   newPassword,
    //   salt
    // );

    // await user.save();

    //NEW
    const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(newPassword, salt);

await User.findByIdAndUpdate(
  req.user._id,
  { password: hashedPassword },
  { runValidators: false }
);


if (req.user.settings?.notifications?.securityUpdates) {
  await sendPasswordChangedEmail(req.user.email);
}
    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to change password",
      error: error.message,
    });
  }
};

export {changePassword, getSettings, updateSettings}

//Note myself to include email verification within this and the auth 