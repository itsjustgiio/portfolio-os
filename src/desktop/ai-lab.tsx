import Image from "next/image";
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import {
  aiProjects,
  documentsFor,
  getAiProject,
  type AiFileAppId,
  type AiProjectId,
  type ProjectImage,
} from "@/portfolio/ai-projects";
import { Icon } from "./icon";
import type { AppId } from "./registry";
import chrome from "./network-topology.module.css";
import explorer from "./my-documents.module.css";
import luna from "./luna.module.css";
import styles from "./ai-lab.module.css";

type Location = { project: AiProjectId | null; screenshots?: true };
type Entry =
  | { name: string; kind: "folder"; location: Location; subtitle?: string }
  | { name: string; kind: "text" | "image"; app: AiFileAppId }
  | { name: string; kind: "link"; href: `https://${string}` };

const root: Location = { project: null };
const share = ["", "", "GIOVANNI-CORE", "AI-LAB-SRV"].join("\\");

function listEntries(location: Location): Entry[] {
  const project = location.project ? getAiProject(location.project) : undefined;
  if (!project)
    return aiProjects.map(({ id, folder, subtitle }) => ({
      name: folder,
      subtitle,
      kind: "folder",
      location: { project: id },
    }));
  const projectId = project.id;
  if (location.screenshots)
    return (project.images ?? []).map((image) => ({
      name: image.name,
      kind: "image",
      app: `ai-image:${projectId}:${image.id}`,
    }));

  const items: Entry[] = documentsFor(project).map((file) => ({
    name: file.name,
    kind: "text",
    app: `ai-text:${projectId}:${file.id}`,
  }));
  if (project.images?.length)
    items.push({
      name: "Screenshots",
      kind: "folder",
      location: { project: projectId, screenshots: true },
    });
  for (const { label, href } of project.links ?? [])
    items.push({ name: label, kind: "link", href });
  return items;
}

