import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Transaction title is required"],
      trim: true,
      maxlength: 100,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

//compound index for queries
transactionSchema.index({ user: 1, date: -1 });

export default mongoose.model("Transaction", transactionSchema);