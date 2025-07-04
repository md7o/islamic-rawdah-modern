"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BookViewProps } from "@/lib/types";
import { ParsedContent } from "@/lib/ContentFilters";
import { ArrowLeft, ArrowRight, BookOpen, Home } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Select, SelectItem } from "@/components/ui/shadcn/select";
import {
  fetchTotalPages,
  incrementTotalPages,
  incrementDailyPages,
} from "@/lib/api";

export default function BookView({
  sections,
  currentChapter,
  filename,
}: BookViewProps) {
  const router = useRouter();
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
  const lastIncrementedChapter = useRef<number | null>(null);

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
    if (idx === null) return router.push(`/chapters/${filename}`);
    const categoryId = sections[idx]?.id;
    if (categoryId) router.push(`/chapters/${filename}/${categoryId}`);
  };

  useEffect(() => {
    if (lastIncrementedChapter.current !== currentChapter) {
      incrementTotalPages(1).catch(() => {});
      incrementDailyPages(1).catch(() => {});
      lastIncrementedChapter.current = currentChapter;
    }
  }, [currentChapter]);

  if (!sections[currentChapter]) return null;
  const isFirst = currentChapter === 0;
  const isLast = currentChapter === sections.length - 1;

  return (
    <article>
      {/* Total Pages Counter */}
      <div className="flex justify-end mb-2"></div>
      {/* Font Controls */}
      <div className="flex gap-4 justify-end mb-4 p-4 0 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            حجم الخط:
          </label>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectItem value="text-base">صغير</SelectItem>
            <SelectItem value="text-lg">متوسط</SelectItem>
            <SelectItem value="text-xl">كبير</SelectItem>
            <SelectItem value="text-2xl">كبير جداً</SelectItem>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            الخط:
          </label>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectItem value="font-sans">Sans</SelectItem>
            <SelectItem value="font-serif">Serif</SelectItem>
            <SelectItem value="font-[amiri]">Amiri</SelectItem>
            <SelectItem value="font-mono">Mono</SelectItem>
          </Select>
        </div>
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-right">
                {sections[currentChapter].title || `فصل ${currentChapter + 1}`}
              </h1>
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

          <Button
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black/20 dark:bg-white/20  text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => goToChapter(null)}
          >
            <Home className="w-5 h-5" />
            العودة للفهرس
          </Button>

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

          <Button
            className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:scale-105 rounded-xl bg-black/20 dark:bg-white/20 font-medium  transition-all duration-200 active:scale-95 mx-2"
            onClick={() => goToChapter(null)}
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">الفهرس</span>
          </Button>

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