export function AiLab({
  open,
}: {
  open: (id: AppId, source: HTMLElement) => void;
}) {
  const [navigation, setNavigation] = useState({ locations: [root], index: 0 });
  const [selected, setSelected] = useState<Entry | null>(null);
  const descriptionPrefix = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const transitioning = useRef(false);
  const location = navigation.locations[navigation.index];
  const project = location.project ? getAiProject(location.project) : undefined;
  const entries = listEntries(location);
  const selectedProject =
    selected?.kind === "folder" && !project && selected.location.project
      ? getAiProject(selected.location.project)
      : project;

  useLayoutEffect(() => {
    if (!transitioning.current) return;
    transitioning.current = false;
    heading.current?.focus();
  }, [location]);

  function navigate(next: Location) {
    if (
      location.project === next.project &&
      location.screenshots === next.screenshots
    )
      return;
    transitioning.current = true;
    setSelected(null);
    setNavigation(({ locations, index }) => ({
      locations: [...locations.slice(0, index + 1), next],
      index: index + 1,
    }));
  }

  function go(delta: -1 | 1) {
    transitioning.current = true;
    setSelected(null);
    setNavigation((current) => ({ ...current, index: current.index + delta }));
  }

  function activate(entry: Entry, source: HTMLElement) {
    if (entry.kind === "folder") navigate(entry.location);
    else if (entry.kind === "link")
      window.open(entry.href, "_blank", "noopener,noreferrer");
    else open(entry.app, source);
  }

  function select(event: MouseEvent<HTMLElement>, entry: Entry) {
    setSelected(entry);
    const pointer = event.nativeEvent as PointerEvent;
    if (entry.kind === "link") {
      if (
        event.detail !== 0 &&
        pointer.pointerType !== "touch" &&
        !event.metaKey &&
        !event.ctrlKey
      )
        event.preventDefault();
    } else if (event.detail === 0 || pointer.pointerType === "touch") {
      activate(entry, event.currentTarget);
    }
  }

  return (
    <div className={`${chrome.explorer} ${styles.shell}`}>
      <div className={styles.menu} aria-label="Explorer menu labels">
        {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div
        className={chrome.toolbar}
        role="group"
        aria-label="AI Lab folder actions"
      >
        <button disabled={navigation.index === 0} onClick={() => go(-1)}>
          <span aria-hidden="true" className={explorer.backIcon}>
            ←
          </span>{" "}
          Back
        </button>
        <button
          disabled={navigation.index === navigation.locations.length - 1}
          onClick={() => go(1)}
        >
          <span aria-hidden="true" className={explorer.backIcon}>
            →
          </span>{" "}
          Forward
        </button>
        <button
          disabled={!selected}
          onClick={(event) =>
            selected && activate(selected, event.currentTarget)
          }
        >
          <Icon name="documents" size="small" /> Open selected
        </button>
      </div>
      <div className={`${chrome.address} ${styles.address}`}>
        <span>Address</span>
        <Icon name="network" size="small" />
        <span>
          {[share, project?.folder, location.screenshots ? "Screenshots" : null]
            .filter(Boolean)
            .join("\\")}
        </span>
      </div>
      <div className={`${explorer.body} ${styles.body}`}>
        <aside className={explorer.tasks} aria-label="AI Lab tasks">
          <section>
            <h3>File and Folder Tasks</h3>
            <p>Double-click, press Enter, or tap an item to open it.</p>
          </section>
          <section>
            <h3>Other Places</h3>
            <button onClick={(event) => open("network", event.currentTarget)}>
              <Icon name="network" size="small" /> My Network Places
            </button>
            {project && (
              <button onClick={() => navigate(root)}>
                <Icon name="documents" size="small" /> AI-LAB-SRV
              </button>
            )}
          </section>
          <section aria-live="polite">
            <h3>Details</h3>
            {selectedProject ? (
              <>
                <p>
                  <strong>{selectedProject.folder}</strong>
                  <br />
                  {selectedProject.dates}
                  <br />
                  {selectedProject.status}
                </p>
                <p>{selectedProject.overview}</p>
              </>
            ) : (
              <p>AI and software projects</p>
            )}
          </section>
        </aside>
        <section
          className={`${luna.files} ${explorer.directory} ${styles.directory}`}
          aria-label="AI Lab folder contents"
        >
          <h2 ref={heading} tabIndex={-1}>
            {location.screenshots
              ? "Screenshots"
              : (project?.folder ?? "AI-LAB-SRV")}
          </h2>
          <ul className={styles.items}>
            {entries.map((entry) => {
              const marked = selected?.name === entry.name;
              const icon =
                entry.kind === "folder"
                  ? "documents"
                  : entry.kind === "link"
                    ? "network"
                    : entry.kind === "image"
                      ? "personal"
                      : "textFile";
              const subtitle =
                entry.kind === "folder" ? entry.subtitle : undefined;
              const description =
                subtitle && entry.kind === "folder"
                  ? descriptionPrefix + "-" + entry.location.project
                  : undefined;
              const label = (
                <>
                  <Icon name={icon} />
                  {subtitle ? (
                    <span className={styles.projectLabel}>
                      <span>{entry.name}</span>
                      <span id={description} className={styles.subtitle}>
                        {subtitle}
                      </span>
                    </span>
                  ) : (
                    <span>{entry.name}</span>
                  )}
                </>
              );
              return (
                <li key={entry.name}>
                  {entry.kind === "link" ? (
                    <a
                      className={styles.entry}
                      data-selected={marked}
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => select(event, entry)}
                      onDoubleClick={(event) =>
                        activate(entry, event.currentTarget)
                      }
                    >
                      {label}
                    </a>
                  ) : (
                    <button
                      className={styles.entry}
                      aria-label={subtitle ? entry.name : undefined}
                      aria-describedby={description}
                      aria-pressed={marked}
                      data-selected={marked}
                      onClick={(event) => select(event, entry)}
                      onDoubleClick={(event) =>
                        activate(entry, event.currentTarget)
                      }
                    >
                      {label}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      <div className={styles.status} role="status">
        {entries.length} {entries.length === 1 ? "object" : "objects"}
        {selected ? ` · ${selected.name} selected` : ""}
      </div>
    </div>
  );
}

export function AiImageViewer({ image }: { image: ProjectImage }) {
  return (
    <figure className={styles.imageViewer}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        unoptimized
      />
      <figcaption>
        {image.alt} ·{" "}
        {image.source.href ? (
          <a href={image.source.href} target="_blank" rel="noopener noreferrer">
            {image.source.label}
          </a>
        ) : (
          image.source.label
        )}
      </figcaption>
    </figure>
  );
}
