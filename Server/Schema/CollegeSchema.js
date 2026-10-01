import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  city: {
    type: String,
    trim: true,
    default: "",
  },
});

export const College = mongoose.model("College", collegeSchema);
