import { Article } from "@/lib/types";
import { BookOpen, FileText, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/shadcn/pagination";

interface SearchResultProps {
  results: Article[];
  query: string;
  allArticles?: Article[]; // Add all articles for default display
}

export default function SearchResult({
  results,
  query,
  allArticles = [],
}: SearchResultProps) {
  // Show search results if there's a query, otherwise show all articles
  const displayResults = query ? results : allArticles;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Calculate pagination
  const totalResults = displayResults.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = displayResults.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-accent/20 text-accent font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (totalResults === 0 && query) {
    return (
      <div className="text-center py-16">
        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl p-12 max-w-md mx-auto">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl mb-6">
            <FileText className="w-16 h-16 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            لا توجد نتائج
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            لم يتم العثور على نتائج تحتوي على "{query}"
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            جرب كلمات مفتاحية أخرى أو تأكد من الإملاء
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Simple Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {query ? "نتائج البحث" : "جميع الكتب المقالات"}
        </h2>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-gray-600 dark:text-gray-400">
            {query ? (
              <p>
                <span className="font-semibold text-accent">
                  {totalResults}
                </span>{" "}
                نتيجة للبحث عن
                <span className="mx-2 font-medium text-gray-900 dark:text-white">
                  "{query}"
                </span>
              </p>
            ) : (
              <p>
                <span className="font-semibold text-accent">
                  {totalResults}
                </span>{" "}
                مقال متاح
              </p>
            )}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            صفحة {currentPage} من {totalPages} • عرض {totalResults}
          </div>
        </div>

        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      </div>

      {/* Enhanced Article Grid */}
      <div className="grid gap-8">
        {currentResults.map((article, idx) => (
          <article
            key={`${article.id} + ${idx}`}
            className="group relative bg-gradient-to-br from-surface-light to-surface-light/80 dark:from-surface-dark dark:to-surface-dark/80 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>

            {/* Header Section */}
            <div className="relative p-8 border-b border-gray-200/30 dark:border-gray-700/30">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="bg-gradient-to-br from-accent/20 to-accent/30 p-4 rounded-2xl group-hover:from-accent/30 group-hover:to-accent/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {article.type === "title" ? (
                      <BookOpen className="w-7 h-7 text-accent drop-shadow-sm" />
                    ) : (
                      <FileText className="w-7 h-7 text-accent drop-shadow-sm" />
                    )}
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="relative inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent/15 to-accent/25 text-accent text-sm font-bold rounded-full border border-accent/30">
                      <span className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent/10 rounded-full blur-sm"></span>
                      <span className="relative">
                        {article.type === "title" ? "📖 عنوان رئيسي" : "📝 فصل"}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors line-clamp-3 leading-relaxed mb-2">
                    {(() => {
                      // For "title" type, use content as the title
                      if (article.type === "title") {
                        return highlightText(
                          article.content || "بدون عنوان",
                          query
                        );
                      }
                      // For "section" type, use title field if available, otherwise content
                      return highlightText(
                        article.title || article.content || "بدون عنوان",
                        query
                      );
                    })()}
                  </h3>

                  {/* Source indicator */}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-accent/50 rounded-full"></div>
                    <span>
                      من مجموعة:{" "}
                      {article.filename?.replace(".json", "") || "غير محدد"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Content Preview */}
            <div className="relative p-8">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg line-clamp-4">
                  {(() => {
                    let contentToShow = "";

                    if (article.type === "title") {
                      // For title type, show a preview or indication that this is a title
                      contentToShow =
                        "🌟 هذا عنوان رئيسي يحتوي على محتوى قيم ومفيد للقارئ";
                    } else if (article.type === "section" && article.content) {
                      // For section type, show the content
                      contentToShow = article.content;
                    } else {
                      contentToShow = "لا يوجد محتوى متاح في هذا القسم";
                    }

                    // Better truncation with word boundaries
                    const truncatedContent =
                      contentToShow.length > 150
                        ? contentToShow
                            .substring(0, 150)
                            .split(" ")
                            .slice(0, -1)
                            .join(" ") + "..."
                        : contentToShow;

                    return highlightText(truncatedContent, query);
                  })()}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16">
          <div className="bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 rounded-3xl p-8 border border-accent/20">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                تصفح المزيد من النتائج
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                الصفحة {currentPage} من {totalPages} • {totalResults} نتيجة
                إجمالية
              </p>
            </div>

            <Pagination className="flex justify-center">
              <PaginationContent className="gap-2">
                {/* First few pages */}
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className={`cursor-pointer transition-all duration-300 border-2 rounded-xl shadow-sm ${
                          currentPage === pageNum
                            ? "bg-accent text-white border-accent scale-110"
                            : "bg-white dark:bg-gray-800 border-accent/30 hover:bg-accent/10 hover:border-accent/50"
                        }`}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {/* Ellipsis and last page if needed */}
                {totalPages > 5 && currentPage <= 3 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis className="text-accent" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                        isActive={currentPage === totalPages}
                        className={`cursor-pointer transition-all duration-300 border-2 rounded-xl shadow-sm ${
                          currentPage === totalPages
                            ? "bg-accent text-white border-accent scale-110"
                            : "bg-white dark:bg-gray-800 border-accent/30 hover:bg-accent/10 hover:border-accent/50"
                        }`}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
