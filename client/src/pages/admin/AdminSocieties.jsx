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
      const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/member/displayallsociety`);
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
      const res = await deleterequest(`${import.meta.env.VITE_API_URL}/api/admin/deletesociety/${deleteTarget._id}`);

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

  // B7.2: Search box searches SOCIETY NAME ONLY
  const filtered = societies.filter((s) => {
    const matchesCat = categoryFilter === "All" || s.category === categoryFilter;
    const q = search.toLowerCase().trim();
    const matchesQuery = !q || s.name?.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  // B7.2: Group societies by college name
  const groupedByCollege = filtered.reduce((acc, soc) => {
    const colName =
      soc.college?.name ||
      soc.college?.shortCode ||
      (typeof soc.college === "string" ? soc.college : "Unassigned College");
    if (!acc[colName]) {
      acc[colName] = [];
    }
    acc[colName].push(soc);
    return acc;
  }, {});

  const collegeGroups = Object.entries(groupedByCollege).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="w-full max-w-7xl mx-auto pb-10 space-y-6 font-sans text-m3-text">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-m3-muted mb-1">
            <Link to="/home/admindashboard" className="font-semibold text-primary hover:underline">
              ← Admin Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-m3-text tracking-tight">
            All Societies
          </h1>
          <p className="text-xs text-m3-muted">
            Societies grouped by college. Inspect recruitment details or delete non-compliant chapters.
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs font-bold px-3.5 py-1.5 bg-field text-primary rounded-full border border-m3-border/60">
          {societies.length} Societies Total
        </span>
      </div>

      {/* Filter and Search Bar: searches society name ONLY */}
      <div className="bg-surface rounded-2xl border border-m3-border/60 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by society name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-field border-0 text-xs text-m3-text placeholder:text-m3-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-full border border-m3-border/80 text-xs text-m3-text bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition cursor-pointer"
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

      {/* B7.2: Grouped by College Name, all societies always visible (NO expand/collapse) */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-surface rounded-2xl border border-m3-border/60 p-6 space-y-3 animate-pulse">
              <div className="h-6 bg-field rounded-full w-48"></div>
              <div className="h-16 bg-field/60 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : collegeGroups.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-m3-border/60 p-12 text-center space-y-2">
          <p className="text-m3-muted text-sm">No societies match your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {collegeGroups.map(([collegeName, socList]) => (
            <div key={collegeName} className="bg-surface rounded-2xl border border-m3-border/60 shadow-xs overflow-hidden">
              {/* College Group Header */}
              <div className="px-6 py-4 bg-field border-b border-m3-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-bold text-m3-text">{collegeName}</h2>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface text-m3-muted border border-m3-border/60">
                  {socList.length} {socList.length === 1 ? "society" : "societies"}
                </span>
              </div>

              {/* Society List Table - All always visible */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-m3-border text-xs font-bold text-m3-muted uppercase tracking-wider bg-field/40">
                      <th className="py-3 px-6">Society Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Registration</th>
                      <th className="py-3 px-4 text-center">Departments</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-m3-border/40 text-xs sm:text-sm">
                    {socList.map((soc) => (
                      <tr key={soc._id} className="hover:bg-field/30 transition">
                        <td className="py-3.5 px-6 font-bold text-m3-text">
                          <div>
                            <span>{soc.name}</span>
                            <p className="text-xs text-m3-muted font-normal line-clamp-1 max-w-sm mt-0.5">
                              {soc.about}
                            </p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-field text-m3-text border border-m3-border/60">
                            {soc.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-m3-muted">
                          {soc.startdate ? soc.startdate.split("T")[0] : "TBA"}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-field text-m3-text">
                            {soc.departments?.length || 0}
                          </span>
                        </td>
                        {/* Right: Delete and View buttons */}
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/home/displaysociety/${soc._id}`}
                              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-tonal text-tonal-text hover:bg-active-tint transition"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(soc)}
                              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-50 hover:bg-red-100 text-m3-danger border border-red-200 transition cursor-pointer"
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
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-surface rounded-2xl border border-m3-border shadow-2xl max-w-md w-full p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-m3-text">
                Delete Society "{deleteTarget.name}"?
              </h3>
              <p className="text-xs sm:text-sm text-m3-muted mt-1.5 leading-relaxed">
                Are you sure you want to permanently delete this society? All department tracks, rounds, and associated student applications will be removed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-full text-xs font-medium text-m3-muted hover:bg-field cursor-pointer outline-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-m3-danger text-white hover:bg-red-700 cursor-pointer transition disabled:opacity-50 outline-none"
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
