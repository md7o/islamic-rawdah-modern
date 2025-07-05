import Introduction from "@/components/pages/HomePage/Introduction";
import ViewArticles from "@/components/pages/HomePage/ViewArticles";
import ViewBooks from "@/components/pages/HomePage/ViewBooks";

export default function Home() {
  return (
    <main>
      <Introduction />
      <div id="articles-section">
        <ViewArticles />
      </div>
      <div id="books-section">
        <ViewBooks />
      </div>
    </main>
  );
}
