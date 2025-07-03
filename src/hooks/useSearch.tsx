// Search hook for searching articles by title or content
import { useState, useEffect, useRef, useCallback } from "react";
import { Article, Section } from "@/lib/types";

// Helper to search in a list of sections
function searchSections(
  sections: Section[],
  query: string,
  filename: string
): Article[] {
  const searchQuery = query.toLowerCase();
  return sections.reduce((acc: Article[], item: Section) => {
    if (item.type === "title") {
      return acc;
    }
    const title = item.title?.toLowerCase() || "";
    const content = item.content?.toLowerCase() || "";
    if (title.includes(searchQuery) || content.includes(searchQuery)) {
      acc.push({
        type: item.type,
        id: item.id,
        title: item.title,
        content: item.content,
        filename,
      });
    }
    return acc;
  }, []);
}

// Helper to fetch and search both books and articles
const fetchAllContent = async (query: string): Promise<Article[]> => {
  if (!query || query.length < 2) return [];
  const results: Article[] = [];
  const searchQuery = query.toLowerCase();

  // ===== Search in Books =====
  try {
    const booksListRes = await fetch("/Json/BooksIndex.json");
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
            results.push(...searchSections(articles, query, filename));
          } catch {
            // Optionally log error
          }
        })
    );
  } catch {
    // Optionally log error
  }

  // ===== Search in Articles =====
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
          results.push(...searchSections(articles, query, filename));
        } catch {
          // Optionally log error
        }
      })
    );
  } catch {
    // Optionally log error
  }

  // Sort results - prioritize title matches over content matches
  return results.sort((a, b) => {
    const aHasTitleMatch = a.title?.toLowerCase().includes(searchQuery);
    const bHasTitleMatch = b.title?.toLowerCase().includes(searchQuery);
    if (aHasTitleMatch && !bHasTitleMatch) return -1;
    if (!aHasTitleMatch && bHasTitleMatch) return 1;
    return 0;
  });
};

function useSearch(query: string) {
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchContent = useCallback(
    async (q: string) => {
      setLoading(true);
      try {
        const data = await fetchAllContent(q);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [setResults, setLoading]
  );

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchContent(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchContent]);

  return { results, loading };
}

export default useSearch;
