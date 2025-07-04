"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchTotalPages, fetchDailyPages } from "@/lib/api";
import { io, Socket } from "socket.io-client";

interface PagesContextType {
  totalPages: number | null;
  dailyPages: number | null;
  socket: Socket | null;
  userCount: number | null;
  refreshTotal: () => Promise<void>;
  refreshDaily: () => Promise<void>;
}

const PagesContext = createContext<PagesContextType | undefined>(undefined);

export const PagesProvider = ({ children }: { children: ReactNode }) => {
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [dailyPages, setDailyPages] = useState<number | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);

  const refreshTotal = async () => {
    try {
      const count = await fetchTotalPages();
      setTotalPages(count);
    } catch {
      setTotalPages(null);
    }
  };

  const refreshDaily = async () => {
    try {
      const count = await fetchDailyPages();
      setDailyPages(count);
    } catch {
      setDailyPages(null);
    }
  };

  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);
    s.on("userCount", (count: number) => {
      setUserCount(count);
    });
    s.emit("getUserCount");
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    // Initial fetch
    refreshTotal();
    refreshDaily();
    // Poll every 1 second
    const interval = setInterval(() => {
      refreshTotal();
      refreshDaily();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PagesContext.Provider
      value={{
        totalPages,
        dailyPages,
        socket,
        userCount,
        refreshTotal,
        refreshDaily,
      }}
    >
      {children}
    </PagesContext.Provider>
  );
};

export const usePages = () => {
  const context = useContext(PagesContext);
  if (!context) throw new Error("usePages must be used within a PagesProvider");
  return context;
};
