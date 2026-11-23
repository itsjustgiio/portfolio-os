"use client";
import Link from "next/link";

import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { Rnd } from "react-rnd";
import { publicProfiles, readingLinks, servers } from "@/portfolio/content";
import { AppContent } from "./app-content";
import { Icon } from "./icon";
import {
  desktopShortcuts,
  getApp,
  operatingSystems,
  type AppId,
} from "./registry";
import {
  activeWindow,
  clampBounds,
  desktopReducer,
  initialDesktop,
  type Bounds,
} from "./window-manager";
import styles from "./luna.module.css";

const welcomeKey = "giovanni-os-welcome-v1";
type Menu = "start" | "os";
type FocusTarget =
  { app: AppId } | { element: HTMLElement | null; preferElement?: boolean };

const directions: Record<string, { x: number; y: number }> = {
  ArrowLeft: { x: -16, y: 0 },
  ArrowRight: { x: 16, y: 0 },
  ArrowUp: { x: 0, y: -16 },
  ArrowDown: { x: 0, y: 16 },
};

function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    const update = () => setTime(format.format(new Date()));
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <time
      className={styles.clock}
      aria-label={time ? `Local time ${time}` : "Local time"}
    >
      {time}
    </time>
  );
}

export function Desktop() {
  const [state, dispatch] = useReducer(desktopReducer, initialDesktop);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [selected, setSelected] = useState<AppId | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const start = useRef<HTMLButtonElement>(null);
  const selector = useRef<HTMLButtonElement>(null);
  const menuContent = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const titleRefs = useRef(new Map<AppId, HTMLButtonElement>());
  const taskRefs = useRef(new Map<AppId, HTMLButtonElement>());
  const openers = useRef(new Map<AppId, HTMLElement>());
  const focus = useRef<FocusTarget | null>(null);
  const mobile = state.area.width > 0 && state.area.width <= 640;
  const active = activeWindow(state)?.appId;
  const windows = [...state.windows].sort((a, b) =>
    a.appId.localeCompare(b.appId),
  );

  useEffect(() => {
    const workspace = stage.current;
    if (!workspace) return;
    const observer = new ResizeObserver(() => {
      const { clientWidth: width, clientHeight: height } = workspace;
      dispatch({ type: "area", area: { width, height } });
      if (initialized.current || !width || !height) return;
      initialized.current = true;

      let seen = false;
      try {
        seen = window.localStorage.getItem(welcomeKey) === "seen";
        if (!seen) window.localStorage.setItem(welcomeKey, "seen");
      } catch {
        // The first-visit window is still available when storage is blocked.
      }
      if (!seen) dispatch({ type: "open", id: "welcome" });
    });
    observer.observe(workspace);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = focus.current;
    if (!target) return;
    focus.current = null;
    const activeTitle = active ? titleRefs.current.get(active) : undefined;
    const element =
      "app" in target
        ? titleRefs.current.get(target.app)
        : target.preferElement && target.element?.isConnected
          ? target.element
          : (activeTitle ?? target.element);
    if (element?.isConnected && element.getClientRects().length)
      element.focus();
    else if (activeTitle?.getClientRects().length) activeTitle.focus();
    else start.current?.focus();
  }, [state, active]);

  useEffect(() => {
    if (menu)
      menuContent.current
        ?.querySelector<HTMLElement>("button:not([disabled]), a")
        ?.focus();
  }, [menu]);

  function open(id: AppId, source: HTMLElement) {
    const current = state.windows.find((item) => item.appId === id);
    if (!current)
      openers.current.set(
        id,
        menu === "start" ? (start.current ?? source) : source,
      );
    focus.current = { app: id };
    setMenu(null);
    dispatch({ type: "open", id });
  }

  function close(id: AppId) {
    focus.current = {
      element:
        openers.current.get(id) ?? taskRefs.current.get(id) ?? start.current,
      preferElement: true,
    };
    openers.current.delete(id);
    dispatch({ type: "close", id });
  }

  function minimize(id: AppId) {
    focus.current = {
      element: taskRefs.current.get(id) ?? start.current,
      preferElement: true,
    };
    dispatch({ type: "minimize", id });
  }

  function dismissMenu() {
    (menu === "os" ? selector : start).current?.focus();
    setMenu(null);
  }

  function handleMenuKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      dismissMenu();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const elements = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a",
      ),
    ];
    const index = elements.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? elements.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + elements.length) %
            elements.length;
    event.preventDefault();
    elements[next]?.focus();
  }

  function clickShortcut(event: MouseEvent<HTMLButtonElement>, id: AppId) {
    const pointer = event.nativeEvent as PointerEvent;
    if (event.detail === 0 || mobile || pointer.pointerType === "touch")
      open(id, event.currentTarget);
    else setSelected(id);
  }

  return (
    <main
      className={styles.desktop}
      onKeyDown={(event) => {
        if (menu && event.key === "Escape") dismissMenu();
      }}
    >
      <h1 className={styles.srOnly}>Giovanni OS</h1>
      <div
        ref={stage}
        className={styles.stage}
        onPointerDown={() => {
          setMenu(null);
          setSelected(null);
        }}
      >
        <div aria-hidden="true" className={styles.wallpaper} />
        <nav aria-label="Desktop shortcuts" className={styles.shortcuts}>
          {desktopShortcuts.map((id) => {
            const app = getApp(id)!;
            return (
              <button
                key={id}
                title={app.title}
                aria-pressed={selected === id}
                className={styles.shortcut}
                onClick={(event) => clickShortcut(event, id)}
                onDoubleClick={(event) => open(id, event.currentTarget)}
              >
                <Icon name={app.icon} size="large" />
                <span>{app.title}</span>
              </button>
            );
          })}
        </nav>

        <nav aria-label="Profile shortcuts" className={styles.profiles}>
          {publicProfiles.map(({ title, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shortcut}
            >
              <span
                aria-hidden="true"
                className={styles.profileIcon}
                data-profile={title}
              >
                {title === "GitHub" ? "GH" : "in"}
              </span>
              <span>{title}</span>
            </a>
          ))}
        </nav>

        {windows.map((item) => {
          const id = item.appId;
          const app = getApp(id)!;
          const maximized = item.mode === "maximized";
          const fixed = mobile || maximized;
          const hidden = item.minimized || (mobile && id !== active);
          const bounds: Bounds = fixed
            ? { x: 0, y: 0, ...state.area }
            : clampBounds(item.bounds, state.area);
          return (
            <Rnd
              key={id}
              className={styles.window}
              data-active={id === active}
              bounds="parent"
              dragHandleClassName={styles.caption}
              cancel="a"
              disableDragging={fixed}
              enableResizing={!fixed}
              minWidth={Math.min(240, state.area.width)}
              minHeight={Math.min(160, state.area.height)}
              position={{ x: bounds.x, y: bounds.y }}
              size={{ width: bounds.width, height: bounds.height }}
              style={{
                zIndex: state.windows.indexOf(item) + 2,
                display: hidden ? "none" : undefined,
              }}
              onMouseDown={() => dispatch({ type: "activate", id })}
              onFocus={() => dispatch({ type: "activate", id })}
              onDragStop={(_, data) =>
                dispatch({
                  type: "move",
                  id,
                  bounds: { ...bounds, x: data.x, y: data.y },
                })
              }
              onResizeStop={(_, __, element, ___, position) =>
                dispatch({
                  type: "resize",
                  id,
                  bounds: {
                    ...position,
                    width: element.offsetWidth,
                    height: element.offsetHeight,
                  },
                })
              }
            >
              <section
                role="region"
                aria-label={app.title}
                className={styles.windowInner}
                inert={hidden}
              >
                <header className={styles.titlebar}>
                  <div
                    className={styles.caption}
                    onDoubleClick={() => {
                      if (!mobile) dispatch({ type: "toggleMaximize", id });
                    }}
                  >
                    <Icon name={app.icon} size="small" />
                    <button
                      type="button"
                      className={styles.windowTitle}
                      ref={(element) => {
                        if (element) titleRefs.current.set(id, element);
                        else titleRefs.current.delete(id);
                      }}
                      aria-label={app.title + " window title"}
                      aria-describedby={!fixed ? "window-shortcuts" : undefined}
                      onKeyDown={(event) => {
                        const direction = directions[event.key];
                        if (fixed || !direction) return;
                        event.preventDefault();
                        dispatch({
                          type: "adjust",
                          id,
                          delta: event.shiftKey
                            ? { width: direction.x, height: direction.y }
                            : direction,
                        });
                      }}
                    >
                      {app.title}
                    </button>
                  </div>
                  <div className={styles.controls}>
                    <button
                      aria-label={`Minimize ${app.title}`}
                      onClick={() => minimize(id)}
                    >
                      −
                    </button>
                    {!mobile && (
                      <button
                        aria-label={`${maximized ? "Restore" : "Maximize"} ${app.title}`}
                        onClick={() => dispatch({ type: "toggleMaximize", id })}
                      >
                        {maximized ? "❐" : "□"}
                      </button>
                    )}
                    <button
                      className={styles.close}
                      aria-label={`Close ${app.title}`}
                      onClick={() => close(id)}
                    >
                      ×
                    </button>
                  </div>
                </header>
                <div className={styles.windowBody}>
                  <AppContent id={id} open={open} />
                </div>
              </section>
            </Rnd>
          );
        })}
      </div>

      <p id="window-shortcuts" className={styles.srOnly}>
        Arrow keys move this window. Shift with arrow keys resizes it.
      </p>

      <footer className={styles.taskbar}>
        <button
          ref={start}
          className={styles.start}
          aria-expanded={menu === "start"}
          aria-controls={menu === "start" ? "start-panel" : undefined}
          onClick={() => setMenu(menu === "start" ? null : "start")}
        >
          <span aria-hidden="true" className={styles.flag}>
            <i />
            <i />
            <i />
            <i />
          </span>
          Start
        </button>
        <div className={styles.tasks} aria-label="Open applications">
          {windows.map(({ appId, minimized }) => {
            const app = getApp(appId)!;
            return (
              <button
                key={appId}
                ref={(element) => {
                  if (element) taskRefs.current.set(appId, element);
                  else taskRefs.current.delete(appId);
                }}
                title={app.title}
                aria-label={app.title + " taskbar button"}
                aria-pressed={appId === active}
                onClick={(event) =>
                  minimized || appId !== active
                    ? open(appId, event.currentTarget)
                    : minimize(appId)
                }
              >
                <Icon name={app.icon} size="small" />
                <span>{app.title}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.tray}>
          <Link prefetch={false} href="/projects/">
            Portfolio
          </Link>
          <button
            ref={selector}
            aria-label="Operating system selector"
            aria-expanded={menu === "os"}
            aria-controls={menu === "os" ? "os-panel" : undefined}
            onClick={() => setMenu(menu === "os" ? null : "os")}
          >
            OS
          </button>
          <Clock />
        </div>
      </footer>

      {menu === "start" && (
        <div
          id="start-panel"
          ref={menuContent}
          className={styles.startMenu}
          aria-label="Start menu"
          role="region"
          onKeyDown={handleMenuKeys}
        >
          <div className={styles.startHeader}>
            <Icon name="welcome" />
            Giovanni Carrion
          </div>
          <div className={styles.startGrid}>
            <div>
              {(["welcome", ...desktopShortcuts] as const).map((id) => {
                const app = getApp(id)!;
                return (
                  <button
                    key={id}
                    onClick={(event) => open(id, event.currentTarget)}
                  >
                    <Icon name={app.icon} size="small" />
                    {app.title}
                  </button>
                );
              })}
            </div>
            <nav aria-label="Portfolio sections">
              {servers.map(({ id, title }) => (
                <button
                  key={id}
                  onClick={(event) => open(id, event.currentTarget)}
                >
                  <Icon name={getApp(id)!.icon} size="small" />
                  {title}
                </button>
              ))}
              {readingLinks.map(({ title, href }) => (
                <Link prefetch={false} key={href} href={href}>
                  {title}
                </Link>
              ))}
              {publicProfiles.map(({ title, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
      {menu === "os" && (
        <div
          id="os-panel"
          ref={menuContent}
          className={styles.osMenu}
          aria-label="Operating systems"
          role="region"
          onKeyDown={handleMenuKeys}
        >
          {operatingSystems.map(({ id, title, available }) => (
            <button
              key={id}
              disabled={!available}
              aria-current={id === state.os ? "true" : undefined}
              onClick={() => {
                dispatch({ type: "switchOS", os: id });
                dismissMenu();
              }}
            >
              {title}
              {id === state.os ? " (current)" : " (coming soon)"}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
