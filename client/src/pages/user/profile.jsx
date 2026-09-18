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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/user/getuserdetails`);
        const details = res.details || res;
        if (details) {
          if (details.dob) {
            details.dob = details.dob.split("T")[0];
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
    loadProfile();
  }, [reset, dispatch]);

  const onSubmit = async (data) => {
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
  };

  return (
    <div className="w-full flex items-center justify-center py-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          w-full max-w-3xl
          flex flex-col
          gap-5
          rounded-2xl
          border border-[#deded0]
          bg-[#fffef5]
          p-7
          shadow-[0_4px_20px_rgba(0,0,0,0.05)]
        "
      >
        <h2 className="text-2xl font-semibold text-black">
          User Profile!
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full">
            <input
              type="text"
              placeholder="First Name"
              {...register("f_name", {
                required: "First Name is required",
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

            {errors.f_name && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.f_name.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <input
              type="text"
              placeholder="Last Name"
              {...register("l_name", {
                required: "Last Name is required",
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

            {errors.l_name && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.l_name.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <input
            type="date"
            {...register("dob")}
            className="
              w-full
              p-3.5
              rounded-lg
              border border-[#d8d8cc]
              text-black
              outline-none
              focus:border-black
              transition
            "
          />

          {errors.dob && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.dob.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            {...register("p_number", {
              required: "Phone Number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Please provide a 10 digit number",
              },
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

          {errors.p_number && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.p_number.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            value="NSUT"
            readOnly
            {...register("college")}
            className="
              w-full
              p-3.5
              rounded-lg
              border border-[#d8d8cc]
              bg-gray-100
              text-black
              outline-none
            "
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full">
            <input
              type="number"
              placeholder="Batch Start (e.g. 2025)"
              {...register("batch_start", {
                required: "Batch start is required",
                min: {
                  value: 2000,
                  message: "Batch start must be between 2000 and 2100",
                },
                max: {
                  value: 2100,
                  message: "Batch start must be between 2000 and 2100",
                },
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

            {errors.batch_start && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.batch_start.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <input
              type="number"
              placeholder="Batch End (e.g. 2029)"
              {...register("batch_end", {
                required: "Batch end is required",
                min: {
                  value: 2000,
                  message: "Batch end must be between 2000 and 2100",
                },
                max: {
                  value: 2100,
                  message: "Batch end must be between 2000 and 2100",
                },
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

            {errors.batch_end && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.batch_end.message}
              </p>
            )}
          </div>
        </div>


        <div>
          <input
            type="text"
            placeholder="Roll No. (2025-XYZ-1234)"
            {...register("roll_no", {
              required: "Roll Number is required",
              pattern: {
                value: /^\d{4}-[A-Za-z]{3}-\d{4}$/,
                message:
                  "Roll No should be in the format 2025-XYZ-1234",
              },
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

          {errors.roll_no && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.roll_no.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Branch"
            {...register("branch", {
              required: "Branch is required",
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

          {errors.branch && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.branch.message}
            </p>
          )}
        </div>

        {/* GitHub */}
        <div>
          <input
            type="url"
            placeholder="GitHub Profile URL"
            {...register("github")}
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

          {errors.github && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.github.message}
            </p>
          )}
        </div>

        {/* LinkedIn */}
        <div>
          <input
            type="url"
            placeholder="LinkedIn Profile URL"
            {...register("linkdin")}
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

          {errors.linkdin && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.linkdin.message}
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
          Submit
        </button>
        
        <button
         className="
            w-full
            rounded-lg
            border border-black/70
           
            p-2.5
            text-lg
            font-semibold
            text-black
            cursor-pointer
            transition
            hover:bg-purple-100
          " 
          onClick={()=>{
            navigate('/home')
          }}>
            Cancel
        </button>
      </form>
    </div>
  );
};

export default Profile;