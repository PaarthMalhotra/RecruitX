import { userProfile } from "../Schema/UserSchema.js";
import { Society } from "../Schema/SocietySchema.js";

export const allappliedSociety = async (req, res) => {
    try {
        const societyDetail = await userProfile.findById(req.user._id);
        res.status(200).json(societyDetail ? societyDetail.society : []);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });        
    }
};

export const userDetails = async (req, res) => {
    try {
        const details = await userProfile.findById(req.user._id).select("-password");
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

        // Check for existing enrollment
        const existing = await userProfile.findOne({
            _id: req.user._id,
            "society.SocietyId": SocietyId,
            "society.department": department,
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "You have already enrolled in this department"
            });
        }

        // Push to user's applied societies
        await userProfile.findByIdAndUpdate(req.user._id, {
            $push: {
                society: {
                    SocietyId,
                    department,
                    status: "In-Progress",
                }
            }
        });

        // Add student to the Society department students list
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
                    }
                }
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

        // Pull from user's society array
        await userProfile.findByIdAndUpdate(req.user._id, {
            $pull: {
                society: {
                    _id
                }
            }
        }, { new: true });

        // If SocietyId and department are provided, also remove from Society
        if (SocietyId && department) {
            await Society.findOneAndUpdate(
                {
                    _id: SocietyId,
                    "departments.departmentName": department
                },
                {
                    $pull: {
                        "departments.$.students": {
                            studentId: req.user._id
                        }
                    }
                }
            );
        }

        res.status(200).json({ success: true, message: "Application withdrawn successfully" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

