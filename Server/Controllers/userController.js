import { User } from "../Schema/UserSchema.js";
import { Society } from "../Schema/SocietySchema.js";
import { College } from "../Schema/CollegeSchema.js";
import { getModelByRole } from "../utilis/getModelByRole.js";

export const allappliedSociety = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    res.status(200).json(student ? student.society : []);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const userDetails = async (req, res) => {
  try {
    const Model = getModelByRole(req.user.role);
    let query = Model.findById(req.user._id).select("-password");

    if (req.user.role !== "admin") {
      query = query.populate("college", "name shortCode city");
    }

    const details = await query;
    res.status(200).json({ success: true, details });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const enrollSociety = async (req, res) => {
  try {
    const { SocietyId, department } = req.body;

    if (!SocietyId || !department) {
      return res.status(400).json({ success: false, message: "Society ID and Department are required" });
    }

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

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        society: {
          SocietyId,
          department,
          status: "In-Progress",
        },
      },
    });

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

export const deleteSociety = async (req, res) => {
  try {
    const { _id, SocietyId, department } = req.body;

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          society: { _id },
        },
      },
      { new: true }
    );

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
