import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getApp,
  desktopShortcuts,
  operatingSystems,
} from "../src/desktop/registry.ts";
import {
  activeWindow,
  clampBounds,
  desktopReducer,
  initialDesktop,
} from "../src/desktop/window-manager.ts";
import { servers } from "../src/portfolio/content.ts";

const area = { width: 1024, height: 600 };
const start = desktopReducer(initialDesktop, { type: "area", area });
const step = (state, type, id) => desktopReducer(state, { type, id });

test("registry exposes all approved shortcuts and rejects unknown keys", () => {
  for (const id of [
    ...desktopShortcuts,
    ...servers.map(({ id }) => id),
    "welcome",
  ]) {
    assert.equal(getApp(id).id, id);
    assert.equal(getApp(id).mobile, "panel");
  }
  assert.equal(
    new Set(servers.map(({ id }) => getApp(id).icon)).size,
    servers.length,
  );
  for (const id of ["__proto__", "constructor", "missing"])
    assert.equal(getApp(id), undefined);
  assert.deepEqual(
    operatingSystems.filter(({ available }) => available).map(({ id }) => id),
    ["xp"],
  );
  assert.equal(step(start, "open", "missing"), start);
  assert.equal(desktopReducer(start, { type: "switchOS", os: "kali" }), start);
});

test("one instance per app, with bounded stacking and taskbar restoration", () => {
  let state = step(step(start, "open", "welcome"), "open", "network");
  for (let i = 0; i < 80; i++) {
    state = step(state, "open", i % 2 ? "network" : "welcome");
    assert.equal(state.windows.length, 2);
  }
  assert.equal(activeWindow(state).appId, "network");
  state = step(state, "minimize", "network");
  assert.equal(activeWindow(state).appId, "welcome");
  state = step(state, "activate", "network");
  assert.equal(activeWindow(state).appId, "network");
  state = step(state, "close", "network");
  assert.equal(activeWindow(state).appId, "welcome");
});

test("geometry is clamped and preserved through maximization and viewport changes", () => {
  let state = step(start, "open", "welcome");
  const initial = activeWindow(state).bounds;
  assert.deepEqual(clampBounds(initial, area), initial);
  state = desktopReducer(state, {
    type: "move",
    id: "welcome",
    bounds: { ...initial, x: -100, y: 5000 },
  });
  const moved = activeWindow(state).bounds;
  assert.equal(moved.x, 0);
  assert.equal(moved.y + moved.height, area.height);
  state = step(state, "toggleMaximize", "welcome");
  assert.equal(activeWindow(state).mode, "maximized");
  assert.equal(
    desktopReducer(state, { type: "adjust", id: "welcome", delta: { x: 20 } }),
    state,
  );
  state = desktopReducer(state, {
    type: "area",
    area: { width: 300, height: 240 },
  });
  state = step(state, "toggleMaximize", "welcome");
  assert.deepEqual(activeWindow(state).bounds, moved);
  assert.deepEqual(clampBounds(moved, state.area), {
    x: 0,
    y: 0,
    width: 300,
    height: 240,
  });
  state = desktopReducer(state, { type: "area", area });
  state = desktopReducer(state, {
    type: "adjust",
    id: "welcome",
    delta: { width: -500 },
  });
  assert.equal(activeWindow(state).bounds.width, 240);
});
