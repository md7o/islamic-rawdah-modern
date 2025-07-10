"use client";

import BookCard from "@/components/ui/custom/BookCard";
import CircleDash from "@/components/ui/custom/CircleDash";
import { Viewer } from "@/lib/types";
import { BooksType } from "@/lib/BooksType";
import { Book } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ContainerLoadingSpinner } from "@/components/ui/custom/LoadingSpinner";
import NavigationButtons from "@/components/ui/custom/NavigationButtons";

const BOOKS_NAV_TABS = [
  {
    label: "رحلات",
    value: "rihla",
    icon: Book,
    section: "rihla-section",
  },
  {
    label: "عقيدة",
    value: "aqeedah",
    icon: Book,
    section: "aqeedah-section",
  },
  {
    label: "تربية",
    value: "tarbiyah",
    icon: Book,
    section: "tarbiyah-section",
  },
  {
    label: "سياسة شرعية",
    value: "politics",
    icon: Book,
    section: "politics-section",
  },
  {
    label: "دعوة",
    value: "da'wah",
    icon: Book,
    section: "da'wah-section",
  },
  {
    label: "فقه",
    value: "fiqh",
    icon: Book,
    section: "fiqh-section",
  },
  {
    label: "مقاصد",
    value: "maqasid",
    icon: Book,
    section: "maqasid-section",
  },
  {
    label: "تفسير",
    value: "tafsir",
    icon: Book,
    section: "tafsir-section",
  },
  {
    label: "نحو",
    value: "nahw",
    icon: Book,
    section: "nahw-section",
  },
  {
    label: "شخصيات",
    value: "shakhsiyat",
    icon: Book,
    section: "shakhsiyat-section",
  },
  {
    label: "ثقافة عامة",
    value: "thaqafah",
    icon: Book,
    section: "thaqafah-section",
  },
  {
    label: "قصائد",
    value: "qasid",
    icon: Book,
    section: "qasid-section",
  },
];

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
  const [clickLoadingIndex, setClickLoadingIndex] = useState<number | null>(
    null
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

  const handleArticleClick = (filename: string, idx: number) => {
    setClickLoadingIndex(idx); // Show loading spinner for this card
    const cleanFilename = filename.replace(".json", "");
    router.push(`/chapters/${cleanFilename}`);
  };

  // Create a mapping function to get section ID from category title
  const getSectionId = (categoryTitle: string): string => {
    const sectionMap: { [key: string]: string } = {
      رحلات: "rihla-section",
      عقيدة: "aqeedah-section",
      تربية: "tarbiyah-section",
      "سياسة شرعية": "politics-section",
      دعوة: "da'wah-section",
      فقه: "fiqh-section",
      مقاصد: "maqasid-section",
      تفسير: "tafsir-section",
      نحو: "nahw-section",
      شخصيات: "shakhsiyat-section",
      "ثقافة عامة": "thaqafah-section",
      قصائد: "qasid-section",
    };
    return (
      sectionMap[categoryTitle] ||
      `${categoryTitle.toLowerCase().replace(/\s+/g, "-")}-section`
    );
  };

  return (
    <section className="py-16 flex flex-col items-center justify-center text-center">
      {/* Header Section */}
      <div className="relative my-10 mt-52">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl scale-110"></div>
        <div className="relative bg-gradient-to-br from-accent to-accent/80 p-6 rounded-2xl shadow-2xl">
          <Book className="text-white w-12 h-12" />
        </div>
      </div>
      <h2 className="text-4xl md:text-7xl text-accent font-bold mb-4">
        قسم الكتب
      </h2>

      <CircleDash />

      <NavigationButtons
        buttons={BOOKS_NAV_TABS}
        layout="grid"
        maxWidth="max-w-7xl"
        gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 "
      />

      {loading && (
        <div className="mt-8">
          <ContainerLoadingSpinner />
        </div>
      )}
      {error && <div className="mt-8 text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="w-full max-w-5xl mt-8 space-y-8">
          {Object.entries(booksByCategory).map(
            ([categoryTitle, categoryData]) => (
              <div key={categoryTitle} className="space-y-4">
                {/* Category Header */}
                <div
                  id={getSectionId(categoryTitle)}
                  className={`space-y-10 pt-20`}
                >
                  <div className="flex justify-center items-center">
                    <div>
                      <h2 className="text-5xl ">{categoryTitle}</h2>
                      {/* <p className="text-white/80 text-sm">
                        {categoryData.books.length} كتاب
                      </p> */}
                    </div>
                  </div>
                  <CircleDash />
                </div>
                {/* Books Grid - Always show */}
                {categoryData.books.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-y-5 ">
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
                        icon={clickLoadingIndex === i ? "Spinner" : "Book"}
                        title={book.content}
                        chapters={book.sectionCount}
                        category={categoryTitle}
                        onClick={() => handleArticleClick(book.filename, i)}
                      />
                    ))}
                  </div>
                ) : (
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
