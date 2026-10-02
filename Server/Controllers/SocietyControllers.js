import mongoose from "mongoose";
import { Society } from "../Schema/SocietySchema.js";
import { User } from "../Schema/UserSchema.js";
import { Member } from "../Schema/MemberSchema.js";
import { College } from "../Schema/CollegeSchema.js";
import { sendApprovalEmail, sendRejectionEmail } from "../utilis/sendEmail.js";

export const displayAllSociety = async (req, res) => {
  try {
    const societyDetails = await Society.find()
      .populate("college", "name shortCode city")
      .populate({
        path: "departments.students.studentId",
        select: "f_name l_name email roll_no college branch p_number github linkdin",
        populate: { path: "college", select: "name shortCode city" },
      });
    res.status(200).json(societyDetails);
  } catch (error) {
    res.status(400).json({ success: false, message: "There was an error while fetching societies" });
  }
};

export const displaySociety = async (req, res) => {
  try {
    const id = req.params.SocietyId || req.params._id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Society ID" });
    }
    const societyDetail = await Society.findById(id)
      .populate("college", "name shortCode city")
      .populate({
        path: "departments.students.studentId",
        select: "f_name l_name email roll_no college branch p_number github linkdin",
        populate: { path: "college", select: "name shortCode city" },
      });
    if (!societyDetail) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }
    res.status(200).json(societyDetail);
  } catch (error) {
    res.status(400).json({ success: false, message: "There was an error while fetching society" });
  }
};

