import React, { ReactNode } from "react";

export function InfiniteMarquee({
  children,
  className = "",
  reverse = false,
  pauseOnHover = false,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  const marqueeStyle = {
    animation: reverse
      ? "marquee-reverse 20s linear infinite"
      : "marquee-forward 20s linear infinite",
    animationPlayState: "running" as const,
  };

  return (
    <>
      <style jsx global>{`
        @keyframes marquee-forward {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .infinite-marquee:hover .marquee-content {
          animation-play-state: ${pauseOnHover
            ? "paused"
            : "running"} !important;
        }
      `}</style>
      <div className={`overflow-hidden w-full infinite-marquee ${className}`}>
        <div
          className="marquee-content whitespace-nowrap"
          style={marqueeStyle}
          onMouseEnter={(e) =>
            pauseOnHover &&
            (e.currentTarget.style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            pauseOnHover &&
            (e.currentTarget.style.animationPlayState = "running")
          }
        >
          {children}
        </div>
      </div>
    </>
  );
}
