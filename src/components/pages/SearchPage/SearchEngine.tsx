"use client";

import { useState, useEffect } from "react";
import useSearch from "@/hooks/useSearch";
import { Input } from "@/components/ui/shadcn/input";
import SearchResult from "./SearchResult";
import { Article } from "@/lib/types";

export default function SearchEngine() {
  const [query, setQuery] = useState("");
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [allBooks, setAllBooks] = useState<Article[]>([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const { results, loading } = useSearch(query);

  // Load all articles and books on component mount
  useEffect(() => {
    async function loadAllContent() {
      setLoadingAll(true);
      const booksResults: Article[] = [];
      const articlesResults: Article[] = [];
      const pushNonTitle = (
        item: Article,
        filename: string,
        target: Article[]
      ) => {
        if ((item.type?.toString().toLowerCase().trim?.() ?? "") !== "title") {
          target.push({
            type: item.type,
            id: item.id,
            title: item.title,
            content: item.content,
            filename,
          });
        }
      };
      try {
        // Load from BooksJson
        try {
          const booksListRes = await fetch("/Json/Indexes.json");
          const booksList: string[] = await booksListRes.json();
          await Promise.allSettled(
            booksList
              .filter((f) => f.endsWith(".json"))
              .map(async (filename) => {
                try {
                  const res = await fetch(`/Json/BooksJson/${filename}`);
                  if (!res.ok) return;
                  const data = await res.json();
                  const books = Array.isArray(data) ? data : [data];
                  books.forEach((item: Article) =>
                    pushNonTitle(item, filename, booksResults)
                  );
                } catch (error) {
                  console.error(`Error fetching book ${filename}:`, error);
                }
              })
          );
        } catch (error) {
          console.error("Error loading books:", error);
        }
        // Load from ArticlesJson
        try {
          const articlesListRes = await fetch("/Json/ArticlesIndex.json");
          const articlesList: string[] = await articlesListRes.json();
          await Promise.allSettled(
            articlesList.map(async (filename) => {
              try {
                const res = await fetch(`/Json/ArticlesJson/${filename}`);
                if (!res.ok) return;
                const data = await res.json();
                const articles = Array.isArray(data) ? data : [data];
                articles.forEach((item: Article) =>
                  pushNonTitle(item, filename, articlesResults)
                );
              } catch (error) {
                console.error(`Error fetching article ${filename}:`, error);
              }
            })
          );
        } catch (error) {
          console.error("Error loading articles:", error);
        }
        setAllBooks(booksResults);
        setAllArticles(articlesResults);
      } catch (error) {
        console.error("Error loading all content:", error);
        setAllBooks([]);
        setAllArticles([]);
      } finally {
        setLoadingAll(false);
      }
    }
    loadAllContent();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center gap-2 w-full max-w-md mx-auto my-8">
        <Input
          placeholder="ابحث في الموقع..."
          className="flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading || loadingAll ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mx-auto mb-4"></div>
          <p className="text-accent font-medium">جاري التحميل...</p>
        </div>
      ) : (
        <SearchResult
          results={results}
          query={query}
          allArticles={allArticles}
          allBooks={allBooks}
        />
      )}
    </div>
  );
}
