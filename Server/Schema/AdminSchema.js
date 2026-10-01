import mongoose from "mongoose";
import "mongoose-type-email";

const adminSchema = new mongoose.Schema({
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
    immutable: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    default: "admin",
    immutable: true,
  },
  f_name: { type: String, trim: true },
  l_name: { type: String, trim: true },
});

export const Admin = mongoose.model("Admin", adminSchema);
