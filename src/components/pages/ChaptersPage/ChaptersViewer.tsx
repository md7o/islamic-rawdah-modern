"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import { Section } from "@/lib/types";
import { FullLoadingSpinner } from "@/components/ui/custom/LoadingSpinner";

export default function ArticleViewer() {
  const { filename } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chapterParam = searchParams.get("chapter");
  const currentChapter = chapterParam ? parseInt(chapterParam, 10) : null;

  const goToChapter = (idx: number | null) => {
    if (idx === null) return router.push(`/chapters/${filename}`);
    const categoryId = sections[idx]?.id;
    router.push(
      categoryId
        ? `/chapters/${filename}/${categoryId}`
        : `/chapters/${filename}`
    );
  };

  useEffect(() => {
    if (!filename) return;
    setLoading(true);
    setError(null);
    const fetchSections = async (base: string) => {
      const fileStr = Array.isArray(filename) ? filename[0] : filename;
      const file = fileStr.endsWith(".json") ? fileStr : `${fileStr}.json`;
      const res = await fetch(`/Json/${base}/${file}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [data];
      setTitle(arr.find((i) => i.type === "title")?.content || "");
      setSections(arr.filter((i) => i.type === "section"));
    };
    (async () => {
      try {
        await fetchSections("ArticlesJson");
      } catch {
        try {
          await fetchSections("BooksJson");
        } catch {
          setError("Failed to load content from both articles and books");
        }
      }
      setLoading(false);
    })();
  }, [filename]);

  if (loading) return <FullLoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark">
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl mb-4">
            <div className="text-red-500 text-4xl mb-2">⚠️</div>
          </div>
          <div className="text-red-600 dark:text-red-400 text-xl font-medium mb-2">
            حدث خطأ
          </div>
          <div className="text-gray-600 dark:text-gray-400">{error}</div>
          <Link
            href="/"
            className="group inline-flex items-center gap-3 mt-6 px-8 py-4 bg-gradient-to-r from-accent to-accent/80 text-white rounded-xl hover:from-accent/90 hover:to-accent/70 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
          >
            <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span>العودة للرئيسية</span>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 px-5 py-3 bg-surface-light dark:bg-surface-dark rounded-xl shadow-md hover:shadow-lg  text-accent hover:text-accent/90 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 font-medium"
          >
            <div className="bg-accent/10 p-2 rounded-lg group-hover:bg-accent/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span>العودة إلى الرئيسية</span>
          </Link>
        </nav>

        {/* Article Header */}
        <div className="mb-10">
          <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl  overflow-hidden">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 p-8 text-white">
              <div className="flex items-center gap-6 mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <BookOpen className="w-10 h-10" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                    {title || "مقال إسلامي"}
                  </h1>

                  <div className="flex items-center gap-2 mt-2">
                    <FileText className="w-5 h-5" />
                    <span className="text-lg">{sections.length} فصل</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Index */}
        {sections.length > 0 && currentChapter === null && (
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                فهرس الفصول
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                اختر الفصل الذي تريد قراءته
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section, idx) => (
                <button
                  key={section.id || idx}
                  className="group bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 p-6 hover:scale-[1.02] hover:-translate-y-1 "
                  onClick={() => goToChapter(idx)}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-4 rounded-xl group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300">
                      <FileText className="w-7 h-7 text-accent" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                        الفصل {idx + 1}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors line-clamp-2 leading-tight mb-2">
                        {section.title || `فصل ${idx + 1}`}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        انقر للقراءة
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {sections.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl mb-6">
                <FileText className="w-16 h-16 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                لا توجد فصول متاحة
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                لم يتم العثور على أي فصول لهذا المقال حالياً
              </p>
              <Link
                href="/"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-accent/80 text-white rounded-xl hover:from-accent/90 hover:to-accent/70 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span>العودة للرئيسية</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
