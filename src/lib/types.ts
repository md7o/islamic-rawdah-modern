// Article and Book related types
export interface Section {
  type: string;
  id?: string;
  title?: string;
  content: string;
}

export interface Article {
  id?: string;
  type: string;
  title?: string;
  content: string;
  filename?: string;
}

export interface Viewer {
  type: string;
  content: string;
  filename: string;
  index: number;
  sectionCount: number;
}

// Theme and UI types
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
//   sections,
//   currentChapter,
//   filename,

export interface BookViewProps {
  sections: Section[];
  currentChapter: number;
  filename: string;
}
