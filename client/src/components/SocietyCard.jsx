import React, { useEffect, useState } from 'react';
import { getrequest } from '../utilitis/fetch';
import { useNavigate } from 'react-router-dom';

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
        const response = await getrequest("http://localhost:3000/api/member/displayallsociety");
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-64 rounded-2xl bg-white/70 border border-black/5 animate-pulse p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/3"></div>
              <div className="h-12 bg-gray-100 rounded w-full"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-black/10 p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
        <div className="text-4xl mb-3">😞</div>
        <h3 className="text-lg font-bold text-gray-900">No societies found</h3>
        <p className="text-sm text-gray-500 mt-1">There are no societies matching your criteria at this moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((society) => (
        <div
          key={society._id}
          onClick={() => navigate(`/home/displaysociety/${society._id}`)}
          className="
            group
            flex flex-col
            min-h-[280px]
            rounded-2xl
            border border-black/10
            bg-white
            p-5 sm:p-6
            transition-all duration-300
            hover:-translate-y-1
            hover:border-purple-300
            hover:shadow-md
            cursor-pointer
          "
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight text-black line-clamp-1 group-hover:text-purple-900 transition">
              {society.name}
            </h2>

            <span className="shrink-0 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-900 border border-purple-200">
              {society.category}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <span>College: <strong className="text-gray-700 font-semibold">{society.college || "NSUT"}</strong></span>
            <span>•</span>
            <span>Reg: <strong className="text-gray-700 font-semibold">{society.startdate ? society.startdate.split("T")[0] : "TBA"}</strong></span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-3">
            {society.about}
          </p>

          <div className="mt-auto pt-5 flex items-center justify-between border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium">
              {society.departments?.length || 0} Departments
            </span>

            <span className="text-sm font-semibold text-purple-800 transition-transform duration-200 group-hover:translate-x-1 flex items-center gap-1 *:">
              Explore <span>→</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocietyCard;