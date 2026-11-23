import assert from "node:assert/strict";
import { copyFile, mkdtemp, rm, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import { chromium, devices } from "playwright";

let directory;
let browser;

before(async () => {
  directory = await mkdtemp(join(tmpdir(), "giovanni-rnd-"));
  await copyFile(
    new URL("index.html", import.meta.url),
    join(directory, "index.html"),
  );
  await build({
    entryPoints: [fileURLToPath(new URL("windows.jsx", import.meta.url))],
    bundle: true,
    outfile: join(directory, "bundle.js"),
  });
  browser = await chromium.launch({
    channel: process.env.PROTOTYPE_BROWSER || undefined,
  });
  console.log(`Chromium ${browser.version()}`);
});

after(async () => {
  await browser?.close();
  if (directory) {
    await rm(join(directory, "index.html"), { force: true });
    await rm(join(directory, "bundle.js"), { force: true });
    await rmdir(directory);
  }
});

async function openFixture(t, options) {
  const context = await browser.newContext(options);
  t.after(() => context.close());
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  t.after(() => assert.deepEqual(errors, []));
  await page.goto(pathToFileURL(join(directory, "index.html")).href);
  await page.getByRole("region", { name: "Alpha" }).waitFor();
  return page;
}

async function gesture(page, x, y, dx, dy, touch = false) {
  if (!touch) {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + dx, y + dy, { steps: 10 });
    await page.mouse.up();
    return;
  }

  const session = await page.context().newCDPSession(page);
  try {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    for (let step = 1; step <= 10; step++) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x + (dx * step) / 10, y: y + (dy * step) / 10 }],
      });
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  } finally {
    await session.detach();
  }
}

function stack(window) {
  return window.evaluate((element) => getComputedStyle(element).zIndex);
}

test("mouse drag and resize respect the workspace edge", async (t) => {
  const page = await openFixture(t);
  const alpha = page.getByRole("region", { name: "Alpha" });
  const start = await alpha.boundingBox();
  await gesture(page, start.x + 20, start.y + 15, 55, 35);
  const moved = await alpha.boundingBox();
  assert.equal(moved.x - start.x, 55);
  assert.equal(moved.y - start.y, 35);
  await gesture(
    page,
    moved.x + moved.width - 3,
    moved.y + moved.height - 3,
    45,
    30,
  );
  const resized = await alpha.boundingBox();
  assert.equal(resized.width - moved.width, 45);
  assert.equal(resized.height - moved.height, 30);
  await gesture(page, resized.x + 20, resized.y + 15, -110, -85);
  const bounded = await alpha.boundingBox();
  const stage = await page.getByTestId("stage").boundingBox();
  assert.equal(bounded.x, stage.x);
  assert.equal(bounded.y, stage.y);
  await gesture(
    page,
    bounded.x + bounded.width - 3,
    bounded.y + bounded.height - 3,
    30,
    350,
  );
  const clamped = await alpha.boundingBox();
  assert.ok(clamped.y + clamped.height <= stage.y + stage.height + 1);
});

test("mouse activation and keyboard focus raise overlapping windows", async (t) => {
  const page = await openFixture(t);
  const alpha = page.getByRole("region", { name: "Alpha" });
  const beta = page.getByRole("region", { name: "Beta" });
  assert.equal(await stack(beta), "2");
  await alpha.locator(".title").click();
  assert.equal(await stack(alpha), "2");
  assert.equal(await stack(beta), "1");
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Alpha content",
  );
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Beta content",
  );
  assert.equal(await stack(beta), "2");
  const before = await beta.boundingBox();
  await page.keyboard.press("ArrowRight");
  assert.deepEqual(await beta.boundingBox(), before);
});

test("emulated mobile touch activates, drags, resizes and scrolls content", async (t) => {
  const page = await openFixture(t, {
    ...devices["Pixel 7"],
    viewport: { width: 320, height: 700 },
  });
  const alpha = page.getByRole("region", { name: "Alpha" });
  const body = alpha.locator(".body");
  await alpha.getByRole("button").tap();
  assert.equal(await stack(alpha), "2");
  const before = await alpha.boundingBox();
  await gesture(page, before.x + 25, before.y + 14, 28, 22, true);
  const moved = await alpha.boundingBox();
  assert.equal(moved.x - before.x, 28);
  assert.equal(moved.y - before.y, 22);
  await gesture(
    page,
    moved.x + moved.width - 5,
    moved.y + moved.height - 5,
    42,
    22,
    true,
  );
  const resized = await alpha.boundingBox();
  assert.equal(resized.width - moved.width, 42);
  assert.equal(resized.height - moved.height, 22);
  const content = await body.boundingBox();
  await gesture(page, content.x + 30, content.y + 95, 0, -72, true);
  await page.waitForFunction(
    () => document.querySelector('[aria-label="Alpha"] .body').scrollTop > 0,
  );
  assert.deepEqual(await alpha.boundingBox(), resized);
});
