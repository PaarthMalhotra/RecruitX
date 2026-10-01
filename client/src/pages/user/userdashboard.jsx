import React, { useState, useEffect } from "react";
import SocietyCard from "../../components/SocietyCard";
import { getrequest } from "../../utilitis/fetch";
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
        const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/member/displayallsociety`);
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
    <div className="w-full max-w-7xl mx-auto space-y-5 pb-8">
      {/* Header Banner: Tasteful muted slate/zinc fitting minimalist B&W theme (B5) */}
      <div className="bg-gradient-to-r from-stone-900 via-zinc-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xs border border-zinc-700/40">
        <div className="max-w-2xl space-y-2">
          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-xs text-zinc-200 border border-white/10">
            Recruitment Season 2025–26
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Discover & Join Student Societies
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
            Explore diverse technical, cultural, and sports societies across colleges. Find your community, build skills, and take part in multi-round recruitment drives.
          </p>
        </div>
      </div>

      {/* Category Tabs Navigation with ScrollArea */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap rounded-2xl">
          <TabsList className="flex w-max space-x-1.5 p-1.5 bg-white rounded-2xl border border-black/10 shadow-xs">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Compass;
              return (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm gap-2 data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
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
