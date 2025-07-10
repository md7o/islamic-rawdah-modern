"use client";

import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-accent flex justify-center items-center text-white w-10 h-10 rounded-full hover:opacity-70 cursor-pointer transition duration-200"
        aria-label="Back to Top"
      >
        <ArrowUp />
      </button>
    )
  );
};

export default BackToTopButton;
