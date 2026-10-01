import { User } from "../Schema/UserSchema.js";
import { Society } from "../Schema/SocietySchema.js";
import { getModelByRole } from "../utilis/getModelByRole.js";

/**
 * Returns all societies the student has applied to.
 */
export const allappliedSociety = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    res.status(200).json(student ? student.society : []);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Returns details of the currently authenticated account (User, Member, or Admin)
 * with college populated. Used by Avatar, profile, etc.
 */
export const userDetails = async (req, res) => {
  try {
    const Model = getModelByRole(req.user.role);
    const details = await Model.findById(req.user._id)
      .select("-password")
      .populate("college", "name shortCode city");
    res.status(200).json({ success: true, details });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Enrolls a student in a society department.
 */
export const enrollSociety = async (req, res) => {
  try {
    const { SocietyId, department } = req.body;

    if (!SocietyId || !department) {
      return res.status(400).json({ success: false, message: "Society ID and Department are required" });
    }

    // Check for existing enrollment in student's record
    const existing = await User.findOne({
      _id: req.user._id,
      "society.SocietyId": SocietyId,
      "society.department": department,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already enrolled in this department",
      });
    }

    // Push to student's applied societies
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        society: {
          SocietyId,
          department,
          status: "In-Progress",
        },
      },
    });

    // Add student to Society department students list
    await Society.findOneAndUpdate(
      {
        _id: SocietyId,
        "departments.departmentName": department,
      },
      {
        $push: {
          "departments.$.students": {
            studentId: req.user._id,
            status: "in Progress",
          },
        },
      }
    );

    res.status(200).json({ success: true, message: "Enrolled successfully" });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Withdraws a student application from a department.
 */
export const deleteSociety = async (req, res) => {
  try {
    const { _id, SocietyId, department } = req.body;

    // Pull from student's society array
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          society: { _id },
        },
      },
      { new: true }
    );

    // If SocietyId and department are provided, also remove from Society
    if (SocietyId && department) {
      await Society.findOneAndUpdate(
        {
          _id: SocietyId,
          "departments.departmentName": department,
        },
        {
          $pull: {
            "departments.$.students": {
              studentId: req.user._id,
            },
          },
        }
      );
    }

    res.status(200).json({ success: true, message: "Application withdrawn successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
