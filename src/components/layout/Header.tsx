"use client";

import Link from "next/dist/client/link";
import { Button } from "@/components/ui/shadcn/button";
import { Sun, Moon, Search } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function Header() {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <header className="fixed top-0 left-0 w-full z-[9999] flex justify-around items-center p-3  bg-surface-light dark:bg-surface-dark shadow">
      {" "}
      {/* add h1 using Link as a logo */}
      <Link
        href="/"
        className="text-accent hover:text-accent/80 transition-colors"
      >
        <h1 className="text-2xl font-bold">موقع الروضة الإسلامي</h1>
      </Link>
      <div className="flex items-center">
        {/* Add Link for every single Button */}
        <Link href="/search">
          <Button
            variant="outline"
            className="flex justify-center items-center gap-2 mx-2 rounded-full"
          >
            <Search className="text-accent" size={20} />
            <p className="text-accent/60 text-sm font-medium ">البحث</p>
          </Button>
        </Link>
        <Link href="/about-website">
          <Button variant="link">حول الموقع</Button>
        </Link>
        <Link href="/about-me">
          <Button variant="link">تعريف بصاحب الموقع</Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label="تبديل الوضع الليلي"
          onClick={toggleDark}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}
