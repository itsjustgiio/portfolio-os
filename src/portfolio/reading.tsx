import Link from "next/link";
import type { ReactNode } from "react";
import { readingLinks, servers } from "./content";
import styles from "./reading.module.css";

export function ReadingPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className={styles.reading}>
      <header>
        <Link prefetch={false} href="/">
          Giovanni OS desktop
        </Link>
        <nav aria-label="Portfolio pages">
          {readingLinks.map((link) => (
            <Link prefetch={false} key={link.href} href={link.href}>
              {link.title}
            </Link>
          ))}
        </nav>
      </header>
      <h1>{title}</h1>
      {children}
    </main>
  );
}

export function PortfolioLinks() {
  return (
    <ul>
      {servers.map((server) => (
        <li key={server.id}>
          <Link prefetch={false} href={`/projects/${server.id}/`}>
            {server.title}
          </Link>{" "}
          · {server.summary}
        </li>
      ))}
    </ul>
  );
}
