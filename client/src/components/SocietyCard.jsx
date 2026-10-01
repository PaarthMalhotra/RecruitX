import React, { useEffect, useState } from "react";
import { getrequest } from "../utilitis/fetch";
import { useNavigate } from "react-router-dom";

const SocietyCard = ({ societies: propSocieties, loading: propLoading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (propSocieties !== undefined) {
      setData(propSocieties);
      setLoading(propLoading || false);
      return;
    }

    async function getData() {
      try {
        const response = await getrequest(`${import.meta.env.VITE_API_URL}/api/member/displayallsociety`);
        setData(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error("Failed to load societies:", err);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [propSocieties, propLoading]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="h-60 rounded-[16px] bg-surface border border-m3-border/60 animate-pulse p-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-5 bg-field rounded-full w-3/4"></div>
              <div className="h-3 bg-field rounded-full w-1/3"></div>
              <div className="h-10 bg-field rounded-xl w-full"></div>
            </div>
            <div className="h-6 bg-field rounded-full w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-surface rounded-[16px] border border-m3-border/70 p-10 text-center max-w-lg mx-auto my-8 shadow-xs">
        <h3 className="text-base font-bold text-m3-text">No societies found</h3>
        <p className="text-xs text-m3-muted mt-1">There are no societies matching your criteria at this moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {data.map((society) => {
        const collegeName =
          society.college?.shortCode ||
          society.college?.name ||
          (typeof society.college === "string" ? society.college : "College");

        return (
          <div
            key={society._id}
            onClick={() => navigate(`/home/displaysociety/${society._id}`)}
            className="
              group flex flex-col min-h-[260px]
              rounded-[16px] border border-m3-border/70 bg-surface
              p-5 sm:p-6
              transition-colors duration-150
              hover:border-primary/40 hover:shadow-xs
              cursor-pointer
            "
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold tracking-tight text-m3-text line-clamp-1 group-hover:text-primary transition-colors">
                {society.name}
              </h2>

              <span className="shrink-0 rounded-full bg-field px-3 py-0.5 text-xs font-semibold text-primary border border-active-tint">
                {society.category}
              </span>
            </div>

            <div className="mt-2.5 flex items-center gap-2 text-xs text-m3-muted">
              <span>College: <strong className="text-m3-text font-semibold">{collegeName}</strong></span>
              <span>•</span>
              <span>Reg: <strong className="text-m3-text font-semibold">{society.startdate ? society.startdate.split("T")[0] : "TBA"}</strong></span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-m3-muted line-clamp-3">
              {society.about}
            </p>

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-m3-border/40">
              <span className="text-xs text-m3-muted font-medium">
                {society.departments?.length || 0} Departments
              </span>

              <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:underline">
                Explore <span>→</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SocietyCard;