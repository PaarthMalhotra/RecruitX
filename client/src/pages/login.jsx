import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { postrequest } from "../utilitis/fetch.js";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setRole } from "../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await postrequest(`${import.meta.env.VITE_API_URL}/api/login`, data);
      if (response.verified) {
        dispatch(setRole(response.role));
        toast.success("Login Successful");
        if (response.role === "admin") {
          navigate("/home/admindashboard");
        } else if (response.role === "member") {
          navigate("/home/memberdashboard");
        } else {
          navigate("/home/userdashboard");
        }
      } else {
        toast.error(response.error_message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Failed to connect to authentication server");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-page px-4 py-12 font-sans text-m3-text">
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="text-xs font-semibold text-primary hover:underline transition outline-none"
        >
          ← Back to RecruitX
        </Link>
      </div>

      <div className="w-full max-w-md bg-surface rounded-[16px] border border-m3-border/80 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <Link to="/" className="text-3xl font-extrabold tracking-tight text-m3-text inline-block outline-none">
            RecruitX
          </Link>
          <h2 className="text-xl font-bold text-m3-text mt-2">Welcome back</h2>
          <p className="text-xs text-m3-muted">
            Sign in to access your recruitment dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-m3-muted mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@university.edu"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2.5 rounded-xl border border-m3-border text-sm text-m3-text placeholder:text-m3-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition bg-surface"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-m3-danger">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-m3-muted">
                Password
              </label>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              {...register("inputpassword", { required: "Password is required" })}
              className="w-full px-4 py-2.5 rounded-xl border border-m3-border text-sm text-m3-text placeholder:text-m3-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition bg-surface"
            />
            {errors.inputpassword && (
              <p className="mt-1 text-xs text-m3-danger">{errors.inputpassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-colors duration-200 cursor-pointer disabled:opacity-50 outline-none shadow-xs"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="pt-2 border-t border-m3-border/50 text-center">
          <p className="text-xs text-m3-muted">
            Don't have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-primary hover:underline ml-1 outline-none"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
