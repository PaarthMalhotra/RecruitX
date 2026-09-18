import mongoose from "mongoose";

const societySchema = new mongoose.Schema({
  userId:{type:mongoose.Types.ObjectId, required:true},
  name: { type: String, required: true, trim: true },
  college: {
    type: String,
    enum: ["NSUT"],
    default: "NSUT",
    required: true,
    trim: true,
  },
  about: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: [
      "Technology",
      "Cultural",
      "Dramatics",
      "Sports",
      "Literary",
      "Music",
      "Dance",
      "Social",
      "Entrepreneurship",
      "Other",
    ],
    required: true,
  },
  startdate: { type: Date, required: true },
  departments: [
    {
      departmentName: { type: String },
      departmentDesc: { type: String },
      rounds: [
        {
          roundName: { type: String, trim: true },
          roundDesc: { type: String, trim: true },
          roundEndDate: { type: Date },
          link: { type: String, trim: true },
        },
      ],
      students: [
        {
          studentId: { type: mongoose.Schema.Types.ObjectId, ref: "userProfile" },
          status: {
            type: String,
            enum: ["in Progress", "Rejected", "Accepted"],
            default: "in Progress"
          },
        },
      ],
    },
  ],
});

export const Society = mongoose.model("Society", societySchema);
