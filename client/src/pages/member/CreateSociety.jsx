import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { postrequest, getrequest } from "../../utilitis/fetch";
import { toast } from "sonner";
import { useSelector } from "react-redux";

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
  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);

  const currentUser = useSelector((state) => state.user?.details);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "Technology",
    },
  });

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoadingColleges(true);
        const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/colleges`);
        const list = res?.colleges || (Array.isArray(res) ? res : []);
        setColleges(list);

        if (currentUser?.college?._id) {
          setValue("college", currentUser.college._id);
        } else if (currentUser?.college && typeof currentUser.college === "string") {
          setValue("college", currentUser.college);
        }
      } catch (err) {
        console.error("Failed to load colleges:", err);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchColleges();
  }, [currentUser, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await postrequest(`${import.meta.env.VITE_API_URL}/api/member/createsociety`, data);
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
    <div className="w-full max-w-4xl mx-auto pb-10 font-sans text-m3-text">
      <div className="mb-4">
        <Link
          to="/home/memberdashboard"
          className="text-xs font-semibold text-primary hover:underline transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-surface rounded-2xl border border-m3-border/60 p-6 sm:p-10 shadow-xs max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-m3-text tracking-tight">
            Register New Society
          </h1>
          <p className="text-xs text-m3-muted mt-1">
            Fill in details about your society to begin recruiting students on RecruitX.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-m3-text mb-1">
              Society Name *
            </label>
            <input
              type="text"
              placeholder="e.g. IEEE Student Branch, Dramatics Society"
              {...register("name", { required: "Society name is required" })}
              className="w-full px-4 py-2.5 rounded-xl bg-field border-0 text-sm text-m3-text placeholder:text-m3-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition"
            />
            {errors.name && <p className="text-xs text-m3-danger mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-m3-text mb-1">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-field border-0 text-sm text-m3-text focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Predefined College Dropdown (No hardcoded NSUT) */}
            <div>
              <label className="block text-xs font-semibold text-m3-text mb-1">
                College *
              </label>
              <select
                {...register("college", { required: "College is required" })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-field border-0 text-sm text-m3-text focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition cursor-pointer"
              >
                <option value="">-- Choose college --</option>
                {colleges.map((col) => (
                  <option key={col._id} value={col._id}>
                    {col.shortCode ? `${col.shortCode} - ` : ""}
                    {col.name}
                  </option>
                ))}
              </select>
              {errors.college && <p className="text-xs text-m3-danger mt-1">{errors.college.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-m3-text mb-1">
              Registration Start Date *
            </label>
            <input
              type="date"
              {...register("startdate", { required: "Start date is required" })}
              className="w-full px-4 py-2.5 rounded-xl bg-field border-0 text-sm text-m3-text focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition"
            />
            {errors.startdate && <p className="text-xs text-m3-danger mt-1">{errors.startdate.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-m3-text mb-1">
              About Society *
            </label>
            <textarea
              rows="4"
              placeholder="Describe your society's purpose, recruitment vision, and achievements..."
              {...register("about", {
                required: "Description is required",
                minLength: { value: 20, message: "Description must be at least 20 characters" },
              })}
              className="w-full px-4 py-2.5 rounded-xl bg-field border-0 text-sm text-m3-text placeholder:text-m3-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition leading-relaxed"
            ></textarea>
            {errors.about && <p className="text-xs text-m3-danger mt-1">{errors.about.message}</p>}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-full text-xs font-medium text-m3-muted hover:bg-field cursor-pointer outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-colors duration-200 disabled:opacity-50 cursor-pointer outline-none"
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
