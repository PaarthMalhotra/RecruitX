import React from "react";
import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-[#fcfcfc] flex flex-col font-sans text-gray-900">
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <Navbar />
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Home;