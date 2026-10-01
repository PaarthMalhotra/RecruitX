import React from "react";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full bg-page flex flex-col font-sans text-m3-text scroll-smooth">
      {/* Floating Navbar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <Navbar />
      </header>

      {/* Main Hero & Content with soft #EAF1FB to white gradient background */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 flex flex-col items-center text-center">
        {/* Soft background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-field via-field/50 to-transparent -z-10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Large Centered Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-m3-text max-w-3xl leading-[1.1]">
          Recruitment made simple!
        </h1>

        {/* 2. Short Paragraph Below It */}
        <p className="mt-6 text-base sm:text-xl text-m3-muted max-w-2xl leading-relaxed">
          A modern recruitment platform empowering colleges and student societies to run organized, multi-round recruitment drives in one streamlined workspace.
        </p>

        {/* Action button in Primary Blue with Pill Shape */}
        <div className="mt-8 flex items-center justify-center">
          <Link
            to="/login"
            className="px-7 py-3 bg-primary text-white text-sm font-semibold rounded-full border border-primary hover:bg-primary-hover transition-colors duration-200 cursor-pointer outline-none shadow-xs"
          >
            Sign In to Account
          </Link>
        </div>

        {/* 3. Exactly 3 Feature Cards (white cards with 16px radius and #D3E3FD circle icons) */}
        <div id="about" className="mt-20 sm:mt-24 w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left scroll-mt-24">
          {/* Feature Card 1 */}
          <div className="p-7 rounded-[16px] bg-surface border border-m3-border/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-active-tint flex items-center justify-center font-bold text-primary mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-m3-text tracking-tight">
                Multi-College Support
              </h3>
              <p className="mt-2 text-sm text-m3-muted leading-relaxed">
                Connect multiple colleges and student communities under one platform with verified institution directories and isolated society domains.
              </p>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="p-7 rounded-[16px] bg-surface border border-m3-border/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-active-tint flex items-center justify-center font-bold text-primary mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-m3-text tracking-tight">
                Streamlined Evaluations
              </h3>
              <p className="mt-2 text-sm text-m3-muted leading-relaxed">
                Track sequential recruitment rounds, coordinate department reviews, and notify selected candidates with automated decision emails.
              </p>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="p-7 rounded-[16px] bg-surface border border-m3-border/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-active-tint flex items-center justify-center font-bold text-primary mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-m3-text tracking-tight">
                Real-Time Analytics
              </h3>
              <p className="mt-2 text-sm text-m3-muted leading-relaxed">
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
