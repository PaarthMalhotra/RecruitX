import bcrypt from "bcrypt";
import { User } from "../Schema/UserSchema.js";
import { Member } from "../Schema/MemberSchema.js";
import { Admin } from "../Schema/AdminSchema.js";
import { College } from "../Schema/CollegeSchema.js";
import { createJWT } from "../utilis/jwt.js";
import { findAccountByEmail, emailExistsInAnyCollection, getModelByRole } from "../utilis/getModelByRole.js";

/**
 * Login handler: Searches across User, Member, and Admin collections in parallel.
 * At most one match will exist because email uniqueness is enforced across all collections.
 */
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

/**
 * Registration (signin) handler:
 * Enforces email uniqueness across all three collections (User, Member, Admin).
 * Validates selected college against the College collection.
 * Creates document in the appropriate role collection.
 */
export const signin = async (req, res) => {
  try {
    const { email, inputpassword, role = "user", code = "", college, f_name, l_name } = req.body;

    if (!email || !inputpassword) {
      return res.status(400).json({ verified: false, error_message: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Verify email uniqueness across all three collections
    const alreadyExists = await emailExistsInAnyCollection(cleanEmail);
    if (alreadyExists) {
      return res.status(400).json({ verified: false, error_message: "Email is already registered" });
    }

    // 2. Validate role & security code for elevated roles
    if (role === "member" || role === "admin") {
      if (code !== "recruit") {
        return res.status(400).json({ verified: false, error_message: "Invalid security code for privileged role" });
      }
    } else if (role !== "user") {
      return res.status(400).json({ verified: false, error_message: "Invalid account role" });
    }

    // 3. College validation (backend verification - never trust frontend alone)
    let validCollegeId = null;
    if (college) {
      const foundCollege = await College.findById(college);
      if (!foundCollege) {
        return res.status(400).json({ verified: false, error_message: "Invalid college selected" });
      }
      validCollegeId = foundCollege._id;
    } else if (role === "user" || role === "member") {
      // If student/member didn't provide college, check if at least one college exists to link or require it
      const firstCol = await College.findOne();
      if (firstCol) validCollegeId = firstCol._id;
    }

    // 4. Hash password
    const password = await bcrypt.hash(inputpassword, 10);

    // 5. Create in the dedicated collection based on role
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
      // Student user
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

/**
 * Profile update handler for the authenticated entity.
 * Validates college if updated and saves into the appropriate model.
 */
export const createuserprofile = async (req, res) => {
  try {
    const _id = req.user._id;
    const role = req.user.role || "user";
    const profileData = { ...req.body };

    // Prevent overwriting credentials directly through profile update
    delete profileData.password;
    delete profileData.email;
    delete profileData.role;

    // Validate college if provided
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
