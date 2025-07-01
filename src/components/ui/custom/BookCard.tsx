import { Card } from "@/components/ui/shadcn/card";
import { Book, ChevronDown, Newspaper } from "lucide-react";

interface BookCardProps {
  iconVariant?: "romance" | "mystery" | "fantasy";
  icon?: "Book" | "Newspaper";

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
  // Default gradients for each variant
  const defaultGradients: Record<string, [string, string]> = {
    romance: ["#713030", "#9c4e4e"], // pink-400, red-400
    mystery: ["#a78bfa", "#60a5fa"], // purple-400, blue-400
    fantasy: ["#34d399", "#22d3ee"], // emerald-400, cyan-400
  };
  const [from, to] = defaultGradients[iconVariant];

  return (
    <div className="flex items-center justify-center ">
      <Card
        className="w-80 h-[30rem] p-0 bg-surface-light dark:bg-surface-dark backdrop-blur-sm shadow-xl border-none transition-all duration-300 hover:scale-[103%] hover:shadow-2xl hover:shadow-black/30 group relative overflow-hidden cursor-pointer rounded-3xl"
        onClick={onClick}
      >
        {/* Book Cover */}
        <div className="relative">
          <div
            className="w-full h-64 rounded-3xl rounded-b-none flex items-center justify-center relative overflow-hidden "
            style={{
              background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
            }}
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"></div>

            {/* Book icon */}
            {icon === "Book" && (
              <Book className="text-white/95 drop-shadow-2xl " size={76} />
            )}

            {icon === "Newspaper" && (
              <Newspaper className="text-white/95 drop-shadow-2xl " size={76} />
            )}

            {/* Genre badge */}
            <div className="absolute top-4 right-4 bg-white/25 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/20">
              {category}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 space-y-5 pb-10">
          {" "}
          {/* Add bottom padding for arrow space */}
          {/* Title and Chapters Row */}
          <div className="flex flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-right  line-clamp-3  group-hover:text-accent transition-colors duration-300">
                {title}
              </h1>
              <p className="text-sm text-light-span text-right">كتاب إسلامي</p>
            </div>
            <div className="flex flex-col items-end text-right bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl px-3 py-2 min-w-[60px]">
              <span className="text-2xl font-bold text-accent">{chapters}</span>
              <span className="text-xs text-gray-600 font-medium">فصل</span>
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
