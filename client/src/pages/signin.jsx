import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { postrequest, getrequest } from "../utilitis/fetch";
import { toast } from "sonner";

const Signin = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [collegeSearch, setCollegeSearch] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    shouldUnregister: true,
  });

  const selectedCollege = watch("college");

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoadingColleges(true);
        const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/colleges`);
        if (res && res.colleges) {
          setColleges(res.colleges);
        } else if (Array.isArray(res)) {
          setColleges(res);
        }
      } catch (err) {
        console.error("Failed to load colleges:", err);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchColleges();
  }, []);

  const onSubmit = async (data) => {
    data.role = role;
    try {
      const response = await postrequest(`${import.meta.env.VITE_API_URL}/api/signin`, data);
      if (response.verified) {
        toast.success("Account created successfully! Please sign in.");
        navigate("/login");
      } else {
        toast.error(response.error_message || "Failed to create account");
      }
    } catch (err) {
      toast.error("Registration request failed");
    }
  };

  const filteredColleges = colleges.filter((c) => {
    const q = collegeSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name?.toLowerCase().includes(q) ||
      c.shortCode?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] px-4 py-12 font-sans text-gray-900">
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="text-xs font-semibold text-gray-500 hover:text-black transition"
        >
          ← Back to RecruitX
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-black/10 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <Link to="/" className="text-3xl font-extrabold tracking-tight text-black inline-block">
            RecruitX
          </Link>
          <h2 className="text-xl font-bold text-gray-950 mt-2">Create an account</h2>
          <p className="text-xs text-gray-500">
            Join the recruitment network for your college
          </p>
        </div>

        {/* Role Pill Switcher */}
        <div className="flex justify-center p-1 rounded-xl bg-[#fafafa] border border-black/5 gap-1">
          <button
            type="button"
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              role === "user"
                ? "bg-black text-white font-semibold shadow-xs"
                : "text-gray-600 hover:text-black hover:bg-black/5"
            }`}
            onClick={() => setRole("user")}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              role === "member"
                ? "bg-black text-white font-semibold shadow-xs"
                : "text-gray-600 hover:text-black hover:bg-black/5"
            }`}
            onClick={() => setRole("member")}
          >
            Society Member
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              role === "admin"
                ? "bg-black text-white font-semibold shadow-xs"
                : "text-gray-600 hover:text-black hover:bg-black/5"
            }`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                {...register("f_name", { required: "First name is required" })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition"
              />
              {errors.f_name && (
                <p className="mt-1 text-xs text-red-600">{errors.f_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                {...register("l_name")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@university.edu"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Predefined Searchable College Dropdown (A1/B3 requirement) */}
          {role !== "admin" && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Select College / University
              </label>
              {loadingColleges ? (
                <div className="h-10 bg-gray-100 rounded-xl animate-pulse flex items-center px-3 text-xs text-gray-400">
                  Loading colleges...
                </div>
              ) : (
                <div className="space-y-1.5">
                  <select
                    {...register("college", {
                      required: role !== "admin" ? "Please select your college" : false,
                    })}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/15 text-sm text-black bg-white focus:outline-none focus:border-black transition cursor-pointer"
                  >
                    <option value="">-- Choose your college --</option>
                    {filteredColleges.map((col) => (
                      <option key={col._id} value={col._id}>
                        {col.shortCode ? `${col.shortCode} - ` : ""}
                        {col.name} {col.city ? `(${col.city})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {errors.college && (
                <p className="mt-1 text-xs text-red-600">{errors.college.message}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("inputpassword", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition"
            />
            {errors.inputpassword && (
              <p className="mt-1 text-xs text-red-600">{errors.inputpassword.message}</p>
            )}
          </div>

          {/* Security Passcode for Member / Admin */}
          {(role === "member" || role === "admin") && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {role === "admin" ? "Platform Admin Security Key" : "Society Coordinator Key"}
              </label>
              <input
                type="password"
                placeholder="Enter access code (recruit)"
                {...register("code", { required: "Security key is required" })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition"
              />
              {errors.code && (
                <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 bg-black text-white text-sm font-semibold rounded-[11px] border border-black hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Complete Registration"}
          </button>
        </form>

        <div className="pt-2 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-black hover:underline ml-1"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
