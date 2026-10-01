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

/**
 * Admin endpoint: Add a new college into the platform directory.
 * Will immediately reflect in the public college list so students and members can select it.
 */
export const createCollege = async (req, res) => {
  try {
    const { name, shortCode, city } = req.body;

    if (!name || !shortCode) {
      return res.status(400).json({
        success: false,
        message: "College name and short code (abbreviation) are required",
      });
    }

    const cleanName = name.trim();
    const cleanCode = shortCode.trim().toUpperCase();
    const cleanCity = city ? city.trim() : "";

    // Check if college already exists
    const existing = await College.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${cleanName}$`, "i") } },
        { shortCode: cleanCode },
      ],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A college with name "${cleanName}" or code "${cleanCode}" already exists.`,
      });
    }

    const newCollege = await College.create({
      name: cleanName,
      shortCode: cleanCode,
      city: cleanCity,
    });

    res.status(201).json({
      success: true,
      message: "College added successfully",
      college: newCollege,
    });
  } catch (error) {
    console.error("Error creating college:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to add college" });
  }
};
