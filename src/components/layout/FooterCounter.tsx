"use client";
import { useEffect, useState } from "react";
import { usePages } from "@/context/PagesContext";
import { BookOpen, Calendar, Users } from "lucide-react";

export default function FooterCounter() {
  const { totalPages, dailyPages, socket, userCount } = usePages();

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 px-4">
      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-purple-400/5 px-4 py-2 rounded-lg border border-purple-500/20">
        <BookOpen className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          مجموع الصفحات:
        </span>
        <span className="text-lg font-bold text-purple-600">
          {totalPages !== null ? totalPages.toLocaleString() : "..."}
        </span>
      </div>

      <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-cyan-400/5 px-4 py-2 rounded-lg border border-cyan-500/20">
        <Calendar className="w-4 h-4 text-cyan-600" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          الصفحات اليومية:
        </span>
        <span className="text-lg font-bold text-cyan-600">
          {dailyPages !== null ? dailyPages.toLocaleString() : "..."}
        </span>
      </div>

      <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-green-400/5 px-4 py-2 rounded-lg border border-green-500/20">
        <div className="relative flex items-center gap-2">
          <Users className="w-4 h-4 text-green-600" />
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75"></div>
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          المتواجدين الآن:
        </span>
        <span className="text-lg font-bold text-green-600">
          {socket !== null ? userCount || 0 : "..."}
        </span>
      </div>
    </div>
  );
}
