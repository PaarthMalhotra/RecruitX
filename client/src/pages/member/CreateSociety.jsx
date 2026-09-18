import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { postrequest } from "../../utilitis/fetch";
import { toast } from "sonner";

const CATEGORIES = [
  "Technology",
  "Cultural",
  "Dramatics",
  "Sports",
  "Literary",
  "Music",
  "Dance",
  "Social",
  "Entrepreneurship",
  "Other",
];

const CreateSociety = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "Technology",
      college: "NSUT",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await postrequest("http://localhost:3000/api/member/createsociety", data);
      if (res.success) {
        toast.success("Society created successfully!");
        navigate("/home/memberdashboard");
      } else {
        toast.error(res.message || "Failed to create society");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating society");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-8">
      <div className="mb-4">
        <Link
          to="/home/memberdashboard"
          className="text-sm font-semibold text-gray-600 hover:text-black transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-10 shadow-xs max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Register New Society
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Fill in the details about your society to begin recruiting students on RecruitX.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Society Name *
            </label>
            <input
              type="text"
              placeholder="e.g. IEEE NSUT, Debating Society, Dance Club"
              {...register("name", { required: "Society name is required" })}
              className="w-full p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-purple-600"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-purple-600 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                College *
              </label>
              <input
                type="text"
                readOnly
                value="NSUT"
                {...register("college")}
                className="w-full p-3.5 rounded-xl border border-gray-300 bg-gray-100 text-sm text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Registration Start Date *
            </label>
            <input
              type="date"
              {...register("startdate", { required: "Start date is required" })}
              className="w-full p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-purple-600"
            />
            {errors.startdate && <p className="text-xs text-red-500 mt-1">{errors.startdate.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              About Society *
            </label>
            <textarea
              rows="4"
              placeholder="Describe your society's vision, ongoing projects, achievements, and what new members can expect..."
              {...register("about", {
                required: "Description is required",
                minLength: { value: 20, message: "Description must be at least 20 characters" },
              })}
              className="w-full p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-purple-600 leading-relaxed"
            ></textarea>
            {errors.about && <p className="text-xs text-red-500 mt-1">{errors.about.message}</p>}
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-purple-700 text-white hover:bg-purple-800 shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Creating..." : "Create Society"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSociety;
