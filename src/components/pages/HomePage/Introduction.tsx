"use client";

import CircleDash from "@/components/ui/custom/CircleDash";
import { InfiniteMarquee } from "@/components/ui/custom/InfiniteMarquee";
import { Mouse, BookOpen, Book, Star, Heart, Library } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";

const NAV_TABS = [
  {
    label: "المقالات",
    value: "articles",
    icon: Book,
    section: "articles-section",
  },
  { label: "الكتب", value: "books", icon: Library, section: "books-section" },
];

export default function Introduction() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen relative overflow-hidden mb-20">
      <div className="relative z-10 py-20 px-4 flex flex-col items-center justify-center text-center min-h-screen">
        {/* Hero Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl scale-125 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-accent via-accent/90 to-accent/80 p-8 rounded-3xl shadow-2xl">
            <BookOpen className="text-white w-16 h-16" />
          </div>
          <div className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg">
            <Star className="text-accent w-5 h-5 fill-accent" />
          </div>
        </div>
        {/* Main Title */}
        <h1 className="text-5xl md:text-8xl text-accent font-bold mb-6 relative">
          موقع الروضة الإسلامي
        </h1>
        {/* Subtitle */}
        <div className="relative mb-8">
          <p className="text-2xl md:text-3xl max-w-4xl  leading-relaxed mb-4 font-medium">
            تجربة قراءة جديدة للكتب الإسلامية
          </p>
          <div className="flex items-center justify-center gap-4 text-accent/70">
            <Book className="w-6 h-6" />
            <div className="w-16 h-px bg-accent/30"></div>
            <Heart className="w-5 h-5 fill-accent/50" />
            <div className="w-16 h-px bg-accent/30"></div>
            <Star className="w-5 h-5 fill-accent/50" />
          </div>
        </div>
        <CircleDash />
        {/* Navigation Tabs */}
        <div className="my-5 w-full max-w-3xl">
          <div className="relative">
            <Tabs defaultValue="articles" className="relative w-full">
              <TabsList className="grid w-full grid-cols-2 border-2 border-accent/30 rounded-sm h-10 text-white transition-all duration-500">
                {NAV_TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      onClick={() => scrollToSection(tab.section)}
                      className="text-accent dark:text-accent group relative flex items-center justify-center gap-4 text-xl font-bold px-8 rounded-sm overflow-hidden transition-all hover:bg-accent/10 hover:text-accent border data-[state=active]:scale-[1.02] cursor-pointer"
                    >
                      <div className="relative flex items-center gap-4 z-10">
                        <div className="relative">
                          <Icon className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-accent/20 rounded-full blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {tab.label}
                        </span>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>
        {/* Marquees */}
        <div className="w-full max-w-6xl space-y-4 my-5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-2xl blur-xl"></div>
            {/* === First Marquees === */}
            <InfiniteMarquee
              className="marquee-fast relative bg-gradient-to-r from-accent/70 to-accent text-white rounded-2xl py-2 shadow-lg border border-accent/30"
              pauseOnHover
            >
              <p className="text-lg px-8 whitespace-nowrap">
                📚 اكتشف كنوز التراث الإسلامي • 🌟 رحلة معرفية شيقة • 📖 كتب
                منتقاة بعناية • ✨ تجربة قراءة متميزة 📚 اكتشف كنوز التراث
                الإسلامي • 🌟 رحلة معرفية شيقة • 📖 كتب منتقاة بعناية • ✨ تجربة
                قراءة متميزة
              </p>
            </InfiniteMarquee>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/15 via-accent/8 to-accent/15 rounded-2xl blur-xl"></div>
            <InfiniteMarquee
              className="marquee-fast relative bg-gradient-to-l from-accent/70 to-accent text-white rounded-2xl py-2 shadow-lg border border-accent/30"
              reverse
              pauseOnHover
            >
              <p className="text-lg px-8 whitespace-nowrap">
                🕌 علوم شرعية أصيلة • 📚 مكتبة رقمية شاملة • 🌙 تراث إسلامي عريق
                • 💎 معرفة نافعة مباركة
              </p>
            </InfiniteMarquee>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="text-accent/70 text-sm mb-2 font-medium">
            اكتشف المزيد
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-md scale-150 animate-pulse"></div>
            <Mouse
              className="relative animate-bounce text-accent bg-white rounded-full p-2 shadow-lg"
              size={40}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
