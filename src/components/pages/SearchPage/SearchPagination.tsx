import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/shadcn/pagination";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}

function getPaginationPages(
  page: number,
  total: number
): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  for (let i = page - 1; i <= page + 1; i++)
    if (i > 1 && i < total) pages.push(i);
  if (page - 2 > 1) pages.splice(1, 0, "ellipsis");
  if (page + 2 < total) pages.push("ellipsis");
  pages.push(total);
  return pages.filter(
    (v, i, arr) => v !== "ellipsis" || arr[i - 1] !== "ellipsis"
  );
}

const SearchPagination: React.FC<SearchPaginationProps> = ({
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
}) =>
  totalPages > 1 ? (
    <div className="mt-16">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          الصفحة {currentPage} من {totalPages} • {totalResults} نتيجة إجمالية
        </p>
      </div>
      <Pagination className="flex justify-center">
        <PaginationContent className="gap-2">
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(currentPage - 1)}
                isActive={false}
                aria-label="الصفحة السابقة"
                className="cursor-pointer transition-all duration-300 border-2 rounded-xl shadow-sm bg-white dark:bg-gray-800 border-accent/30 hover:bg-accent/10 hover:border-accent/50 flex items-center justify-center px-2"
              >
                <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
              </PaginationLink>
            </PaginationItem>
          )}
          {getPaginationPages(currentPage, totalPages).map((page, idx) =>
            page === "ellipsis" ? (
              <PaginationItem key={"ellipsis-" + idx}>
                <PaginationEllipsis className="text-accent text-xs md:text-sm" />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(Number(page))}
                  isActive={currentPage === page}
                  className={`text-xs md:text-sm cursor-pointer transition-all duration-300 border-2 rounded-lg shadow-sm ${
                    currentPage === page
                      ? "bg-accent text-white border-accent scale-110"
                      : "bg-white dark:bg-gray-800 border-accent/30 hover:bg-accent/10 hover:border-accent/50"
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(currentPage + 1)}
                isActive={false}
                aria-label="الصفحة التالية"
                className="cursor-pointer transition-all duration-300 border-2 rounded-xl shadow-sm bg-white dark:bg-gray-800 border-accent/30 hover:bg-accent/10 hover:border-accent/50 flex items-center justify-center px-2"
              >
                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
              </PaginationLink>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  ) : null;

export default SearchPagination;
