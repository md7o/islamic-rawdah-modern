"use client";

import { useState, useEffect } from "react";
import useSearch from "@/hooks/useSearch";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Search } from "lucide-react";
import SearchResult from "./SearchResult";
import { Article } from "@/lib/types";

export default function SearchEngine() {
  const [query, setQuery] = useState("");
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const { results, loading } = useSearch(query);

  // Load all articles on component mount
  useEffect(() => {
    const loadAllArticles = async () => {
      try {
        let allResults: Article[] = [];

        // Load from BooksJson
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

                  articles.forEach((item: any) => {
                    allResults.push({
                      type: item.type,
                      id: item.id,
                      title: item.title,
                      content: item.content,
                      filename,
                    });
                  });
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

          await Promise.all(
            articlesList.map(async (filename) => {
              try {
                const res = await fetch(`/Json/ArticlesJson/${filename}`);
                if (!res.ok) return;
                const data = await res.json();
                const articles = Array.isArray(data) ? data : [data];

                articles.forEach((item: any) => {
                  allResults.push({
                    type: item.type,
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    filename,
                  });
                });
              } catch (error) {
                console.error(`Error fetching article ${filename}:`, error);
              }
            })
          );
        } catch (error) {
          console.error("Error loading articles:", error);
        }

        setAllArticles(allResults);
      } catch (error) {
        console.error("Error loading all articles:", error);
      } finally {
        setLoadingAll(false);
      }
    };

    loadAllArticles();
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
        <Button variant="outline" size="icon" disabled>
          <Search className="w-5 h-5" />
        </Button>
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
        />
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2023 موقع الروضة الإسلامي
        </p>
        <p className="text-sm text-muted-foreground">جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
}
