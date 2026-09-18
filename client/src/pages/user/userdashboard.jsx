import React, { useState, useEffect } from 'react';
import SocietyCard from '../../components/SocietyCard';
import { getrequest } from '../../utilitis/fetch';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  LayoutGrid,
  Code,
  Palette,
  Drama,
  Trophy,
  BookOpen,
  Music,
  Flame,
  Users,
  Briefcase,
  Compass,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Technology",
  "Cultural",
  "Dramatics",
  "Sports",
  "Literary",
  "Music",
  "Dance",
  "Social",
  "Entrepreneurship",
  "Other",
];

const CATEGORY_ICONS = {
  All: LayoutGrid,
  Technology: Code,
  Cultural: Palette,
  Dramatics: Drama,
  Sports: Trophy,
  Literary: BookOpen,
  Music: Music,
  Dance: Flame,
  Social: Users,
  Entrepreneurship: Briefcase,
  Other: Compass,
};

const Userdashboard = () => {
  const [allSocieties, setAllSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getrequest("http://localhost:3000/api/member/displayallsociety");
        setAllSocieties(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to fetch societies:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = allSocieties.filter((s) => {
    return selectedCategory === "All" || s.category === selectedCategory;
  });

  return ( 
    <div className="w-full max-w-7xl mx-auto space-y-4 pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-2xl p-5 sm:p-7 text-white shadow-sm">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-0.5 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-xs mb-2">
            Recruitment Season 2025-26
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Discover & Join Student Societies
          </h1>
          <p className="text-purple-200 mt-1.5 text-xs sm:text-sm leading-relaxed">
            Explore diverse technical, cultural, and sports societies at your college. Find your community, build skills, and take part in recruitment rounds.
          </p>
        </div>
      </div>

      {/* Category Tabs Navigation with ScrollArea */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap rounded-2xl">
          <TabsList className="flex w-max space-x-1.5 p-1.5 bg-[#F3F3E8] rounded-2xl border border-black/5">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Compass;
              return (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm gap-2"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{cat}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Tabs>

      {/* Societies Cards Grid */}
      <SocietyCard societies={filtered} loading={loading} />
    </div>
  );
};

export default Userdashboard;
