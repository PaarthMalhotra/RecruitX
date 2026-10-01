import mongoose from "mongoose";
import "mongoose-type-email";

const memberSchema = new mongoose.Schema({
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
    default: "member",
    immutable: true,
  },
  f_name: { type: String, trim: true },
  l_name: { type: String, trim: true },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  position: {
    type: String,
    trim: true,
    default: "",
  },
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society",
    default: null,
  },
});

export const Member = mongoose.model("Member", memberSchema);