export const getMySociety = async (req, res) => {
  try {
    const society = await Society.findOne({ userId: req.user._id })
      .populate("college", "name shortCode city")
      .populate({
        path: "departments.students.studentId",
        select: "f_name l_name email roll_no college branch p_number github linkdin",
        populate: { path: "college", select: "name shortCode city" },
      });
    res.status(200).json({ success: true, society: society || null });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createSociety = async (req, res) => {
  try {
    const userId = (req.user && req.user._id) || req.body.userId;
    const { name, about, category, startdate, college } = req.body;

    if (!name || !about || !category || !startdate) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    let targetCollegeId = college || (req.user && req.user.college?._id) || req.user?.college;
    if (!targetCollegeId) {
      const fallbackCollege = await College.findOne();
      if (fallbackCollege) targetCollegeId = fallbackCollege._id;
    }

    const collegeDoc = await College.findById(targetCollegeId);
    if (!collegeDoc) {
      return res.status(400).json({ success: false, message: "Valid college reference is required" });
    }

    const newSociety = await Society.create({
      userId,
      name,
      about,
      category,
      startdate,
      college: collegeDoc._id,
      departments: [],
    });

    await Member.findByIdAndUpdate(userId, { societyId: newSociety._id });

    res.status(201).json({ success: true, message: "Society Added", society: newSociety });
  } catch (error) {
    console.error("Error creating society:", error);
    res.status(400).json({ success: false, message: error.message || "Error creating society" });
  }
};

export const deleteSociety = async (req, res) => {
  try {
    const id = req.params._id || req.params.SocietyId || req.body._id;
    if (!id) {
      return res.status(400).json({ success: false, message: "Society ID required" });
    }

    const society = await Society.findById(id);
    if (society) {
      await Member.updateMany({ societyId: society._id }, { $set: { societyId: null } });
      await Society.deleteOne({ _id: id });
    }

    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting society:", error);
    res.status(400).json({ success: false, message: "Unable to Delete" });
  }
};

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
        $push: { departments: departmentDetails },
      },
      { new: true, runValidators: true }
    );

    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }

    res.status(200).json({
      success: true,
      message: "Department added successfully",
      society,
    });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeDepartment = async (req, res) => {
  try {
    const { _id, departmentId } = req.body;
    await Society.findByIdAndUpdate(
      _id,
      {
        $pull: { departments: { _id: departmentId } },
      },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Department removed successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { societyId, departmentName, studentId, status } = req.body;

    const societyStatus = status === "Approved" || status === "Accepted" ? "Accepted" : status === "Rejected" ? "Rejected" : "in Progress";
    const userStatus = status === "Accepted" || status === "Approved" ? "Approved" : status === "Rejected" ? "Rejected" : "In-Progress";

    const existingSociety = await Society.findOne(
      {
        _id: societyId,
        "departments.departmentName": departmentName,
      },
      { name: 1, departments: { $elemMatch: { departmentName } } }
    );

    let oldStatus = null;
    let societyName = "RecruitX Society";
    if (existingSociety) {
      societyName = existingSociety.name;
      const dept = existingSociety.departments?.[0];
      const studentEntry = dept?.students?.find(
        (st) => st.studentId?.toString() === studentId?.toString()
      );
      oldStatus = studentEntry?.status;
    }

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

    await User.findOneAndUpdate(
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

    const statusChanged = oldStatus !== societyStatus;

    if (statusChanged && (societyStatus === "Accepted" || societyStatus === "Rejected")) {
      try {
        const student = await User.findById(studentId);
        if (student && student.email) {
          const studentName = student.f_name
            ? `${student.f_name} ${student.l_name || ""}`.trim()
            : "Student";

          if (societyStatus === "Accepted") {
            await sendApprovalEmail({
              studentEmail: student.email,
              studentName,
              departmentName,
              societyName,
            });
          } else if (societyStatus === "Rejected") {
            await sendRejectionEmail({
              studentEmail: student.email,
              studentName,
              departmentName,
              societyName,
            });
          }
        }
      } catch (emailErr) {
        console.error("Non-fatal email notification error:", emailErr.message || emailErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${userStatus}`,
      updatedSociety,
    });
  } catch (error) {
    console.error("Error in changeStatus:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getMemberDashboardStats = async (req, res) => {
  try {
    const memberSociety = await Society.findOne({ userId: req.user._id }).populate("college", "name shortCode city");

    if (!memberSociety) {
      return res.status(200).json({
        success: true,
        hasSociety: false,
        stats: {
          totalDepartments: 0,
          totalApplicants: 0,
          totalApproved: 0,
          totalPending: 0,
          totalRejected: 0,
          departmentStats: [],
        },
      });
    }

    const statsPipeline = [
      { $match: { _id: memberSociety._id } },
      { $unwind: { path: "$departments", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          departmentName: "$departments.departmentName",
          departmentDesc: "$departments.departmentDesc",
          roundsCount: { $size: { $ifNull: ["$departments.rounds", []] } },
          totalStudents: { $size: { $ifNull: ["$departments.students", []] } },
          approvedCount: {
            $size: {
              $filter: {
                input: { $ifNull: ["$departments.students", []] },
                as: "st",
                cond: { $in: ["$$st.status", ["Accepted", "Approved"]] },
              },
            },
          },
          rejectedCount: {
            $size: {
              $filter: {
                input: { $ifNull: ["$departments.students", []] },
                as: "st",
                cond: { $eq: ["$$st.status", "Rejected"] },
              },
            },
          },
          pendingCount: {
            $size: {
              $filter: {
                input: { $ifNull: ["$departments.students", []] },
                as: "st",
                cond: { $in: ["$$st.status", ["in Progress", "In-Progress"]] },
              },
            },
          },
        },
      },
    ];

    const departmentStats = await Society.aggregate(statsPipeline);

    let totalApplicants = 0;
    let totalApproved = 0;
    let totalPending = 0;
    let totalRejected = 0;

    departmentStats.forEach((d) => {
      if (d.departmentName) {
        totalApplicants += d.totalStudents || 0;
        totalApproved += d.approvedCount || 0;
        totalPending += d.pendingCount || 0;
        totalRejected += d.rejectedCount || 0;
      }
    });

    res.status(200).json({
      success: true,
      hasSociety: true,
      society: {
        _id: memberSociety._id,
        name: memberSociety.name,
        category: memberSociety.category,
        about: memberSociety.about,
        college: memberSociety.college,
        departments: memberSociety.departments,
      },
      stats: {
        totalDepartments: memberSociety.departments?.length || 0,
        totalApplicants,
        totalApproved,
        totalPending,
        totalRejected,
        departmentStats: departmentStats.filter((d) => d.departmentName),
      },
    });
  } catch (error) {
    console.error("Member dashboard aggregation error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalColleges = await College.countDocuments();
    const totalSocieties = await Society.countDocuments();

    const societiesPerCollege = await Society.aggregate([
      {
        $lookup: {
          from: "colleges",
          localField: "college",
          foreignField: "_id",
          as: "collegeInfo",
        },
      },
      {
        $group: {
          _id: "$college",
          collegeName: {
            $first: {
              $ifNull: [{ $arrayElemAt: ["$collegeInfo.name", 0] }, "Unknown College"],
            },
          },
          collegeShortCode: {
            $first: {
              $ifNull: [{ $arrayElemAt: ["$collegeInfo.shortCode", 0] }, "Other"],
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const applicantAggregations = await Society.aggregate([
      { $unwind: "$departments" },
      { $unwind: "$departments.students" },
      {
        $lookup: {
          from: "colleges",
          localField: "college",
          foreignField: "_id",
          as: "collegeInfo",
        },
      },
      {
        $facet: {
          totalApplicantsCount: [{ $count: "count" }],
          applicantsPerCollege: [
            {
              $group: {
                _id: "$college",
                collegeName: {
                  $first: {
                    $ifNull: [{ $arrayElemAt: ["$collegeInfo.name", 0] }, "Unknown College"],
                  },
                },
                collegeShortCode: {
                  $first: {
                    $ifNull: [{ $arrayElemAt: ["$collegeInfo.shortCode", 0] }, "Other"],
                  },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          applicantsPerDepartment: [
            {
              $group: {
                _id: "$departments.departmentName",
                departmentName: { $first: "$departments.departmentName" },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    const totalApplicants = applicantAggregations[0]?.totalApplicantsCount[0]?.count || 0;
    const applicantsPerCollege = applicantAggregations[0]?.applicantsPerCollege || [];
    const applicantsPerDepartment = applicantAggregations[0]?.applicantsPerDepartment || [];

    res.status(200).json({
      success: true,
      stats: {
        totalColleges,
        totalSocieties,
        totalApplicants,
        societiesPerCollege,
        applicantsPerCollege,
        applicantsPerDepartment,
      },
    });
  } catch (error) {
    console.error("Admin aggregation stats error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
