// Search hook for searching articles by title or content
import { useState, useEffect } from "react";
import { Article, Section } from "@/lib/types";

// Helper to fetch and search both books and articles
async function fetchAllContent(query: string): Promise<Article[]> {
  if (!query || query.length < 2) return [];

  try {
    let results: Article[] = [];

    // Search in books
    try {
      const booksListRes = await fetch("/Json/Indexes.json");
      const booksList: string[] = await booksListRes.json();

      await Promise.all(
        booksList
          .filter((f) => f.endsWith(".json"))
          .map(async (filename) => {
            try {
              const res = await fetch(`/Json/BooksJson/${filename}`);
              if (!res.ok) return;
              const data = await res.json();
              const articles = Array.isArray(data) ? data : [data];

              // Search in title/content for each section
              articles.forEach((item: Section) => {
                const searchQuery = query.toLowerCase();
                const titleMatch = item.title
                  ?.toLowerCase()
                  .includes(searchQuery);
                const contentMatch = item.content
                  ?.toLowerCase()
                  .includes(searchQuery);

                if (titleMatch || contentMatch) {
                  results.push({
                    type: item.type,
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    filename, // Add filename to track source
                  });
                }
              });
            } catch (error) {
              console.error(`Error fetching book ${filename}:`, error);
            }
          })
      );
    } catch (error) {
      console.error("Error loading books for search:", error);
    }

    // Search in articles
    try {
      const articlesListRes = await fetch("/Json/ArticlesIndex.json");
      const articlesList: string[] = await articlesListRes.json();

      await Promise.all(
        articlesList.map(async (filename) => {
          try {
            const res = await fetch(`/Json/ArticlesJson/${filename}`);
            if (!res.ok) return;
            const data = await res.json();
            const articles = Array.isArray(data) ? data : [data];

            // Search in title/content for each section
            articles.forEach((item: Section) => {
              const searchQuery = query.toLowerCase();
              const titleMatch = item.title
                ?.toLowerCase()
                .includes(searchQuery);
              const contentMatch = item.content
                ?.toLowerCase()
                .includes(searchQuery);

              if (titleMatch || contentMatch) {
                results.push({
                  type: item.type,
                  id: item.id,
                  title: item.title,
                  content: item.content,
                  filename, // Add filename to track source
                });
              }
            });
          } catch (error) {
            console.error(`Error fetching article ${filename}:`, error);
          }
        })
      );
    } catch (error) {
      console.error("Error loading articles for search:", error);
    }

    // Sort results - prioritize title matches over content matches
    return results.sort((a, b) => {
      const aHasTitleMatch = a.title
        ?.toLowerCase()
        .includes(query.toLowerCase());
      const bHasTitleMatch = b.title
        ?.toLowerCase()
        .includes(query.toLowerCase());

      if (aHasTitleMatch && !bHasTitleMatch) return -1;
      if (!aHasTitleMatch && bHasTitleMatch) return 1;
      return 0;
    });
  } catch (error) {
    console.error("Error in fetchBooks:", error);
    return [];
  }
}

function useSearch(query: string) {
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Add debounce to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchAllContent(query)
        .then((data: Article[]) => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading };
}

export default useSearch;
