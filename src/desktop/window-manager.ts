import { getApp, type AppId, type OperatingSystem } from "./registry.ts";

export type Area = { width: number; height: number };
export type Bounds = Area & { x: number; y: number };
export type WindowState = {
  appId: AppId;
  bounds: Bounds;
  mode: "normal" | "maximized";
  minimized: boolean;
};

export type DesktopState = {
  os: OperatingSystem;
  area: Area;
  windows: WindowState[];
};

export const initialDesktop: DesktopState = {
  os: "xp",
  area: { width: 0, height: 0 },
  windows: [],
};

export type DesktopAction =
  | { type: "area"; area: Area }
  | {
      type: "open" | "activate" | "minimize" | "toggleMaximize" | "close";
      id: AppId;
    }
  | { type: "move" | "resize"; id: AppId; bounds: Bounds }
  | { type: "adjust"; id: AppId; delta: Partial<Bounds> }
  | { type: "switchOS"; os: OperatingSystem };

export function activeWindow(state: DesktopState) {
  return state.windows.findLast((window) => !window.minimized);
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function clampBounds(bounds: Bounds, area: Area): Bounds {
  const width = clamp(bounds.width, Math.min(240, area.width), area.width);
  const height = clamp(bounds.height, Math.min(160, area.height), area.height);
  return {
    x: clamp(bounds.x, 0, area.width - width),
    y: clamp(bounds.y, 0, area.height - height),
    width,
    height,
  };
}

function raise(state: DesktopState, window: WindowState): DesktopState {
  return {
    ...state,
    windows: [
      ...state.windows.filter(({ appId }) => appId !== window.appId),
      { ...window, minimized: false },
    ],
  };
}

export function desktopReducer(
  state: DesktopState,
  action: DesktopAction,
): DesktopState {
  if (action.type === "area") {
    if (
      state.area.width === action.area.width &&
      state.area.height === action.area.height
    )
      return state;

    // Keep the preferred bounds through mobile and viewport changes. The view
    // clamps them to the current workspace, while a new gesture commits its bounds.
    return { ...state, area: action.area };
  }
  if (action.type === "switchOS") {
    return action.os === "xp" && state.os !== "xp"
      ? { ...state, os: "xp" }
      : state;
  }

  const window = state.windows.find(({ appId }) => appId === action.id);
  if (action.type === "open") {
    if (window) return raise(state, window);
    const app = getApp(action.id);
    if (!app) return state;

    const offset = (state.windows.length % 6) * 23;
    const bounds = {
      x: Math.max(0, Math.round((state.area.width - app.width) / 2) + offset),
      y: Math.max(
        0,
        Math.round((state.area.height - app.height) * 0.36) + offset,
      ),
      width: app.width,
      height: app.height,
    };
    return raise(state, {
      appId: app.id,
      bounds,
      mode: "normal",
      minimized: false,
    });
  }

  if (!window) return state;
  switch (action.type) {
    case "activate":
      return window === activeWindow(state) ? state : raise(state, window);
    case "minimize":
      return {
        ...state,
        windows: state.windows.map((item) =>
          item === window ? { ...item, minimized: true } : item,
        ),
      };
    case "toggleMaximize":
      return raise(state, {
        ...window,
        mode: window.mode === "normal" ? "maximized" : "normal",
      });
    case "close":
      return {
        ...state,
        windows: state.windows.filter((item) => item !== window),
      };
    case "move":
    case "resize":
    case "adjust": {
      if (window.mode === "maximized" || window.minimized) return state;
      const current = clampBounds(window.bounds, state.area);
      const next =
        action.type === "adjust"
          ? {
              x: current.x + (action.delta.x ?? 0),
              y: current.y + (action.delta.y ?? 0),
              width: current.width + (action.delta.width ?? 0),
              height: current.height + (action.delta.height ?? 0),
            }
          : action.bounds;
      const bounds = clampBounds(next, state.area);
      return {
        ...state,
        windows: state.windows.map((item) =>
          item === window ? { ...item, bounds } : item,
        ),
      };
    }
  }
  return state;
}
