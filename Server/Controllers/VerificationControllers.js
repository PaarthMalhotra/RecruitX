import { userProfile } from "../Schema/UserSchema.js";
// import { usercredentialSchema } from "../Schema/verificationSchema.js";
import bcrypt from "bcrypt";
import { createJWT } from "../utilis/jwt.js";

export const login = async (req, res) => {
  try {
    const { email, inputpassword } = req.body;
    const user = await userProfile.findOne({ email });

    if (!user) {
      throw new Error("User does not exist");
    }

    const Matched = await bcrypt.compare(inputpassword, user.password);

    if (Matched) {
      createJWT(user, res);
      res.status(200).json({ verified:true,role:user.role });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).json({
      verified: false,
      error_message: error.message,
      error,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, inputpassword, role, code = "" } = req.body;

    if (role === "user") {
      
    } else if (role === "member" || role === "admin") {
      if (code !== "recruit") {
        throw new Error("Invalid code");
      }
    } else {
      throw new Error("Invalid role");
    }

    const password = await bcrypt.hash(inputpassword, 10);
    const userDetail = await userProfile.create({ email, password,role });

    if (!userDetail) {
      throw new Error("Invalid Credentials");
    }
    createJWT(userDetail, res);
    res.status(201).json({ verified: true });

  } catch (error) {
    res
      .status(400)
      .json({ verified: false, error_message: error.message, error: error });
  }
};

export const createuserprofile = async (req, res) => {
  try {
    const _id = req.user._id;
    const { ...profile } = req.body;
    await userProfile.findByIdAndUpdate(_id, profile);
    res.status(200).json({ success: true, message: "record added" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error_message: error.message, error: error });
  }
};
