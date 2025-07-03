import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";

const STRETCHABLE_PATTERN =
  /([^اأدإلءؤرآوزذـ \s\d\u064c\u064b\u064d\u064e\u064f\u0650\u0651\u0652])([\u064c\u064b\u064d\u064e\u064f\u0650\u0651\u0652])?([^ ـ\s\d\u064c\u064b\u064d\u064e\u064f\u0650\u0651\u0652])/g;

function AdjustCell(span: HTMLSpanElement, containerWidth: number) {
  const matched = span.innerHTML.match(STRETCHABLE_PATTERN);
  if (!matched) return;
  let i = 0;
  while (span.offsetWidth < containerWidth) {
    const ml = matched[i].length - 1;
    span.innerHTML = span.innerHTML.replace(
      matched[i],
      matched[i].slice(0, ml) + "ـ" + matched[i].slice(ml)
    );
    matched[i] = matched[i].slice(0, ml) + "ـ" + matched[i].slice(ml);
    i = (i + 1) % matched.length;
  }
}

export function ParsedContent({
  content,
  highlight = "",
  fontFamily = "",
}: {
  content: string;
  highlight?: string;
  fontFamily?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth <= 768 ? 200 : 280;
    container.querySelectorAll(".poem-line span").forEach((span) => {
      span.innerHTML = span.textContent || "";
      AdjustCell(span as HTMLSpanElement, width);
    });
  }, [content, fontFamily]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || !highlight) return;
    setTimeout(() => {
      container
        .querySelector("mark.bg-green-200")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, [content, highlight]);

  // Footnotes extraction
  let footnoteCounter = 0;
  const footnotes: Array<{ id: number; content: string }> = [];
  const processedContent = content.replace(
    /\[\[([^\[\]]*?)\]\]/g,
    (_, note) => {
      footnoteCounter++;
      footnotes.push({ id: footnoteCounter, content: note.trim() });
      return `[[${footnoteCounter}]]`;
    }
  );
  const processedBlocks = processedContent
    .split(/\[sh\]|\[\/sh\]/)
    .filter(Boolean);

  return (
    <div ref={containerRef} className="px-2 sm:px-4 md:px-6 ">
      {processedBlocks.map((block, bi) => {
        const matches = [...block.matchAll(/\[shtr\](.*?)\[\/shtr\]/g)];
        if (!matches.length)
          return (
            <div key={bi}>
              {processContentWithImages(block).map((part, i) =>
                part.type === "image" ? (
                  <ContentImage
                    key={`${bi}-${i}`}
                    src={cleanSrc(part.content)}
                    alt="صورة"
                  />
                ) : (
                  <p
                    key={`${bi}-${i}`}
                    className="mb-4 sm:mb-6 leading-[2.5rem] px-2 sm:px-0"
                    dangerouslySetInnerHTML={{
                      __html: highlight
                        ? formatBracketedContentWithoutImages(
                            part.content
                          ).replace(
                            new RegExp(`(${highlight})`, "gi"),
                            '<mark class="bg-green-200 px-2 rounded-sm text-black font-medium">$1</mark>'
                          )
                        : formatBracketedContentWithoutImages(part.content),
                    }}
                  />
                )
              )}
            </div>
          );
        return (
          <div
            key={bi}
            className="poem text-center font-[amiri] space-y-3 sm:space-y-4 md:space-y-6 my-6 sm:my-8 md:my-10 p-3 sm:p-4 md:p-6 bg-accent/5 rounded-lg"
          >
            {matches.map((m, li) => {
              const [left, right] = m[1].split("=").map((s) => s.trim());
              return (
                <div key={li} className="space-y-2">
                  <div className="poem-line flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 md:gap-8 lg:gap-12 text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed">
                    <div className="order-2 sm:order-1 px-2 py-1">
                      {processContentWithImages(left).map((part, i) =>
                        part.type === "image" ? (
                          <ContentImage
                            key={i}
                            src={cleanSrc(part.content)}
                            alt="صورة"
                          />
                        ) : (
                          <span
                            key={i}
                            dangerouslySetInnerHTML={{
                              __html: formatBracketedContentWithoutImages(
                                part.content
                              ),
                            }}
                          />
                        )
                      )}
                    </div>
                    <div className="order-1 sm:order-2 px-2 py-1">
                      {processContentWithImages(right).map((part, i) =>
                        part.type === "image" ? (
                          <ContentImage
                            key={i}
                            src={cleanSrc(part.content)}
                            alt="صورة"
                          />
                        ) : (
                          <span
                            key={i}
                            dangerouslySetInnerHTML={{
                              __html: formatBracketedContentWithoutImages(
                                part.content
                              ),
                            }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      {footnotes.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-right text-gray-800 dark:text-gray-200">
            الهوامش
          </h3>
          <div className="space-y-3">
            {footnotes.map((f) => (
              <div
                key={f.id}
                className="flex gap-3 text-lg leading-relaxed text-gray-700 dark:text-gray-300 text-right"
              >
                <span className="text-amber-200 font-semibold min-w-[1.5rem] text-center">
                  {f.id} -
                </span>
                <span className="flex-1">{f.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContentImage({ src, alt = "صورة" }: { src: string; alt?: string }) {
  return (
    <div className="my-4 mx-auto text-center">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        className="max-w-full h-auto rounded-lg shadow-md mx-auto"
        style={{ width: "auto", height: "auto" }}
        loading="lazy"
      />
    </div>
  );
}

function cleanSrc(src: string) {
  let s = src.replace(/^\/\//, "/");
  s = s.startsWith("/") ? s : `/${s}`;
  s = s.replace(/\/+/g, "/");
  return s.replace(/^(\/)+/, "/");
}

function processContentWithImages(text: string) {
  const parts: Array<{ type: "text" | "image"; content: string }> = [];
  const imageRegex =
    /\[img\]([^\[\]]+(?:\.(?:jpg|jpeg|png|gif|webp|svg)))\[\/img\]/gi;
  let lastIndex = 0,
    match;
  while ((match = imageRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const t = text.substring(lastIndex, match.index);
      if (t.trim()) parts.push({ type: "text", content: t });
    }
    parts.push({ type: "image", content: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    const t = text.substring(lastIndex);
    if (t.trim()) parts.push({ type: "text", content: t });
  }
  return parts.length ? parts : [{ type: "text", content: text }];
}

function formatBracketedContentWithoutImages(text: string): string {
  let result = text.replace(/\\n/g, "<br />");
  result = result.replace(
    /\[s2\]([^[]*?)(?=\[|$)/g,
    (_, c) => `<span class=\"inline-block py-8 mx-1 \">${c.trim()}</span>`
  );
  result = result.replace(
    /\[s3\]([^[]*?)(?=\[|$)/g,
    (_, c) => `<span class=\"inline-block py-8 mx-1 \">${c.trim()}</span>`
  );
  result = result.replace(
    /\[\[(\d+)\]\]/g,
    (_, n) =>
      `<sup class=\"text-amber-200 font-bold text-lg mx-1 cursor-pointer hover:text-amber-300 transition-colors\">${n}</sup>`
  );
  result = result.replace(
    /\[(?!s2\]|s3\])([^\]]+)\]/g,
    (_, c) =>
      `<span class=\"inline-block text-blue-800 dark:text-blue-300 text-xl  py-1  mx-1\">${c}</span>`
  );
  result = result.replace(
    /\(\([^)]+\)\)/g,
    (m, c) =>
      `<span class=\"inline-block text-blue-800 dark:text-blue-300 text-lg px-2 py-1 text-normal mx-1 \">(${c})</span>`
  );
  result = result.replace(
    /\{([^}]+)\}/g,
    (_, c) =>
      `<span class=\"inline-block text-green-700 dark:text-green-600 px-2 py-1 font-serif leading-[2rem] text-justify mx-1\">{${c}}</span>`
  );
  return result;
}
