import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
    },

    limit: {
      type: Number,
      required: [true, "Budget limit is required"],
    },

    period: {
      type: String,
      enum: ["monthly"],
      default: "monthly",
    },

    // ── Tracks which month this budget is for ──
    month: {
      type: Number, // 0-11
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    // ── Tracks if the alert has already been sent ──
    alertSentAt50: {
      type: Boolean,
      default: false,
    },

    alertSentAt100: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicate budgets for same category/month/year 
budgetSchema.index(
  { user: true, category: true, month: true, year: true },
  { unique: true }
);

export default mongoose.model("Budget", budgetSchema);