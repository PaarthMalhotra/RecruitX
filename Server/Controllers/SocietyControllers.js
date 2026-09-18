import mongoose from "mongoose";
import { Society } from "../Schema/SocietySchema.js";
import { userProfile } from "../Schema/UserSchema.js";
import { connectDb } from "../utilis/connetDb.js";

connectDb();

export const displayAllSociety = async (req, res) => {
  try {
    const societyDetails = await Society.find().populate(
      "departments.students.studentId",
      "f_name l_name email roll_no college branch p_number github linkdin"
    );
    res.status(200).json(societyDetails);
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "There was an error while fetching societies" });
  }
};

// operations on Society
export const displaySociety = async (req, res) => {
  try {
    const id = req.params.SocietyId || req.params._id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Society ID" });
    }
    const societyDetail = await Society.findById(id).populate(
      "departments.students.studentId",
      "f_name l_name email roll_no college branch p_number github linkdin"
    );
    if (!societyDetail) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }
    res.status(200).json(societyDetail);
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "There was an error while fetching society" });
  }
};

export const getMySociety = async (req, res) => {
  try {
    const society = await Society.findOne({ userId: req.user._id }).populate(
      "departments.students.studentId",
      "f_name l_name email roll_no college branch p_number github linkdin"
    );
    res.status(200).json({ success: true, society: society || null });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createSociety = async (req, res) => {
  try {
    const userId = (req.user && req.user._id) || req.body.userId;
    const { name, about, category, startdate } = req.body;

    if (!name || !about || !category || !startdate) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const newSociety = await Society.create({
      userId,
      name,
      about,
      category,
      startdate,
      departments: []
    });
    res.status(201).json({ success: true, message: "Society Added", society: newSociety });
  } catch (error) {
    console.log("Error in creating society: " + error);
    res.status(400).json({ success: false, message: error.message || "Error creating society" });
  }
};

export const deleteSociety = async (req, res) => {
  try {
    const id = req.params._id || req.params.SocietyId || req.body._id;
    if (!id) {
      return res.status(400).json({ Success: false, message: "Society ID required" });
    }
    await Society.deleteOne({ _id: id });
    res.status(202).json({ Success: true, success: true, message: "Deleted Successfully" });
  } catch (error) {
    console.log("An error occurred while deleting Society: " + error);
    res.status(400).json({ Success: false, success: false, message: "Unable to Delete" });
  }
};

// operations on departments
export const addDepartment = async (req, res) => {
  try {
    const { _id, ...departmentDetails } = req.body;

    const societyId = _id || (req.user && (await Society.findOne({ userId: req.user._id }))?._id);

    if (!societyId) {
      return res.status(400).json({ success: false, message: "Society ID is required" });
    }

    const society = await Society.findByIdAndUpdate(
      societyId,
      {
        $push: {
          departments: departmentDetails
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Department added successfully",
      society
    });

  } catch (error) {
    console.log("Error in adding department:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const removeDepartment = async (req, res) => {
  try {
    const { _id, departmentId } = req.body;
    await Society.findByIdAndUpdate(
      _id,
      {
        $pull: {
          departments: {
            _id: departmentId
          }
        }
      },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Department removed successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// operations on departments-students
export const addingStudent = async (req, res) => {
  try {
    const { _id, studentId, departmentName } = req.body;
    await Society.findByIdAndUpdate(
      _id,
      {
        $push: {
          "departments.$[department].students": { studentId, status: "in Progress" },
        },
      },
      {
        arrayFilters: [{ "department.departmentName": departmentName }],
        new: true,
      },
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeStudent = async (req, res) => {
  try {
    const { _id, departmentId, studentId } = req.body;
    await Society.findByIdAndUpdate(
      _id,
      {
        $pull: { "departments.$[department].students": { studentId } }
      },
      {
        arrayFilters: [{ "department._id": departmentId }],
        new: true
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { societyId, departmentName, studentId, status } = req.body;

    const societyStatus = (status === "Approved" || status === "Accepted") ? "Accepted" : (status === "Rejected" ? "Rejected" : "in Progress");
    const userStatus = (status === "Accepted" || status === "Approved") ? "Approved" : (status === "Rejected" ? "Rejected" : "In-Progress");

    const updatedSociety = await Society.findOneAndUpdate(
      {
        _id: societyId,
        "departments.departmentName": departmentName,
        "departments.students.studentId": studentId,
      },
      {
        $set: {
          "departments.$[dept].students.$[student].status": societyStatus,
        },
      },
      {
        arrayFilters: [
          { "dept.departmentName": departmentName },
          { "student.studentId": studentId },
        ],
        new: true,
      }
    );

    // Synchronize the status in user's profile
    await userProfile.findOneAndUpdate(
      {
        _id: studentId,
        "society.SocietyId": societyId,
        "society.department": departmentName,
      },
      {
        $set: {
          "society.$.status": userStatus,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Status updated to ${userStatus}`,
      updatedSociety
    });
  } catch (error) {
    console.error("Error in changeStatus:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalSocieties = await Society.countDocuments();
    const societies = await Society.find();
    const totalStudents = await userProfile.countDocuments({ role: "user" });

    let totalEnrollments = 0;
    let categoryCounts = {};

    societies.forEach((soc) => {
      categoryCounts[soc.category] = (categoryCounts[soc.category] || 0) + 1;
      soc.departments?.forEach((dept) => {
        totalEnrollments += dept.students?.length || 0;
      });
    });

    res.status(200).json({
      success: true,
      stats: {
        totalSocieties,
        totalStudents,
        totalEnrollments,
        categoryCounts,
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
