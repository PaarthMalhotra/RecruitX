import React, { useState } from "react";
import { useSelector } from "react-redux";

const fields = {
  user: ["DashBoard", "Enrolled"],
  member: ["DashBoard", "Add Departments"],
  admin: ["DashBoard", "View Societies"],
};

const NavigationTabs = () => {
  const userRole = useSelector((state) => state.user?.role) || "user";
  const activeTabs = fields[userRole] || fields.user;
  const [field, setField] = useState(activeTabs[0] || "DashBoard");

  return (
    <div className="flex items-center gap-1 rounded-full bg-field p-1 overflow-x-auto max-w-full no-scrollbar border border-m3-border/40">
      {activeTabs.map((fieldName) => {
        const active = fieldName === field;

        return (
          <button
            key={fieldName}
            onClick={() => setField(fieldName)}
            className={`
              rounded-full
              px-3.5 sm:px-4
              py-1.5
              text-xs sm:text-sm
              font-medium
              whitespace-nowrap
              transition-all duration-200
              cursor-pointer
              outline-none
              ${
                active
                  ? "bg-active-tint text-text-active font-semibold shadow-xs"
                  : "text-m3-muted hover:text-m3-text"
              }
            `}
          >
            {fieldName}
          </button>
        );
      })}
    </div>
  );
};

export default NavigationTabs;