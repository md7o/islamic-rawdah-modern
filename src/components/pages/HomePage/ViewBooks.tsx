"use client";

import BookCard from "@/components/ui/custom/BookCard";
import CircleDash from "@/components/ui/custom/CircleDash";
import { Viewer } from "@/lib/types";
import { BooksType, BooksTypeProps } from "@/lib/BooksType";
import { Book, Sparkles, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BooksByCategory {
  [categoryTitle: string]: {
    books: Viewer[];
    background: string;
  };
}

export default function ViewBooks() {
  const router = useRouter();
  const [booksByCategory, setBooksByCategory] = useState<BooksByCategory>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchArticleFile = async (filename: string): Promise<Viewer[]> => {
      const response = await fetch(`/Json/BooksJson/${filename}`);
      if (!response.ok) return [];

      const data = await response.json();
      const articles = Array.isArray(data) ? data : [data];

      // Count sections in this file
      const sectionCount = articles.filter(
        (item) => item.type === "section"
      ).length;

      return articles
        .filter((item) => item.type === "title")
        .map((item, index) => ({
          ...item,
          filename,
          index,
          sectionCount,
        }));
    };

    const loadBooksByCategory = async () => {
      setLoading(true);
      setError(null);

      try {
        const categoryBooks: BooksByCategory = {};

        // Process each category from BooksType
        for (const category of BooksType) {
          const categoryTitle = category.title;
          const categoryBackground = category.background;

          // Fetch all books for this category
          const bookPromises = category.file.map(fetchArticleFile);
          const allBooksInCategory = await Promise.all(bookPromises);

          // Flatten and filter out empty results
          const validBooks = allBooksInCategory.flat().filter(Boolean);

          categoryBooks[categoryTitle] = {
            books: validBooks,
            background: categoryBackground,
          };
        }

        setBooksByCategory(categoryBooks);

        // Expand first category by default
        if (BooksType.length > 0) {
          setExpandedCategories(new Set([BooksType[0].title]));
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        setBooksByCategory({});
      } finally {
        setLoading(false);
      }
    };

    loadBooksByCategory();
  }, []);

  const handleArticleClick = (filename: string) => {
    console.log("Navigating to book:", filename);
    console.log("Full book data:", { filename, url: `/chapters/${filename.replace(".json", "")}` });
    // Remove .json extension if present for cleaner URL
    const cleanFilename = filename.replace(".json", "");
    router.push(`/chapters/${cleanFilename}`);
  };

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryTitle)) {
        newSet.delete(categoryTitle);
      } else {
        newSet.add(categoryTitle);
      }
      return newSet;
    });
  };

  return (
    <section className="py-50 flex flex-col items-center justify-center text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl scale-110"></div>
        <div className="relative bg-gradient-to-br from-accent to-accent/80 p-6 rounded-2xl shadow-2xl">
          <Book className="text-white w-12 h-12" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 text-amber-200 w-6 h-6 animate-pulse" />
      </div>
      <h1 className="text-4xl md:text-7xl text-accent font-bold mb-4">
        قسم الكتب
      </h1>
      <p
        className="text-xl md:text-2xl max-w-2xl "
        style={{ animationDelay: "0.2s" }}
      >
        كتب إسلامية متنوعة في مختلف العلوم الشرعية والتجارب الشخصية
      </p>
      <CircleDash />

      {loading && <div className="mt-8">جاري التحميل...</div>}
      {error && <div className="mt-8 text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="w-full max-w-7xl mt-8 space-y-8">
          {Object.entries(booksByCategory).map(
            ([categoryTitle, categoryData]) => (
              <div key={categoryTitle} className="space-y-4">
                {/* Category Header */}
                <div
                  className={`bg-accent rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:opacity-75 shadow-lg`}
                  onClick={() => toggleCategory(categoryTitle)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Book className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {categoryTitle}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {categoryData.books.length} كتاب
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`text-white w-6 h-6 transition-transform duration-300 ${
                        expandedCategories.has(categoryTitle) ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Books Grid - Show only if category is expanded */}
                {expandedCategories.has(categoryTitle) &&
                  categoryData.books.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-4">
                      {categoryData.books.map((book, i) => (
                        <BookCard
                          key={`${categoryTitle}-book-${i}`}
                          iconVariant={
                            categoryData.background as
                              | "romance"
                              | "mystery"
                              | "fantasy"
                              | undefined
                          }
                          icon="Book"
                          title={book.content}
                          chapters={book.sectionCount}
                          category={categoryTitle}
                          onClick={() => handleArticleClick(book.filename)}
                        />
                      ))}
                    </div>
                  )}

                {/* Empty state for category */}
                {expandedCategories.has(categoryTitle) &&
                  categoryData.books.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد كتب في هذا القسم حاليًا
                    </div>
                  )}
              </div>
            )
          )}

          {/* Empty state for no categories */}
          {Object.keys(booksByCategory).length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              لا توجد كتب متاحة حاليًا
            </div>
          )}
        </div>
      )}
    </section>
  );
}
