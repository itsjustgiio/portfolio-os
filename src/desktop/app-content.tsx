import Link from "next/link";
import { getAiFile } from "@/portfolio/ai-projects";
import { biography, readingLinks, servers } from "@/portfolio/content";
import { ResumeViewer } from "@/portfolio/resume-viewer";
import { AiImageViewer, AiLab } from "./ai-lab";
import { Icon } from "./icon";
import { AboutNotepad, MyDocuments, ReadonlyNotepad } from "./my-documents";
import { NetworkTopology } from "./network-topology";
import networkStyles from "./network-topology.module.css";
import { getApp, type AppId } from "./registry";
import styles from "./luna.module.css";

export function AppContent({
  id,
  open,
}: {
  id: AppId;
  open: (id: AppId, source: HTMLElement) => void;
}) {
  const aiFile = getAiFile(id);
  if (aiFile?.kind === "text")
    return <ReadonlyNotepad name={aiFile.file.name} text={aiFile.file.text} />;
  if (aiFile?.kind === "image") return <AiImageViewer image={aiFile.file} />;
  if (id === "ai-projects") return <AiLab open={open} />;
  if (id === "resume") return <ResumeViewer inWindow />;
  if (id === "documents") return <MyDocuments open={open} />;
  if (id === "about-text") return <AboutNotepad />;
  if (id === "network") return <NetworkTopology open={open} />;

  const server = servers.find((entry) => entry.id === id);
  if (server) {
    return (
      <div className={networkStyles.explorer}>
        <div className={networkStyles.toolbar}>
          <button onClick={(event) => open("network", event.currentTarget)}>
            <Icon name="network" size="small" /> My Network Places
          </button>
        </div>
        <div className={networkStyles.address}>
          <span>Address</span>
          <Icon name="documents" size="small" /> {server.hostname}
        </div>
        <div className={styles.document}>
          <h2>{server.title}</h2>
          <p>{server.summary}</p>
          {server.id === "professional" ? (
            <p>{biography}</p>
          ) : (
            <p>
              Project details will appear here when they are ready to share.
            </p>
          )}
          <Link prefetch={false} href={getApp(id)?.route ?? "/projects/"}>
            Open portfolio page
          </Link>
        </div>
      </div>
    );
  }
  if (id === "computer") {
    return (
      <div className={styles.explorer}>
        <aside>
          <strong>System Tasks</strong>
          <button onClick={(event) => open("network", event.currentTarget)}>
            My Network Places
          </button>
          <Link prefetch={false} href="/projects/">
            View portfolio
          </Link>
        </aside>
        <div className={styles.files}>
          <h2>Portfolio folders</h2>
          <ul>
            {servers.map(({ id, title }) => (
              <li key={id}>
                <button onClick={(event) => open(id, event.currentTarget)}>
                  <Icon name={getApp(id)!.icon} />
                  <span>{title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.document}>
      {id === "welcome" && (
        <>
          <h2>Welcome to Giovanni OS</h2>
          <p>{biography}</p>
          <button
            className={styles.classicButton}
            onClick={(event) => open("network", event.currentTarget)}
          >
            Explore My Network
          </button>
          <nav aria-label="Read the portfolio">
            {readingLinks.map(({ href, title }) => (
              <Link prefetch={false} key={href} href={href}>
                {title}
              </Link>
            ))}
          </nav>
        </>
      )}
      {id === "recycle" && (
        <>
          <h2>Recycle Bin</h2>
          <p>The Recycle Bin is empty.</p>
        </>
      )}
    </div>
  );
}
