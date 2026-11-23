import Link from "next/link";
import { biography } from "@/portfolio/content";
import { ReadingPage } from "@/portfolio/reading";
export const metadata = { title: "About Giovanni Carrion | Giovanni OS" };
export default function AboutPage() {
  return (
    <ReadingPage title="About Giovanni Carrion">
      <p>{biography}</p>
      <p>
        <Link prefetch={false} href="/projects/">
          Explore the portfolio
        </Link>
      </p>
    </ReadingPage>
  );
}
