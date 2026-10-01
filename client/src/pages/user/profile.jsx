import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { postrequest, getrequest } from "../../utilitis/fetch";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/userSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [colleges, setColleges] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profileRes, collegesRes] = await Promise.all([
          getrequest(`${import.meta.env.VITE_API_URL}/api/user/getuserdetails`),
          getrequest(`${import.meta.env.VITE_API_URL}/api/colleges`),
        ]);

        if (collegesRes?.colleges) {
          setColleges(collegesRes.colleges);
        } else if (Array.isArray(collegesRes)) {
          setColleges(collegesRes);
        }

        const details = profileRes.details || profileRes;
        if (details) {
          if (details.dob) {
            details.dob = details.dob.split("T")[0];
          }
          if (details.college?._id) {
            details.college = details.college._id;
          }
          reset(details);
          dispatch(setUserDetails(details));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [reset, dispatch]);

  const onSubmit = async (data) => {
    try {
      const response = await postrequest(
        `${import.meta.env.VITE_API_URL}/api/user/createuserprofile`,
        data
      );

      if (response.success) {
        toast.success("Profile Details Updated Successfully");
        dispatch(setUserDetails(data));
        navigate("/home");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Failed to save profile changes");
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto py-10 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-xl w-48"></div>
        <div className="h-96 bg-white rounded-2xl border border-black/10"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-4 font-sans text-gray-900">
      <div className="bg-white rounded-2xl border border-black/10 p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">
            Academic Profile
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Keep your student academic and contact details up-to-date for society recruitment evaluations.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                placeholder="First Name"
                {...register("f_name", { required: "First Name is required" })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black focus:outline-none focus:border-black transition"
              />
              {errors.f_name && <p className="mt-1 text-xs text-red-600">{errors.f_name.message}</p>}
            </div>

            <div className="w-full">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                placeholder="Last Name"
                {...register("l_name", { required: "Last Name is required" })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black focus:outline-none focus:border-black transition"
              />
              {errors.l_name && <p className="mt-1 text-xs text-red-600">{errors.l_name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                {...register("dob")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black focus:outline-none focus:border-black transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                placeholder="10 digit number"
                {...register("p_number", {
                  required: "Phone Number is required",
                  pattern: { value: /^\d{10}$/, message: "Please provide a 10 digit number" },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black focus:outline-none focus:border-black transition"
              />
              {errors.p_number && <p className="mt-1 text-xs text-red-600">{errors.p_number.message}</p>}
            </div>
          </div>

          {/* Predefined College Dropdown (replaces hardcoded NSUT readonly) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">College / University *</label>
            <select
              {...register("college", { required: "College is required" })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black bg-white focus:outline-none focus:border-black transition cursor-pointer"
            >
              <option value="">-- Choose college --</option>
              {colleges.map((col) => (
                <option key={col._id} value={col._id}>
                  {col.shortCode ? `${col.shortCode} - ` : ""}
                  {col.name} {col.city ? `(${col.city})` : ""}
                </option>
              ))}
            </select>
            {errors.college && <p className="mt-1 text-xs text-red-600">{errors.college.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Batch Start Year *</label>
              <input
                type="number"
                placeholder="e.g. 2024"
                {...register("batch_start", {
                  required: "Batch start is required",
                  min: { value: 2000, message: "Min year is 2000" },
                  max: { value: 2100, message: "Max year is 2100" },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black focus:outline-none focus:border-black transition"
              />
              {errors.batch_start && <p className="mt-1 text-xs text-red-600">{errors.batch_start.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Batch End Year *</label>
              <input
                type="number"
                placeholder="e.g. 2028"
                {...register("batch_end", {
                  required: "Batch end is required",
                  min: { value: 2000, message: "Min year is 2000" },
                  max: { value: 2100, message: "Max year is 2100" },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black focus:outline-none focus:border-black transition"
              />
              {errors.batch_end && <p className="mt-1 text-xs text-red-600">{errors.batch_end.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Roll Number</label>
              <input
                type="text"
                placeholder="e.g. 2025-XYZ-1234"
                {...register("roll_no")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black focus:outline-none focus:border-black transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Branch / Degree</label>
              <input
                type="text"
                placeholder="e.g. Computer Engineering"
                {...register("branch")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black focus:outline-none focus:border-black transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">GitHub Profile</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                {...register("github")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black focus:outline-none focus:border-black transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                {...register("linkdin")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-black focus:outline-none focus:border-black transition"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-[11px] text-xs sm:text-sm font-semibold bg-black text-white border border-black hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;