"use client";

import Link from "next/dist/client/link";
import { Button } from "@/components/ui/shadcn/button";
import { Sun, Moon, Search } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useState, useEffect } from "react";

export default function Header() {
  const { isDark, toggleDark } = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[9999] bg-surface-light dark:bg-surface-dark shadow">
        <div className="flex justify-between xl:justify-around items-center p-3 md:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            <h1 className="text-xl md:text-2xl font-bold">
              موقع الروضة الإسلامي
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Link href="/search">
              <Button
                variant="outline"
                className="flex justify-center items-center gap-2 rounded-full bg-surface-light dark:bg-surface-dark"
              >
                <Search className="text-accent" size={20} />
                <p className="text-accent text-sm font-medium">البحث</p>
              </Button>
            </Link>
            <Link href="/about-website">
              <Button variant="link">حول الموقع</Button>
            </Link>
            <Link href="/about-me">
              <Button variant="link">تعريف بصاحب الموقع</Button>
            </Link>
            <a
              href="https://www.al-rawdah.net/vb/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="link">المنتدى</Button>
            </a>
            <Button
              variant="ghost"
              size="icon"
              aria-label="تبديل الوضع الليلي"
              onClick={toggleDark}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center space-x-2 space-x-reverse md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="تبديل الوضع الليلي"
              onClick={toggleDark}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <button
              className="p-2 z-20 flex flex-col justify-center items-center w-10 h-10 relative text-accent cursor-pointer hover:bg-accent/10 rounded-full transition-colors duration-200"
              aria-label="فتح القائمة"
              onClick={toggleMobileMenu}
            >
              <span
                className={`block w-6 h-0.5 bg-current absolute transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "rotate-45 translate-y-0"
                    : "-translate-y-2"
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current absolute transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current absolute transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "-rotate-45 translate-y-0"
                    : "translate-y-2"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Full Screen Overlay */}
        <div
          className={`
            fixed inset-0 bg-black/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center
            transition-all duration-300 ease-in-out md:hidden
            ${
              isMobileMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }
          `}
        >
          <nav className="flex flex-col items-center gap-8 text-xl">
            <Link href="/search">
              <Button
                variant="outline"
                className="flex justify-center items-center gap-2 rounded-full bg-transparent"
              >
                <Search className="text-accent" size={20} />
                <p className="text-accent text-sm font-medium">البحث</p>
              </Button>
            </Link>
            <Link
              href="/about-website"
              className="text-white hover:text-accent transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              حول الموقع
            </Link>
            <Link
              href="/about-me"
              className="text-white hover:text-accent transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              تعريف بصاحب الموقع
            </Link>
            <a
              href="https://www.al-rawdah.net/vb/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-accent transition-colors duration-200 font-medium"
            >
              المنتدى
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
