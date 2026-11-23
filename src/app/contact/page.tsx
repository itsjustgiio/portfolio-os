import Link from "next/link";
import { publicProfiles } from "@/portfolio/content";
import { ReadingPage } from "@/portfolio/reading";
export const metadata = { title: "Contact | Giovanni OS" };
export default function ContactPage() {
  return (
    <ReadingPage title="Contact">
      <ul>
        {publicProfiles.map(({ title, href }) => (
          <li key={href}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          </li>
        ))}
      </ul>
      <p>
        <Link prefetch={false} href="/about/">
          About Giovanni Carrion
        </Link>
      </p>
    </ReadingPage>
  );
}
