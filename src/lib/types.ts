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

export interface BookViewProps {
  sections: Section[];
  currentChapter: number;
  filename: string;
}
