import React from "react";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#fcfcfc] flex flex-col font-sans text-gray-900">
      {/* Floating Navbar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <Navbar />
      </header>

      {/* Main Hero & Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 flex flex-col items-center text-center">
        {/* 1. Large Centered Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-black max-w-3xl leading-[1.1]">
          Recruitment made simple!
        </h1>

        {/* 2. Short Paragraph Below It */}
        <p className="mt-6 text-base sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
          A modern recruitment platform empowering colleges and student societies to run organized, multi-round recruitment drives in one streamlined workspace.
        </p>

        {/* Call to action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
          <Link
            to="/signin"
            className="w-full sm:w-auto px-6 py-3 bg-black text-white text-sm font-semibold rounded-[12px] border border-black hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 bg-white text-black text-sm font-semibold rounded-[12px] border border-black/15 hover:border-black transition-colors duration-200 cursor-pointer"
          >
            Sign In to Account
          </Link>
        </div>

        {/* 3. Exactly 3 Feature Cards */}
        <div id="features" className="mt-20 sm:mt-24 w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Feature Card 1 */}
          <div className="p-7 rounded-2xl bg-white border border-black/10 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center font-bold text-black mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-black tracking-tight">
                Multi-College Support
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Connect multiple colleges and student communities under one platform with verified institution directories and isolated society domains.
              </p>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="p-7 rounded-2xl bg-white border border-black/10 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center font-bold text-black mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-black tracking-tight">
                Streamlined Evaluations
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Track sequential recruitment rounds, coordinate department reviews, and notify selected candidates with automated decision emails.
              </p>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="p-7 rounded-2xl bg-white border border-black/10 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center font-bold text-black mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-black tracking-tight">
                Real-Time Analytics
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Gain instant visibility into applicant distributions, department enrollments, and recruitment health through clean aggregated visual dashboards.
              </p>
            </div>
          </div>
        </div>

        {/* 4. End of page (no extra sections) */}
      </main>
    </div>
  );
};

export default LandingPage;
