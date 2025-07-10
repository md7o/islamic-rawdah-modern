import { Card } from "@/components/ui/shadcn/card";
import { Book, ChevronDown, Newspaper, Loader2 } from "lucide-react";

type IconVariant =
  | "romance"
  | "mystery"
  | "fantasy"
  | "islamic"
  | "science"
  | "history"
  | "literature"
  | "philosophy"
  | "biography"
  | "hadith"
  | "quran"
  | "fiqh";

interface BookCardProps {
  iconVariant?: IconVariant;
  icon?: "Book" | "Newspaper" | "Spinner";
  title?: string;
  chapters?: number;
  onClick?: () => void;
  category?: string;
}

export default function BookCard({
  iconVariant = "romance",
  icon = "Book",
  title = "مقالات عامة 3",
  chapters = 61,
  onClick,
  category = "عام",
}: BookCardProps) {
  // Tailwind gradient classes for each variant
  const gradientClasses: Record<string, string> = {
    romance: "bg-gradient-to-br from-[#713030] to-[#5B2C2CFF]",
    mystery: "bg-gradient-to-br from-purple-500 to-purple-950",
    fantasy: "bg-gradient-to-br from-green-600 to-cyan-900",
    islamic: "bg-gradient-to-br from-emerald-500 to-emerald-900",
    science: "bg-gradient-to-br from-blue-500 to-blue-950",
    history: "bg-gradient-to-br from-amber-600 to-amber-900",
    literature: "bg-gradient-to-br from-purple-600 to-purple-950",
    philosophy: "bg-gradient-to-br from-gray-400 to-gray-700",
    biography: "bg-gradient-to-br from-red-600 to-red-900",
    hadith: "bg-gradient-to-br from-green-900 to-green-500",
    quran: "bg-gradient-to-br from-emerald-600 to-emerald-800",
    fiqh: "bg-gradient-to-br from-blue-900 to-cyan-600",
  };
  const gradientClass = gradientClasses[iconVariant] || gradientClasses.romance;

  // Arabic pluralization for 'فصل'
  function getFaslLabel(n?: number) {
    if (!n) return "فصل";
    // 3-10 => فصول, everything else => فصل
    if (n >= 3 && n <= 10) return "فصول";
    return "فصل";
  }

  return (
    <div className="flex items-center justify-center ">
      <Card
        className="w-80 h-[30rem] p-0 bg-surface-light dark:bg-surface-dark backdrop-blur-sm shadow-xl border-none transition-all duration-300 hover:scale-[103%] hover:shadow-2xl hover:shadow-black/30 group relative overflow-hidden cursor-pointer rounded-3xl"
        onClick={onClick}
      >
        {/* Book Cover */}
        <div className="relative">
          <div
            className={`w-full h-64 rounded-3xl rounded-b-none flex items-center justify-center relative overflow-hidden ${gradientClass}`}
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"></div>

            {/* Book icon or spinner */}
            {icon === "Book" && (
              <Book className="text-white/95 drop-shadow-2xl " size={76} />
            )}
            {icon === "Newspaper" && (
              <Newspaper className="text-white/95 drop-shadow-2xl " size={76} />
            )}
            {icon === "Spinner" && (
              <Loader2
                className="text-white/95 drop-shadow-2xl animate-spin"
                size={76}
              />
            )}

            {/* Genre badge */}
            <div className="absolute top-4 right-4 bg-white/25 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/20">
              {category}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 space-y-5 pb-10">
          {" "}
          {/* Add bottom padding for arrow space */}
          {/* Title and Chapters Row */}
          <div className="flex flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-lg text-right line-clamp-2 group-hover:text-accent transition-colors duration-300">
                {title}
              </p>
              <p className="text-md pt-2 text-accent text-right">
                {chapters} {getFaslLabel(chapters)}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Action - absolutely positioned at bottom center */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex justify-center">
          <div className="flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300 bg-accent/10 rounded-full p-2 group-hover:bg-accent/20">
            <ChevronDown size={18} className="text-accent" />
          </div>
        </div>
      </Card>
    </div>
  );
}
