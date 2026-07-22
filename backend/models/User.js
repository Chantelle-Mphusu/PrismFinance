import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Your First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Your Last Name is required"],
  },
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  // ======================================
  // EMAIL VERIFICATION
  // ======================================
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  verificationTokenExpiry: {
    type: Date,
    default: null,
  },

  // ======================================
  // PASSWORD RESET
  // ======================================
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordTokenExpiry: {
    type: Date,
    default: null,
  },

  // ======================================
  // 2FA
  // ======================================
  twoFactorCode: {
    type: String,
    default: null,
  },
  twoFactorCodeExpiry: {
    type: Date,
    default: null,
  },

  // ======================================
  // SETTINGS
  // ======================================
  settings: {
    currency: {
      type: String,
      default: "BWP",
    },
    language: {
      type: String,
      default: "English",
    },
    notifications: {
      budgetAlerts: {
        type: Boolean,
        default: true,
      },
      weeklyReports: {
        type: Boolean,
        default: true,
      },
      transactionNotifications: {
        type: Boolean,
        default: true,
      },
      securityUpdates: {
        type: Boolean,
        default: true,
      },
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
  },

  loginTimestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);