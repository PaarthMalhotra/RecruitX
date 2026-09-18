import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getrequest, deleterequest } from "../../utilitis/fetch";
import { toast } from "sonner";

const AdminSocieties = () => {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Deletion Modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSocieties = async () => {
    try {
      setLoading(true);
      const res = await getrequest("http://localhost:3000/api/member/displayallsociety");
      if (Array.isArray(res)) {
        setSocieties(res);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load societies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocieties();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleterequest(`http://localhost:3000/api/admin/deletesociety/${deleteTarget._id}`);

      if (res.success || res.Success) {
        toast.success(`Society '${deleteTarget.name}' deleted successfully`);
        setSocieties((prev) => prev.filter((s) => s._id !== deleteTarget._id));
        setDeleteTarget(null);
      } else {
        toast.error(res.message || "Failed to delete society");
      }
    } catch (err) {
      toast.error("Error occurred while deleting society");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = societies.filter((s) => {
    const matchesCat = categoryFilter === "All" || s.category === categoryFilter;
    const q = search.toLowerCase().trim();
    const matchesQuery =
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.about?.toLowerCase().includes(q) ||
      s.college?.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/home/admindashboard" className="text-xs font-semibold text-gray-500 hover:text-black">
              ← Admin Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight mt-1">
            Society Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Inspect all active societies on the platform or delete non-compliant societies.
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-red-100 text-red-800 rounded-full border border-red-200">
          {societies.length} Societies Total
        </span>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-black/10 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search society name, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-red-600"
          >
            <option value="All">All Categories</option>
            {["Technology", "Cultural", "Dramatics", "Sports", "Literary", "Music", "Dance", "Social", "Entrepreneurship", "Other"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Societies Table */}
      <div className="bg-white rounded-3xl border border-black/10 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-gray-500 text-sm">No societies match your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9E6]/60 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Society Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">College</th>
                  <th className="py-3.5 px-4">Registration</th>
                  <th className="py-3.5 px-4 text-center">Departments</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map((soc) => (
                  <tr key={soc._id} className="hover:bg-red-50/20 transition">
                    <td className="py-4 px-4 sm:px-6 font-bold text-gray-950">
                      <div>
                        <span>{soc.name}</span>
                        <p className="text-xs text-gray-500 font-normal line-clamp-1 max-w-sm mt-0.5">
                          {soc.about}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-200">
                        {soc.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-gray-600">{soc.college}</td>
                    <td className="py-4 px-4 text-xs text-gray-600">
                      {soc.startdate ? soc.startdate.split("T")[0] : "TBA"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                        {soc.departments?.length || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/home/displaysociety/${soc._id}`}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(soc)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-100 hover:bg-red-200 text-red-700 transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal (Section 14 requirement) */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-black/10 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center text-2xl font-bold">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-950">
                Delete Society "{deleteTarget.name}"?
              </h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                Are you sure you want to permanently delete this society? All departments, rounds, and associated student applications will be removed. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Society"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSocieties;
