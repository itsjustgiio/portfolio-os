import Link from "next/link";
import { ReadingPage } from "@/portfolio/reading";
export default function NotFound() {
  return (
    <ReadingPage title="Page not found">
      <p>This page could not be found.</p>
      <p>
        <Link prefetch={false} href="/projects/">
          Browse the portfolio
        </Link>
      </p>
    </ReadingPage>
  );
}
