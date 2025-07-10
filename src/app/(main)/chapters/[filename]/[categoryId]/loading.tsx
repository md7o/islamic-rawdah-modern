import { FullLoadingSpinner } from "@/components/ui/custom/LoadingSpinner";

export default function Page() {
  return <FullLoadingSpinner />;
}
export const dynamic = "force-dynamic"; // Ensure this page is always revalidated
export const revalidate = 0; // Disable static generation for this page
