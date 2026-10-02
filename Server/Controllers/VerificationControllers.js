import bcrypt from "bcrypt";
import { User } from "../Schema/UserSchema.js";
import { Member } from "../Schema/MemberSchema.js";
import { Admin } from "../Schema/AdminSchema.js";
import { College } from "../Schema/CollegeSchema.js";
import { createJWT } from "../utilis/jwt.js";
import { findAccountByEmail, emailExistsInAnyCollection, getModelByRole } from "../utilis/getModelByRole.js";

export const login = async (req, res) => {
  try {
    const { email, inputpassword } = req.body;

    if (!email || !inputpassword) {
      return res.status(400).json({ verified: false, error_message: "Email and password are required" });
    }

    const user = await findAccountByEmail(email.toLowerCase().trim());

    if (!user) {
      return res.status(400).json({ verified: false, error_message: "Account does not exist" });
    }

    const matched = await bcrypt.compare(inputpassword, user.password);

    if (matched) {
      createJWT(user, res);
      return res.status(200).json({ verified: true, role: user.role });
    } else {
      return res.status(400).json({ verified: false, error_message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({
      verified: false,
      error_message: error.message || "An error occurred during login",
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, inputpassword, role = "user", code = "", college, f_name, l_name } = req.body;

    if (!email || !inputpassword) {
      return res.status(400).json({ verified: false, error_message: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    const alreadyExists = await emailExistsInAnyCollection(cleanEmail);
    if (alreadyExists) {
      return res.status(400).json({ verified: false, error_message: "Email is already registered" });
    }

    if (role === "member" || role === "admin") {
      if (code !== "recruit") {
        return res.status(400).json({ verified: false, error_message: "Invalid security code for privileged role" });
      }
    } else if (role !== "user") {
      return res.status(400).json({ verified: false, error_message: "Invalid account role" });
    }

    let validCollegeId = null;
    if (college) {
      const foundCollege = await College.findById(college);
      if (!foundCollege) {
        return res.status(400).json({ verified: false, error_message: "Invalid college selected" });
      }
      validCollegeId = foundCollege._id;
    } else if (role === "user" || role === "member") {
      const firstCol = await College.findOne();
      if (firstCol) validCollegeId = firstCol._id;
    }

    const password = await bcrypt.hash(inputpassword, 10);

    let createdAccount = null;

    if (role === "admin") {
      createdAccount = await Admin.create({
        email: cleanEmail,
        password,
        role: "admin",
        f_name: f_name?.trim() || "",
        l_name: l_name?.trim() || "",
      });
    } else if (role === "member") {
      createdAccount = await Member.create({
        email: cleanEmail,
        password,
        role: "member",
        college: validCollegeId,
        f_name: f_name?.trim() || "",
        l_name: l_name?.trim() || "",
      });
    } else {
      createdAccount = await User.create({
        email: cleanEmail,
        password,
        role: "user",
        college: validCollegeId,
        f_name: f_name?.trim() || "",
        l_name: l_name?.trim() || "",
      });
    }

    createJWT(createdAccount, res);
    res.status(201).json({ verified: true, role: createdAccount.role });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      verified: false,
      error_message: error.message || "Registration failed",
    });
  }
};

export const createuserprofile = async (req, res) => {
  try {
    const _id = req.user._id;
    const role = req.user.role || "user";
    const profileData = { ...req.body };

    delete profileData.password;
    delete profileData.email;
    delete profileData.role;

    if (profileData.college) {
      const col = await College.findById(profileData.college);
      if (!col) {
        return res.status(400).json({ success: false, message: "Selected college does not exist" });
      }
    }

    const Model = getModelByRole(role);
    await Model.findByIdAndUpdate(_id, profileData, { runValidators: true });

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(400).json({ success: false, error_message: error.message });
  }
};
