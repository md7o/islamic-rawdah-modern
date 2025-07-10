"use client";

import { useSearchParams } from "next/navigation";
import { Section } from "@/lib/types";
import { ParsedContent } from "@/lib/ContentFilters";
import { ArrowLeft, ArrowRight, BookOpen, Home } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Select, SelectItem } from "@/components/ui/shadcn/select";
import Link from "next/link";

interface BookViewProps {
  sections: Section[];
  currentChapter: number;
  filename: string;
}

export default function BookView({
  sections,
  currentChapter: initialChapter,
  filename,
}: BookViewProps) {
  const searchParams = useSearchParams();
  const highlightQuery = searchParams.get("q") || "";
  const [fontSize, setFontSize] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("bookview-font-size") || "text-lg"
      : "text-lg"
  );
  const [fontFamily, setFontFamily] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("bookview-font-family") || "font-sans"
      : "font-sans"
  );
  const [currentChapter, setCurrentChapter] = useState(initialChapter);

  useEffect(() => {
    setCurrentChapter(initialChapter);
  }, [initialChapter, sections]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bookview-font-size", fontSize);
      localStorage.setItem("bookview-font-family", fontFamily);
    }
  }, [fontSize, fontFamily]);

  useEffect(() => {
    scrollTo(0, 0);
  }, [sections, currentChapter, filename]);

  const goToChapter = (idx: number | null) => {
    if (idx === null) {
      setCurrentChapter(0);
      return;
    }
    if (idx >= 0 && idx < sections.length) {
      setCurrentChapter(idx);
    }
  };

  if (!sections[currentChapter]) return null;
  const isFirst = currentChapter === 0;
  const isLast = currentChapter === sections.length - 1;

  return (
    <article>
      {/* Font Controls */}
      <div className="flex flex-col items-center sm:flex-row gap-3 sm:gap-4 justify-between mb-4 p-3 sm:p-4  dark:bg-surface-dark rounded-lg">
        <div className="flex flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 justify-between sm:justify-start">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              حجم الخط:
            </label>
            <div className="min-w-0 flex-1 sm:flex-none sm:w-auto">
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectItem value="text-lg">صغير</SelectItem>
                <SelectItem value="text-xl">متوسط</SelectItem>
                <SelectItem value="text-2xl">كبير</SelectItem>
                <SelectItem value="text-3xl">كبير جداً</SelectItem>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-between sm:justify-start">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              نوع الخط:
            </label>
            <div className="min-w-0 flex-1 sm:flex-none sm:w-auto">
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectItem value="font-sans">Sans</SelectItem>
                <SelectItem value="font-[kufam]">Kufam</SelectItem>
                <SelectItem value="font-[amiri]">Amiri</SelectItem>
                <SelectItem value="font-[Aref_Ruqaa]">Ruqaa</SelectItem>
              </Select>
            </div>
          </div>
        </div>

        <Link
          href={""}
          className="group inline-flex items-center gap-3 px-5 py-1 bg-base-secondary dark:bg-base-bg rounded-xl shadow-md hover:shadow-lg  text-accent hover:text-accent/90 transition-all duration-300 "
        >
          <div className="bg-accent/10 p-2 rounded-lg group-hover:bg-accent/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span>العودة إلى الرئيسية</span>
        </Link>
      </div>
      {/* Main Content */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg overflow-hidden ">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-6 ">
          <div className="flex items-center gap-4">
            <div className="bg-accent/20 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-right">
                {sections[currentChapter].title || `فصل ${currentChapter + 1}`}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-right mt-1">
                الفصل {currentChapter + 1} من {sections.length}
              </p>
            </div>
          </div>
        </div>
        {/* Content */}
        <div
          className={`p-5 md:p-8 lg:p-12 font-normal ${fontSize} ${fontFamily}`}
        >
          <ParsedContent
            content={sections[currentChapter].content}
            highlight={highlightQuery}
            fontFamily={fontFamily}
          />
        </div>

        {/* Desktop Navigation - Fixed */}
        <div className="hidden md:fixed md:bottom-6 md:left-1/2 md:transform md:-translate-x-1/2 md:flex items-center gap-4 p-4 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl z-50">
          <Button
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isFirst
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-accent/10 text-accent hover:bg-accent/20 hover:scale-105 active:scale-95"
            }`}
            onClick={() => goToChapter(currentChapter - 1)}
            disabled={isFirst}
          >
            <ArrowRight className="w-5 h-5" />
            السابق
          </Button>

          {/* Link to ChaptersViewe r */}
          <Link href={`/chapters/${filename}`}>
            <Button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black/20 dark:bg-white/20  text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 hover:scale-105 active:scale-95">
              <Home className="w-5 h-5" />
              العودة للفهرس
            </Button>
          </Link>
          <Button
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isLast
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-accent/10 text-accent hover:bg-accent/20 hover:scale-105 active:scale-95"
            }`}
            onClick={() => goToChapter(currentChapter + 1)}
            disabled={isLast}
          >
            التالي
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Spacer for fixed desktop navigation */}
        <div className="hidden md:block h-24"></div>
      </div>

      {/* Fixed Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark z-50">
        <div className="flex items-center justify-between p-4">
          <Button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex-1 mr-2 ${
              isFirst
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-accent/10 text-accent hover:bg-accent/20 active:scale-95"
            }`}
            onClick={() => goToChapter(currentChapter - 1)}
            disabled={isFirst}
          >
            <ArrowRight className="w-4 h-4" />
            <span className="text-sm">السابق</span>
          </Button>
          <Link href={`/chapters/${filename}`}>
            <Button
              className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:scale-105 rounded-xl bg-black/20 dark:bg-white/20 font-medium  transition-all duration-200 active:scale-95 mx-2"
              onClick={() => goToChapter(null)}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">الفهرس</span>
            </Button>
          </Link>
          <Button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex-1 ml-2 ${
              isLast
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-accent/10 text-accent hover:bg-accent/20 active:scale-95"
            }`}
            onClick={() => goToChapter(currentChapter + 1)}
            disabled={isLast}
          >
            <span className="text-sm">التالي</span>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Spacer for fixed mobile navigation */}
      <div className="md:hidden h-20"></div>
    </article>
  );
}
