import React from "react";
import { Section } from "@/lib/types";

// ======== وظائف مساعدة لمعالجة تاغ [sh] ========

// الجزء الأول: إزالة التاغات واستخراج النص
function extractShContent(raw: string): string[][] {
  return raw
    .trim()
    .split(/[\r\n]+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("=").map((s) => s.trim()));
}

// الجزء الثاني: أخذ كل شطر وتخزينه في span
function createVerseSpans(verses: string[][]): React.ReactNode[] {
  return verses.map((pair, i) => (
    <div key={i} className="flex justify-center gap-5 mb-4 min-h-[3rem]">
      {pair.map((line, j) => (
        <div
          key={j}
          className="flex justify-center items-center"
          style={{ width: "360px" }}
        >
          <span
            className="block text-center w-full overflow-visible whitespace-nowrap"
            style={{
              fontSize: "18px",
              lineHeight: "2rem",
              fontFeatureSettings: '"kern" off',
              textRendering: "optimizeSpeed",
            }}
          >
            {stretchToWidth(line || "", 360)}
          </span>
        </div>
      ))}
    </div>
  ));
}

// الجزء الثالث: تنسيق الشطور باستخدام ـ وتحديد width ثابت 360px
function stretchToWidth(text: string, targetWidth: number = 360): string {
  if (!text) return "";

  // تقسيم النص لحروف
  const splitGraphemes = (str: string) => [...str.normalize("NFC")];

  // تحديد الأحرف القابلة للتمديد
  const canStretch = (char: string, nextChar: string) => {
    const connectables = /[بتثجحخسشصضطظعغفقكلمنهىي]/i;
    return (
      connectables.test(char) &&
      connectables.test(nextChar) &&
      char !== "ـ" &&
      nextChar !== "ـ"
    );
  };

  const chars = splitGraphemes(text);
  const baseLength = chars.length;

  // حساب عدد التمديدات المطلوبة بناءً على العرض
  // تقدير: كل حرف ≈ 15px في المتوسط
  const estimatedCurrentWidth = baseLength * 15;
  const neededExtensions = Math.max(
    0,
    Math.floor((targetWidth - estimatedCurrentWidth) / 15)
  );

  if (neededExtensions <= 0) return text;

  // العثور على مواضع التمديد المحتملة
  const stretchPositions = [];
  for (let i = 0; i < chars.length - 1; i++) {
    if (canStretch(chars[i], chars[i + 1])) {
      stretchPositions.push(i);
    }
  }

  if (stretchPositions.length === 0) {
    // إذا لم توجد مواضع تمديد، أضف في النهاية
    return text + "ـ".repeat(Math.min(neededExtensions, 8));
  }

  // توزيع التمديد بالتساوي
  let result = [...chars];
  let addedExtensions = 0;
  let positionIndex = 0;

  while (addedExtensions < neededExtensions && addedExtensions < 20) {
    // حد أقصى للأمان
    const pos =
      stretchPositions[positionIndex % stretchPositions.length] +
      addedExtensions;
    result.splice(pos + 1, 0, "ـ");
    addedExtensions++;
    positionIndex++;
  }

  return result.join("");
}

// Define markup patterns and their corresponding styles
const MARKUP_PATTERNS = {
  // [sh]text[/sh] - Special highlight with golden color
  sh: {
    pattern: /\[sh\]([\s\S]*?)\[\/sh\]/g,
    component: (raw: string, idx: number) => {
      // الجزء الأول: استخراج النص من التاغات
      const verses = extractShContent(raw);

      // الجزء الثاني والثالث: إنشاء العرض مع التمديد
      return (
        <div
          key={idx}
          style={{
            direction: "rtl",
            fontFamily: "Amiri, serif",
            color: "#fbbf24",
          }}
          className="text-center my-8"
        >
          {createVerseSpans(verses)}
        </div>
      );
    },
  },
};

// Parse content and convert markup to React components
export function parseContentMarkup(content: string): React.ReactNode[] {
  let parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let componentIndex = 0;

  // Find all markup patterns in the content
  const allMatches: Array<{
    match: RegExpMatchArray;
    patternKey: string;
    component: (content: string, index: number) => React.ReactNode;
  }> = [];

  Object.entries(MARKUP_PATTERNS).forEach(([key, pattern]) => {
    const matches = Array.from(content.matchAll(pattern.pattern));
    matches.forEach((match) => {
      allMatches.push({
        match,
        patternKey: key,
        component: pattern.component,
      });
    });
  });

  // Sort matches by their position in the string
  allMatches.sort((a, b) => (a.match.index || 0) - (b.match.index || 0));

  // Process each match
  allMatches.forEach(({ match, component }) => {
    const matchStart = match.index || 0;
    const matchEnd = matchStart + match[0].length;

    // Add text before the match
    if (matchStart > lastIndex) {
      const textBefore = content.slice(lastIndex, matchStart);
      if (textBefore) {
        parts.push(textBefore);
      }
    }

    // Add the styled component
    const innerContent = match[1] || "";
    parts.push(component(innerContent, componentIndex++));

    lastIndex = matchEnd;
  });

  // Add remaining text after the last match
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    if (remainingText) {
      parts.push(remainingText);
    }
  }

  // If no matches found, return the original content
  if (parts.length === 0) {
    parts.push(content);
  }

  return parts;
}

// Apply content filters to sections
export function applyContentFilters(sections: Section[]): Section[] {
  return sections.map((section) => ({
    ...section,
    // Keep the original content for processing, we'll parse it in the component
    content: section.content,
  }));
}

// Apply filters to title
export function applyTitleFilter(title: string): string {
  // For titles, we'll just remove the markup and return clean text
  let cleanTitle = title;

  Object.values(MARKUP_PATTERNS).forEach((pattern) => {
    cleanTitle = cleanTitle.replace(pattern.pattern, "$1");
  });

  return cleanTitle;
}

// Component to render parsed content
export function ParsedContent({ content }: { content: string }) {
  const parsedContent = parseContentMarkup(content);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none text-right leading-relaxed">
      <div className="whitespace-pre-wrap">
        {parsedContent.map((part, index) => (
          <React.Fragment key={index}>{part}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
