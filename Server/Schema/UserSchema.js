import mongoose from "mongoose";
import "mongoose-type-email";

const userprofileSchema = new mongoose.Schema({
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
    enum: ["user", "member", "admin"],
    default: "user",
    required: true,
  },
  f_name: { type: String, trim: true },
  l_name: { type: String, trim: true },
  dob: { type: Date },
  p_number: {
    type: String,
    match: [/^\d{10}$/, "Please Provide a 10 digit number "],
    trim: true,
  },
  college: {
    type: String,
    enum: ["NSUT"],
    default: "NSUT",
    trim: true,
  },
  batch_start: { type: Number, min: 2000, max: 2100 },
  batch_end: { type: Number, min: 2000, max: 2100 },
  roll_no: {
    type: String,
  
    match: [
      /^\d{4}-[A-Za-z]{3}-\d{4}$/,
      "Roll-No should be in the format 2025-XYZ-1234",
    ],
    trim: true,
  },
  branch: { type: String, trim: true },
  specialization: { type: String, trim: true },
  github: { type: String, trim: true },
  linkdin: { type: String, trim: true },
  // profile_pic:{type:String,required:true},
  society: [
    {
      SocietyId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      department: {
        type: String,
      },
      status: {
        type: String,
        enum: ["In-Progress", "Rejected", "Approved"],
        default: "In-Progress",
      },
    },
  ],
});

export const userProfile = mongoose.model("userProfile", userprofileSchema);
