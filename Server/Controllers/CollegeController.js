import { College } from "../Schema/CollegeSchema.js";

/**
 * Public endpoint to fetch all available colleges for dropdown selection.
 */
export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ name: 1 });
    res.status(200).json({ success: true, colleges });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch colleges", error: error.message });
  }
};
