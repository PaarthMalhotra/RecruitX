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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    shouldUnregister: true,
  });

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
          <h2 className="text-xl font-bold text-m3-text mt-2">Create an account</h2>
          <p className="text-xs text-m3-muted">
            Join the recruitment network for your college
          </p>
        </div>

        {/* Role Pill Switcher */}
        <div className="flex justify-center p-1 rounded-full bg-field border border-m3-border/40 gap-1">
          <button
            type="button"
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-full transition-colors cursor-pointer outline-none ${
              role === "user"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-m3-muted hover:text-m3-text"
            }`}
            onClick={() => setRole("user")}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-full transition-colors cursor-pointer outline-none ${
              role === "member"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-m3-muted hover:text-m3-text"
            }`}
            onClick={() => setRole("member")}
          >
            Society Member
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-full transition-colors cursor-pointer outline-none ${
              role === "admin"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-m3-muted hover:text-m3-text"
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
              <label className="block text-xs font-medium text-m3-muted mb-1">
                First Name *
              </label>
              <input
                type="text"
                placeholder="John"
                {...register("f_name", { required: "First name is required" })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-m3-border text-sm text-m3-text placeholder:text-m3-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition bg-surface"
              />
              {errors.f_name && (
                <p className="mt-1 text-xs text-m3-danger">{errors.f_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-m3-muted mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                {...register("l_name")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-m3-border text-sm text-m3-text placeholder:text-m3-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition bg-surface"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-m3-muted mb-1">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="name@university.edu"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-m3-border text-sm text-m3-text placeholder:text-m3-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition bg-surface"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-m3-danger">{errors.email.message}</p>
            )}
          </div>

          {/* Predefined Searchable College Dropdown */}
          {role !== "admin" && (
            <div>
              <label className="block text-xs font-medium text-m3-muted mb-1">
                Select College / University *
              </label>
              {loadingColleges ? (
                <div className="h-10 bg-field rounded-xl animate-pulse flex items-center px-3 text-xs text-m3-muted">
                  Loading colleges...
                </div>
              ) : (
                <select
                  {...register("college", {
                    required: role !== "admin" ? "Please select your college" : false,
                  })}
                  className="w-full px-3 py-2.5 rounded-xl border border-m3-border text-sm text-m3-text bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition cursor-pointer"
                >
                  <option value="">-- Choose your college --</option>
                  {colleges.map((col) => (
                    <option key={col._id} value={col._id}>
                      {col.shortCode ? `${col.shortCode} - ` : ""}
                      {col.name} {col.city ? `(${col.city})` : ""}
                    </option>
                  ))}
                </select>
              )}
              {errors.college && (
                <p className="mt-1 text-xs text-m3-danger">{errors.college.message}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-m3-muted mb-1">
              Password *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("inputpassword", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-m3-border text-sm text-m3-text placeholder:text-m3-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition bg-surface"
            />
            {errors.inputpassword && (
              <p className="mt-1 text-xs text-m3-danger">{errors.inputpassword.message}</p>
            )}
          </div>

          {/* Security Passcode for Member / Admin */}
          {(role === "member" || role === "admin") && (
            <div>
              <label className="block text-xs font-medium text-m3-muted mb-1">
                {role === "admin" ? "Platform Admin Security Key" : "Society Coordinator Key"}
              </label>
              <input
                type="password"
                placeholder="Enter access code (recruit)"
                {...register("code", { required: "Security key is required" })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-m3-border text-sm text-m3-text placeholder:text-m3-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition bg-surface"
              />
              {errors.code && (
                <p className="mt-1 text-xs text-m3-danger">{errors.code.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-colors duration-200 cursor-pointer disabled:opacity-50 outline-none shadow-xs"
          >
            {isSubmitting ? "Creating account..." : "Complete Registration"}
          </button>
        </form>

        <div className="pt-2 border-t border-m3-border/50 text-center">
          <p className="text-xs text-m3-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline ml-1 outline-none"
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
