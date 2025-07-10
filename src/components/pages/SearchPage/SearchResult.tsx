import { Article } from "@/lib/types";
import { Book, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import SearchPagination from "./SearchPagination";
import { useRouter } from "next/navigation";

interface SearchResultProps {
  results: Article[];
  query: string;
  allArticles?: Article[];
  allBooks?: Article[];
}

export default function SearchResult({
  results,
  query,
  allArticles = [],
  allBooks = [],
}: SearchResultProps) {
  const router = useRouter();
  // Combine all books and articles if no query is provided
  const displayResults = query ? results : [...allArticles, ...allBooks];
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const totalResults = displayResults.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const currentResults = displayResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const highlightText = (text: string, q: string) => {
    if (!q) return text;
    return text.split(new RegExp(`(${q})`, "gi")).map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark
          key={i}
          className="bg-green-200 px-2 rounded-sm text-black font-medium"
        >
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
            لم يتم العثور على نتائج تحتوي على &quot;{query}&quot;
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            جرب كلمات مفتاحية أخرى أو تأكد من الإملاء
          </p>
        </div>
      </div>
    );
  }

  const getArticleTitle = (article: Article) =>
    article.type === "title"
      ? highlightText(article.content || "بدون عنوان", query)
      : highlightText(article.title || article.content || "بدون عنوان", query);

  const getArticleContent = (article: Article) => {
    let content = "";
    if (article.type === "title")
      content = "🌟 هذا عنوان رئيسي يحتوي على محتوى قيم ومفيد للقارئ";
    else if (article.type === "section" && article.content)
      content = article.content;
    else content = "لا يوجد محتوى متاح في هذا القسم";
    const truncated =
      content.length > 150
        ? content.substring(0, 150).split(" ").slice(0, -1).join(" ") + "..."
        : content;
    return highlightText(truncated, query);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      {/* Simple Header Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          {query ? "نتائج البحث" : "جميع الكتب المقالات"}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="text-gray-600 dark:text-gray-400">
            <p className="text-sm sm:text-base">
              <span className="font-semibold text-accent">{totalResults}</span>{" "}
              {query ? (
                <>
                  نتيجة للبحث عن
                  <span className="mx-1 sm:mx-2 font-medium text-gray-900 dark:text-white break-words">
                    &quot;{query}&quot;
                  </span>
                </>
              ) : (
                <>مقال متاح</>
              )}
            </p>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 order-first sm:order-last">
            صفحة {currentPage} من {totalPages} • عرض {totalResults}
          </div>
        </div>
        <div className="mt-3 sm:mt-4 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      </div>

      {/* Enhanced Article Grid */}
      <div className="grid gap-4 sm:gap-6 lg:gap-8">
        {currentResults.map((article, idx) => (
          <article
            key={`${article.id} + ${idx}`}
            className="group relative bg-gradient-to-br from-surface-light to-surface-light/80 dark:from-surface-dark dark:to-surface-dark/80 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer"
            onClick={() => {
              if (article.filename && article.id) {
                const baseUrl = `/chapters/${article.filename.replace(
                  ".json",
                  ""
                )}/${article.id}`;
                router.push(
                  query ? `${baseUrl}?q=${encodeURIComponent(query)}` : baseUrl
                );
              }
            }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>

            {/* Header Section */}
            <div className="relative p-4 sm:p-6 lg:p-8 border-b border-gray-200/30 dark:border-gray-700/30">
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                <div className="relative flex-shrink-0">
                  <div className="bg-gradient-to-br from-accent/20 to-accent/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl group-hover:from-accent/30 group-hover:to-accent/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {allBooks.some(
                      (b) =>
                        b.id === article.id && b.filename === article.filename
                    ) ? (
                      <Book className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-accent drop-shadow-sm" />
                    ) : (
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-accent drop-shadow-sm" />
                    )}
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full animate-pulse"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <span className="relative inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-accent/15 to-accent/25 text-accent text-xs sm:text-sm font-bold rounded-full border border-accent/30">
                      <span className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent/10 rounded-full blur-sm"></span>
                      <span className="relative">
                        {allBooks.some(
                          (b) =>
                            b.id === article.id &&
                            b.filename === article.filename
                        )
                          ? "📖 كتاب"
                          : "📝 مقال"}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors line-clamp-2 sm:line-clamp-3 leading-relaxed mb-2">
                    {getArticleTitle(article)}
                  </h3>
                </div>
              </div>
            </div>

            {/* Enhanced Content Preview */}
            <div className="relative p-4 sm:p-6 lg:p-8">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg line-clamp-3 sm:line-clamp-4">
                  {getArticleContent(article)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Enhanced Pagination Controls */}
      <SearchPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
