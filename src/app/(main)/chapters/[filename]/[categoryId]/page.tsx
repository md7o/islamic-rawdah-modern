import { notFound } from "next/navigation";
import BookView from "@/components/pages/ChaptersPage/BookView";
import fs from "fs";
import path from "path";
import { Metadata } from "next";

interface CategoryPageProps {
  params: {
    filename: string;
    categoryId: string;
  };
}

async function getArticleData(filename: string, categoryId: string) {
  try {
    // Add .json extension if not present
    const filenameWithExtension = filename.endsWith(".json")
      ? filename
      : `${filename}.json`;

    // Try to read from ArticlesJson first
    let filePath = path.join(
      process.cwd(),
      "public",
      "Json",
      "ArticlesJson",
      filenameWithExtension
    );

    let fileContents: string;

    try {
      fileContents = fs.readFileSync(filePath, "utf8");
    } catch (error) {
      // If not found in ArticlesJson, try BooksJson
      filePath = path.join(
        process.cwd(),
        "public",
        "Json",
        "BooksJson",
        filenameWithExtension
      );
      fileContents = fs.readFileSync(filePath, "utf8");
    }

    const data = JSON.parse(fileContents);
    const articles = Array.isArray(data) ? data : [data];

    // Get all sections
    const sectionItems = articles.filter(
      (item: any) => item.type === "section"
    );

    // Find the chapter index by categoryId
    const chapterIndex = sectionItems.findIndex(
      (section: any) => section.id === categoryId
    );

    if (chapterIndex === -1) {
      return null; // Chapter not found
    }

    return {
      sections: sectionItems,
      currentChapter: chapterIndex,
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return null; // File not found or parsing error
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { filename, categoryId } = await params;

  const articleData = await getArticleData(filename, categoryId);

  if (!articleData) {
    return {
      title: "الصفحة غير موجودة | الروضة الإسلامي",
    };
  }

  const { sections, currentChapter } = articleData;
  const currentSection = sections[currentChapter];

  return {
    title: `${
      currentSection.title || `فصل ${currentChapter + 1}`
    } | الروضة الإسلامي`,
    description: currentSection.content
      ? currentSection.content.substring(0, 160)
      : undefined,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { filename, categoryId } = await params;

  const articleData = await getArticleData(filename, categoryId);

  if (!articleData) {
    notFound();
  }

  const { sections, currentChapter } = articleData;

  return (
    <article className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <BookView
          sections={sections}
          currentChapter={currentChapter}
          filename={filename}
        />
      </div>
    </article>
  );
}
