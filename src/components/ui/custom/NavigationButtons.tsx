"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface NavigationButton {
  label: string;
  value: string;
  icon: LucideIcon;
  section: string;
}

interface NavigationButtonsProps {
  buttons: NavigationButton[];
  className?: string;
  layout?: "flex" | "grid";
  maxWidth?: string;
  gridCols?: string;
}

export default function NavigationButtons({
  buttons,
  className = "",
  layout = "flex",
  maxWidth = "max-w-2xl",
  gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}: NavigationButtonsProps) {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const isGridLayout = layout === "grid";

  return (
    <div className={`mt-5 w-full ${maxWidth} ${className}`}>
      <div className="relative">
        <div
          className={`relative bg-white/10 backdrop-blur-sm border-2 border-accent/20 rounded-2xl shadow-2xl ${
            isGridLayout
              ? `grid ${gridCols} gap-4 p-4`
              : "flex items-center py-1 px-3"
          }`}
        >
          {buttons.map((button, index) => {
            const Icon = button.icon;
            return (
              <div
                key={button.value}
                className={
                  isGridLayout ? "relative" : "flex items-center flex-1"
                }
              >
                <button
                  onClick={() => scrollToSection(button.section)}
                  className={`group relative flex items-center justify-center gap-3 font-bold overflow-hidden transition-all duration-300 cursor-pointer w-full
                    text-accent/80 hover:text-accent
                    hover:bg-accent/10 hover:shadow-lg hover:scale-[1.05]
                    focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-transparent
                    active:scale-[0.95] active:bg-accent/20
                    before:absolute before:inset-0 before:bg-gradient-to-r before:from-accent/20 before:to-accent/10 before:opacity-0 before:transition-opacity before:duration-300
                    hover:before:opacity-100 ${
                      isGridLayout
                        ? "text-lg sm:text-xl px-4 py-4 sm:px-5 sm:py-5 rounded-xl border border-accent/20 bg-white/5 hover:border-accent/40 hover:bg-white/10"
                        : "text-xl px-6 py-3 rounded-sm"
                    }`}
                >
                  <div className="relative flex items-center gap-3 z-10">
                    <div className="relative">
                      <Icon
                        className={`transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${
                          isGridLayout ? "w-5 h-5 sm:w-6 sm:h-6" : "w-6 h-6"
                        }`}
                      />
                      {/* Icon glow effect */}
                      <div className="absolute inset-0 bg-accent/30 rounded-full blur-sm scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span
                      className={`font-semibold tracking-wide ${
                        isGridLayout ? "text-sm sm:text-base" : ""
                      }`}
                    >
                      {button.label}
                    </span>
                  </div>

                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>

                  {/* Grid layout enhancement - corner accent */}
                  {isGridLayout && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>

                {/* Separator line - only for flex layout */}
                {!isGridLayout && index < buttons.length - 1 && (
                  <div className="relative mx-3">
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-accent/30 to-transparent"></div>
                    <div className="absolute inset-0 w-px bg-gradient-to-b from-transparent via-accent/10 to-transparent blur-sm"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
