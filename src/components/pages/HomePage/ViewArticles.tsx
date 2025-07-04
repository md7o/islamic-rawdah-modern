"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookCard from "@/components/ui/custom/BookCard";
import CircleDash from "@/components/ui/custom/CircleDash";
import { Newspaper, Sparkles } from "lucide-react";
import { Viewer } from "@/lib/types";
import { ContainerLoadingSpinner } from "@/components/ui/custom/LoadingSpinner";

export default function ViewArticles() {
  const router = useRouter();
  const [articles, setArticles] = useState<Viewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileManifest = async (): Promise<string[]> => {
      const response = await fetch("/Json/ArticlesIndex.json");
      if (!response.ok) {
        throw new Error("Failed to load article manifest");
      }
      return response.json();
    };

    const fetchArticleFile = async (filename: string): Promise<Viewer[]> => {
      const response = await fetch(`/Json/ArticlesJson/${filename}`);
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

    const loadAllArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        // Step 1: Get list of article files
        const files = await fetchFileManifest();

        // Step 2: Fetch and process all article files
        const articlePromises = files.map(fetchArticleFile);
        const allArticles = await Promise.all(articlePromises);

        // Step 3: Flatten and filter out empty results
        const validArticles = allArticles.flat().filter(Boolean);
        setArticles(validArticles);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllArticles();
  }, []);

  const handleArticleClick = (filename: string) => {
    router.push(`/chapters/${filename}`);
  };

  return (
    <section className="flex flex-col items-center justify-center text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl scale-110"></div>
        <div className="relative bg-gradient-to-br from-accent to-accent/80 p-6 rounded-2xl shadow-2xl">
          <Newspaper className="text-white w-12 h-12" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 text-amber-200 w-6 h-6 animate-pulse" />
      </div>
      <h1 className="text-4xl md:text-7xl text-accent font-bold mb-4">
        قسم المقالات
      </h1>

      <CircleDash />
      {loading && (
        <div className="mt-8">
          <ContainerLoadingSpinner />
        </div>
      )}
      {error && <div className="mt-8 text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {articles.map((article, i) => (
          <BookCard
            key={`article-${i}`}
            iconVariant="mystery"
            icon="Newspaper"
            title={article.content}
            chapters={article.sectionCount}
            onClick={() => handleArticleClick(article.filename)}
          />
        ))}
      </div>
    </section>
  );
}
