import Image from "next/image";
import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { portfolioCore, servers, type ServerId } from "@/portfolio/content";
import { Icon } from "./icon";
import type { AppId } from "./registry";
import styles from "./network-topology.module.css";

const towerIcon = "/artwork/topology-server-tower.webp";

type OpenApp = (id: AppId, source: HTMLElement) => void;
type Layout = [wideX: number, wideY: number, narrowX: number, narrowY: number];

const layout = {
  "it-infrastructure": [25, 17, 20, 39],
  cybersecurity: [17, 53, 80, 39],
  "ai-projects": [75, 17, 25, 63],
  professional: [83, 53, 75, 63],
  personal: [50, 85, 50, 88],
} satisfies Record<ServerId, Layout>;

function position([x, y, narrowX, narrowY]: Layout): CSSProperties {
  return {
    "--wide-x": x,
    "--wide-y": y,
    "--narrow-x": narrowX,
    "--narrow-y": narrowY,
  } as CSSProperties;
}

export function NetworkTopology({ open }: { open: OpenApp }) {
  const [selected, setSelected] = useState<ServerId | null>(null);
  const [list, setList] = useState(false);
  const selectedServer = servers.find(({ id }) => id === selected);

  function navigate(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;
    if (
      key !== "ArrowLeft" &&
      key !== "ArrowUp" &&
      key !== "ArrowRight" &&
      key !== "ArrowDown"
    )
      return;
    const direction = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
    const nodes = Array.from(
      event.currentTarget.closest("ul")?.querySelectorAll("button") ?? [],
    );
    const index = nodes.indexOf(event.currentTarget);
    event.preventDefault();
    nodes[(index + direction + nodes.length) % nodes.length]?.focus();
  }

  return (
    <div className={styles.explorer}>
      <div className={styles.toolbar} aria-label="Network actions" role="group">
        <button onClick={(event) => open("computer", event.currentTarget)}>
          <Icon name="computer" size="small" /> My Computer
        </button>
        <button aria-pressed={list} onClick={() => setList(!list)}>
          <Icon name="documents" size="small" /> Server list
        </button>
        <button
          disabled={!selected}
          onClick={(event) => selected && open(selected, event.currentTarget)}
        >
          Open selected
        </button>
      </div>
      <div className={styles.address}>
        <span>Address</span>
        <Icon name="network" size="small" /> My Network Places
      </div>
      <div className={styles.graphFrame}>
        <h2>Network Topology</h2>
        <p id="network-instructions">
          Each server represents a different part of my life. Double-click a
          server, press Enter, or use Open selected to explore it.
        </p>
        <div
          className={list ? styles.list : styles.graph}
          aria-describedby="network-instructions"
        >
          <div className={styles.core}>
            <Image
              className={styles.machine}
              src={towerIcon}
              width={64}
              height={64}
              unoptimized
              draggable={false}
              alt=""
            />
            <span>
              <strong>{portfolioCore.label}</strong>
            </span>
          </div>
          <ul aria-label="Simulated portfolio servers">
            {servers.map((server) => (
              <li
                key={server.id}
                className={styles.node}
                style={position(layout[server.id])}
              >
                {!list && (
                  <span className={styles.connection} aria-hidden="true" />
                )}
                <button
                  type="button"
                  aria-label={server.label}
                  aria-describedby={
                    list ? `network-summary-${server.id}` : undefined
                  }
                  aria-pressed={selected === server.id}
                  onKeyDown={navigate}
                  onClick={(event) => {
                    setSelected(server.id);
                    if (event.detail === 0)
                      open(server.id, event.currentTarget);
                  }}
                  onDoubleClick={(event) =>
                    open(server.id, event.currentTarget)
                  }
                >
                  <Image
                    className={styles.machine}
                    src={towerIcon}
                    width={48}
                    height={48}
                    unoptimized
                    draggable={false}
                    alt=""
                  />
                  <span className={styles.nodeLabel}>
                    <strong>{server.label}</strong>
                    {list && (
                      <span id={`network-summary-${server.id}`}>
                        {server.summary}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.statusbar} role="status">
        <span className={styles.status} aria-hidden="true" />
        {selectedServer
          ? `${selectedServer.label} · ${selectedServer.summary}`
          : `${servers.length} simulated servers · see Server list for descriptions`}
      </div>
    </div>
  );
}
