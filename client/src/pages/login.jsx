import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { postrequest } from "../utilitis/fetch.js";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setRole } from "../redux/userSlice";

const Login = () => {
  const navigate =useNavigate()
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const response = await postrequest("http://localhost:3000/api/login", data);
    if (response.verified) {
      dispatch(setRole(response.role));
      toast.success("Login Successful");
      if (response.role === "admin") {
        navigate('/home/admindashboard');
      } else if (response.role === "member") {
        navigate('/home/memberdashboard');
      } else {
        navigate('/home/userdashboard');
      }
    } else {
      toast.error(response.error_message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-around gap-12 bg-[#FFFFF0] px-6">
      <div className="flex flex-col items-center lg:items-start">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-black leading-none">
          Recruit<span className="text-purple-700">X</span>
        </h1>
        <span className="text-sm sm:text-base md:text-lg text-gray-500 font-medium tracking-wide mt-2">
          Recruitment Platform
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
      w-full max-w-md
      flex flex-col
      gap-5
      rounded-2xl
      border border-[#deded0]
      bg-[#fffef5]
      p-7
      shadow-[0_4px_20px_rgba(0,0,0,0.05)]
    "
      >
        <h2 className="text-2xl font-semibold text-black">Welcome back!</h2>

        <div className="w-full">
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is Required",
            })}
            className="
          w-full
          p-3.5
          rounded-lg
          border border-[#d8d8cc]
          text-black
          outline-none
          placeholder:text-gray-400
          focus:border-black
          transition
        "
          />

          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <input
            type="password"
            placeholder="Password"
            {...register("inputpassword", {
              required: "Password is required",
            })}
            className="
                 w-full
          p-3.5
          rounded-lg
          border border-[#d8d8cc]
          text-black
          outline-none
          placeholder:text-gray-400
          focus:border-black
          transition
        "
          />

          {errors.inputpassword && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.inputpassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="
        w-full
        rounded-lg
        border-2 border-black/70
        bg-purple-300
        p-2.5
        text-lg
        font-semibold
        text-black
        cursor-pointer
        transition
        hover:bg-purple-200
      "
        >
          Login
        </button>

        <Link
          to="/signin"
          className="text-sm text-center -mt-2 text-black hover:text-purple-800 cursor-pointer outline-none "
        >
          Create Account
        </Link>
      </form>
    </div>
  );
};

export default Login;
