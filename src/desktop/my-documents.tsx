import Link from "next/link";
import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { biography, servers } from "@/portfolio/content";
import { Icon } from "./icon";
import type { AppId } from "./registry";
import chrome from "./network-topology.module.css";
import styles from "./luna.module.css";
import files from "./my-documents.module.css";

const folders = {
  projects: {
    title: "Projects",
    empty: "Technical writeups and diagrams will appear here once approved.",
  },
  certifications: {
    title: "Certifications",
    empty: "No verified credentials have been published here yet.",
  },
  ctf: {
    title: "CTF Writeups",
    empty: "Competition reports will appear here once approved.",
  },
  photos: {
    title: "Photos",
    empty: "No personal photos have been approved for publication yet.",
  },
} as const;

type Folder = keyof typeof folders;
type Entry = Folder | "about-text";
const entries: Entry[] = [
  "about-text",
  "projects",
  "certifications",
  "ctf",
  "photos",
];

export function MyDocuments({
  open,
}: {
  open: (id: AppId, source: HTMLElement) => void;
}) {
  const [folder, setFolder] = useState<Folder | null>(null);
  const [selected, setSelected] = useState<Entry | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const entryButtons = useRef(new Map<Entry, HTMLButtonElement>());

  useLayoutEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    if (!folder && selected) entryButtons.current.get(selected)?.focus();
    else heading.current?.focus();
  }, [folder, selected]);

  function activate(entry: Entry, source: HTMLElement) {
    if (entry === "about-text") {
      open(entry, entryButtons.current.get(entry) ?? source);
      return;
    }
    moved.current = true;
    setSelected(entry);
    setFolder(entry);
  }

  function select(event: MouseEvent<HTMLButtonElement>, entry: Entry) {
    setSelected(entry);
    const pointer = event.nativeEvent as PointerEvent;
    if (event.detail === 0 || pointer.pointerType === "touch")
      activate(entry, event.currentTarget);
  }

  return (
    <div className={chrome.explorer}>
      <div className={chrome.toolbar} role="group" aria-label="Folder actions">
        <button
          disabled={!folder}
          onClick={() => {
            moved.current = true;
            setFolder(null);
          }}
        >
          <span className={files.backIcon} aria-hidden="true">
            ←
          </span>{" "}
          Back
        </button>
        <button
          disabled={!!folder || !selected}
          onClick={(event) =>
            selected && activate(selected, event.currentTarget)
          }
        >
          <Icon name="documents" size="small" /> Open selected
        </button>
      </div>
      <div className={chrome.address}>
        <span>Address</span>
        <Icon name="documents" size="small" /> My Documents
        {folder && ` / ${folders[folder].title}`}
      </div>
      <div className={files.body}>
        <aside className={files.tasks} aria-label="Document tasks">
          <section>
            <h3>File and Folder Tasks</h3>
            <Link prefetch={false} href="/projects/">
              <Icon name="documents" size="small" /> View portfolio
            </Link>
          </section>
          <section>
            <h3>Other Places</h3>
            <button onClick={(event) => open("computer", event.currentTarget)}>
              <Icon name="computer" size="small" /> My Computer
            </button>
            <button onClick={(event) => open("network", event.currentTarget)}>
              <Icon name="network" size="small" /> My Network Places
            </button>
          </section>
          <section>
            <h3>Details</h3>
            <p>
              {folder
                ? folders[folder].title
                : selected === "about-text"
                  ? "Text Document"
                  : selected
                    ? "File Folder"
                    : `${entries.length} objects`}
            </p>
          </section>
        </aside>
        <section
          className={`${styles.files} ${files.directory}`}
          aria-label="Folder contents"
        >
          <h2 ref={heading} tabIndex={-1}>
            {folder ? folders[folder].title : "My Documents"}
          </h2>
          {folder ? (
            <>
              <p>{folders[folder].empty}</p>
              {folder === "projects" && (
                <ul>
                  {servers.map(({ id, title }) => (
                    <li key={id}>
                      <Link prefetch={false} href={`/projects/${id}/`}>
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <ul className={files.entries}>
              {entries.map((entry) => (
                <li key={entry}>
                  <button
                    ref={(element) => {
                      if (element) entryButtons.current.set(entry, element);
                      else entryButtons.current.delete(entry);
                    }}
                    aria-pressed={selected === entry}
                    onClick={(event) => select(event, entry)}
                    onDoubleClick={(event) =>
                      activate(entry, event.currentTarget)
                    }
                  >
                    <Icon
                      name={entry === "about-text" ? "textFile" : "documents"}
                    />
                    <span>
                      {entry === "about-text"
                        ? "About Me.txt"
                        : folders[entry].title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export function ReadonlyNotepad({
  name,
  text,
  href,
}: {
  name: string;
  text: string;
  href?: string;
}) {
  return (
    <div className={files.notepad}>
      <div className={files.notepadBar}>
        <span>Read-only</span>
        {href && (
          <Link prefetch={false} href={href}>
            Read on the web
          </Link>
        )}
      </div>
      <pre aria-label={name + " contents"} tabIndex={0}>
        {text}
      </pre>
    </div>
  );
}

export function AboutNotepad() {
  return (
    <ReadonlyNotepad name="About Me.txt" text={biography} href="/about/" />
  );
}
