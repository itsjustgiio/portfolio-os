import { aiProjects, documentsFor } from "@/portfolio/ai-projects";
import Link from "next/link";
import { notFound } from "next/navigation";
import { biography, servers } from "@/portfolio/content";
import { ReadingPage } from "@/portfolio/reading";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return servers.map(({ id }) => ({ slug: id }));
}

async function getCategory(params: Props["params"]) {
  const { slug } = await params;
  const server = servers.find(({ id }) => id === slug);
  if (!server) notFound();
  return server;
}

export async function generateMetadata({ params }: Props) {
  const server = await getCategory(params);
  return {
    title: `${server.title} | Giovanni OS`,
    description: server.summary,
  };
}

export default async function CategoryPage({ params }: Props) {
  const server = await getCategory(params);
  return (
    <ReadingPage title={server.title}>
      <p>{server.summary}</p>
      {server.id === "ai-projects" ? (
        <ul>
          {aiProjects.map((project) => (
            <li key={project.id}>
              <details>
                <summary>
                  {project.folder} — {project.status}
                </summary>
                {documentsFor(project).map((file) => (
                  <div key={file.id} style={{ whiteSpace: "pre-wrap" }}>
                    {file.text}
                  </div>
                ))}
                {project.links && (
                  <ul>
                    {project.links.map(({ href, label }) => (
                      <li key={href}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            </li>
          ))}
        </ul>
      ) : server.id === "professional" ? (
        <>
          <p>{biography}</p>
          <p>
            <Link prefetch={false} href="/resume/">
              View résumé information
            </Link>
          </p>
        </>
      ) : (
        <p>Project details will appear here when they are ready to share.</p>
      )}
      <p>
        <Link prefetch={false} href="/projects/">
          All portfolio categories
        </Link>
      </p>
    </ReadingPage>
  );
}
