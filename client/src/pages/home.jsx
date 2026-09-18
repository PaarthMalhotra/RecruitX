import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { Outlet } from "react-router-dom";
import SideBar from '../components/SideBar';

const Home = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#FFFFF0] flex flex-col overflow-hidden">
      <header className="px-3 sm:px-4 pt-2 sm:pt-2.5 pb-0">
        <Navbar toggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)} />
      </header>

      <div className="flex-1 flex gap-2.5 sm:gap-3 px-3 sm:px-4 pt-1.5 sm:pt-2 pb-2 sm:pb-2.5 min-h-0 overflow-hidden relative">
        <SideBar
          isMobileOpen={isMobileOpen}
          closeMobileSidebar={() => setIsMobileOpen(false)}
        />

        <main className="flex-1 min-w-0 h-full overflow-y-auto pr-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;