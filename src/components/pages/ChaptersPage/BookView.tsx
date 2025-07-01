"use client";

import { useRouter } from "next/navigation";
import { Section, BookViewProps } from "@/lib/types";
import { ParsedContent, applyTitleFilter } from "@/lib/ContentFilters";
import { ArrowLeft, ArrowRight, BookOpen, Home } from "lucide-react";

export default function BookView({
  sections,
  currentChapter,
  filename,
}: BookViewProps) {
  const router = useRouter();

  const goToChapter = (idx: number | null) => {
    if (idx === null) {
      router.push(`/chapters/${filename}`);
    } else {
      // Navigate to /articles/[filename]/[categoryId]
      const categoryId = sections[idx]?.id;
      if (categoryId) {
        router.push(`/chapters/${filename}/${categoryId}`);
      } else {
        // Fallback if no categoryId
        router.push(`/chapters/${filename}`);
      }
    }
  };

  if (!sections[currentChapter]) {
    return null;
  }

  const isFirstChapter = currentChapter === 0;
  const isLastChapter = currentChapter === sections.length - 1;

  return (
    <>
      {/* Main Content */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-6 ">
          <div className="flex items-center gap-4">
            <div className="bg-accent/20 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-right">
                {applyTitleFilter(
                  sections[currentChapter].title || `فصل ${currentChapter + 1}`
                )}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-right mt-1">
                الفصل {currentChapter + 1} من {sections.length}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 lg:p-12">
          <div className="prose prose-lg md:prose-xl max-w-none text-right">
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg md:text-xl whitespace-pre-wrap font-medium">
              {ParsedContent({ content: sections[currentChapter].content })}
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Fixed */}
        <div className="hidden md:fixed md:bottom-6 md:left-1/2 md:transform md:-translate-x-1/2 md:flex items-center gap-4 p-4 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl z-50">
          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isFirstChapter
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-accent/10 text-accent hover:bg-accent/20 hover:scale-105 active:scale-95"
            }`}
            onClick={() => goToChapter(currentChapter - 1)}
            disabled={isFirstChapter}
          >
            <ArrowRight className="w-5 h-5" />
            الفصل السابق
          </button>

          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black/20 dark:bg-white/20  text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => goToChapter(null)}
          >
            <Home className="w-5 h-5" />
            العودة للفهرس
          </button>

          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isLastChapter
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-accent/10 text-accent hover:bg-accent/20 hover:scale-105 active:scale-95"
            }`}
            onClick={() => goToChapter(currentChapter + 1)}
            disabled={isLastChapter}
          >
            الفصل التالي
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Spacer for fixed desktop navigation */}
        <div className="hidden md:block h-24"></div>
      </div>

      {/* Fixed Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark z-50">
        <div className="flex items-center justify-between p-4">
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex-1 mr-2 ${
              isFirstChapter
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-accent/10 text-accent hover:bg-accent/20 active:scale-95"
            }`}
            onClick={() => goToChapter(currentChapter - 1)}
            disabled={isFirstChapter}
          >
            <ArrowRight className="w-4 h-4" />
            <span className="text-sm">السابق</span>
          </button>

          <button
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/20 dark:bg-white/20 font-medium  transition-all duration-200 active:scale-95 mx-2"
            onClick={() => goToChapter(null)}
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">الفهرس</span>
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex-1 ml-2 ${
              isLastChapter
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-accent/10 text-accent hover:bg-accent/20 active:scale-95"
            }`}
            onClick={() => goToChapter(currentChapter + 1)}
            disabled={isLastChapter}
          >
            <span className="text-sm">التالي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Spacer for fixed mobile navigation */}
      <div className="md:hidden h-20"></div>
    </>
  );
}
