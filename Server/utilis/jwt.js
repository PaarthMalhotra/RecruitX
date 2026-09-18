import jwt from "jsonwebtoken";

export const createJWT = (user, res) => {
  try {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ _id: user._id , role: user.role }, secret, { expiresIn: "1d" });
    console.log(token)
    
    const isProduction = process.env.NODE_ENV === "production";
    
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });
  } catch (error) {
    console.log("Unexpected erro roccured at JWT")
  }
};
