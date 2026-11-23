import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { after, before, test } from "node:test";
import { chromium, devices } from "playwright";

const output = resolve("out");
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};
let browser, origin, server;

before(async () => {
  server = createServer(async (request, response) => {
    try {
      const { pathname } = new URL(request.url, "http://127.0.0.1");
      const file = resolve(
        output,
        "." + pathname + (pathname.endsWith("/") ? "index.html" : ""),
      );
      if (!file.startsWith(output + sep)) throw new Error("Outside export");
      const body = await readFile(file);
      response
        .writeHead(200, {
          "Content-Type": mime[extname(file)] ?? "application/octet-stream",
        })
        .end(body);
    } catch {
      response
        .writeHead(404, { "Content-Type": "text/html" })
        .end(await readFile(resolve(output, "404.html")));
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  origin = "http://127.0.0.1:" + server.address().port;
  browser = await chromium.launch({
    channel: process.env.DESKTOP_BROWSER || undefined,
  });
  console.log("Chromium " + browser.version());
});

after(async () => {
  await browser?.close();
  if (server) await new Promise((done) => server.close(done));
});

async function fixture(t, options) {
  const context = await browser.newContext({
    locale: "en-US",
    timezoneId: "America/New_York",
    ...options,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(7000);
  if (process.env.DESKTOP_SCREENSHOTS === "1")
    await page.clock.setFixedTime(new Date("2026-11-23T16:30:00Z"));
  const errors = [];
  const external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (new URL(url).origin === origin) return route.continue();
    external.push(url);
    return route.abort();
  });
  t.after(async () => {
    await context.close();
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
  });
  return page;
}

const region = (page, name) => page.getByRole("region", { name, exact: true });
const button = (scope, name) =>
  scope.getByRole("button", { name, exact: true });
const title = (scope, name) =>
  scope.getByRole("heading", { name, exact: true });
const shortcut = (page, name) =>
  button(page.getByRole("navigation", { name: "Desktop shortcuts" }), name);
const task = (page, name) => button(page, name + " taskbar button");
const close = (page, name) => button(region(page, name), "Close " + name);
const active = (locator) =>
  locator.evaluate((node) => node === document.activeElement);
const phone = { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } };

async function capture(page, name) {
  if (process.env.DESKTOP_SCREENSHOTS !== "1") return;
  await mkdir("docs/screenshots", { recursive: true });
  await page.screenshot({
    path: "docs/screenshots/" + name + ".png",
    animations: "disabled",
    scale: "css",
  });
}

async function drag(page, x, y, dx, dy) {
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 12 });
  await page.mouse.up();
}

async function openNetwork(page, mobile = false) {
  await page.goto(origin);
  if (mobile) {
    await close(page, "Welcome").tap();
    await shortcut(page, "My Network Places").tap();
  } else {
    await close(page, "Welcome").click();
    await shortcut(page, "My Network Places").dblclick();
  }
  const network = region(page, "My Network Places");
  await title(network, "Network Topology").waitFor();
  return network;
}

async function assertNetworkFits(network) {
  const list = network.getByRole("list", {
    name: "Simulated portfolio servers",
  });
  const layout = await list.evaluate((element) => {
    const frame = element.parentElement.getBoundingClientRect();
    const buttons = [...element.querySelectorAll("button")];
    const edges = [...element.querySelectorAll("li > span")];
    const labels = buttons.map((item) => item.getBoundingClientRect());
    return {
      nodesFit: labels.every(
        (box, index) =>
          box.left >= frame.left - 1 &&
          box.right <= frame.right + 1 &&
          box.top >= frame.top &&
          box.bottom <= frame.bottom &&
          buttons[index].scrollWidth <= buttons[index].clientWidth + 1,
      ),
      nodesOverlap: labels.some((first, index) =>
        labels
          .slice(index + 1)
          .some(
            (second) =>
              first.left < second.right &&
              second.left < first.right &&
              first.top < second.bottom &&
              second.top < first.bottom,
          ),
      ),
      lines: edges.map((edge) => parseFloat(getComputedStyle(edge).width)),
    };
  });
  assert.equal(layout.nodesFit, true);
  assert.equal(layout.nodesOverlap, false);
  assert.equal(layout.lines.length, 5);
  assert.ok(layout.lines.every((width) => width > 15));
}

async function verifyImage(page, name) {
  const viewerName = name + " - Picture Viewer";
  const image = region(page, viewerName).getByRole("img");
  await page.waitForFunction(
    (img) => img.complete && img.naturalWidth > 0,
    await image.elementHandle(),
  );
  await close(page, viewerName).click();
}

test("first visit, taskbar lifecycle, desktop shortcuts and keyboard menu focus", async (t) => {
  const page = await fixture(t, { viewport: { width: 1366, height: 768 } });
  await page.goto(origin);
  const welcome = region(page, "Welcome");
  await title(welcome, "Welcome to Giovanni OS").waitFor();
  await page.waitForFunction(
    () => document.querySelector("time").textContent.length > 0,
  );
  assert.match(await welcome.textContent(), /Computer Science student/);
  const wallpaper = await page.request.get(
    origin + "/artwork/green-meadow.webp",
  );
  assert.equal(wallpaper.status(), 200);
  assert.equal(wallpaper.headers()["content-type"], "image/webp");
  const profiles = page.getByRole("navigation", { name: "Profile shortcuts" });
  for (const [name, href] of [
    ["GitHub", "https://github.com/itsjustgiio"],
    ["LinkedIn", "https://www.linkedin.com/in/giovannicarrion/"],
  ]) {
    const link = profiles.getByRole("link", { name, exact: true });
    assert.equal(await link.getAttribute("href"), href);
    assert.equal(await link.getAttribute("rel"), "noopener noreferrer");
    assert.ok((await link.boundingBox()).x > 1200);
  }
  await capture(page, "xp-desktop-1366x768");
  const bounds = await welcome.boundingBox();
  assert.ok(bounds.width / bounds.height >= 1.6);
  await button(welcome, "Explore My Network").click();
  await title(region(page, "My Network Places"), "Network Topology").waitFor();
  await close(page, "My Network Places").click();
  const text = await welcome
    .getByText(/Computer Science student/)
    .boundingBox();
  await drag(page, text.x + 2, text.y + 8, 115, 0);
  assert.match(
    await page.evaluate(() => window.getSelection().toString()),
    /Giovanni/,
  );
  assert.deepEqual(await welcome.boundingBox(), bounds);
  await button(welcome, "Minimize Welcome").click();
  await welcome.waitFor({ state: "hidden" });
  assert.ok(await active(task(page, "Welcome")));
  await task(page, "Welcome").press("Enter");
  await close(page, "Welcome").press("Enter");
  await page.reload();
  await page.waitForFunction(
    () => document.querySelector("time").textContent.length > 0,
  );
  assert.equal(await welcome.count(), 0);

  const start = button(page, "Start");
  const menu = region(page, "Start menu");
  await start.press("Enter");
  await menu.getByRole("link", { name: "Portfolio" }).waitFor();
  await capture(page, "xp-start-menu-1366x768");
  await page.keyboard.press("ArrowDown");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "My Computer",
  );
  await page.keyboard.press("Escape");
  await menu.waitFor({ state: "hidden" });
  assert.ok(await active(start));
  await shortcut(page, "My Computer").click();
  assert.equal(
    await shortcut(page, "My Computer").getAttribute("aria-pressed"),
    "true",
  );
  await shortcut(page, "My Computer").dblclick();
  await title(region(page, "My Computer"), "Portfolio folders").waitFor();
  await close(page, "My Computer").click();
  assert.ok(await active(shortcut(page, "My Computer")));

  for (const app of [
    "My Documents",
    "Resume",
    "Recycle Bin",
    "Cybersecurity",
  ]) {
    await start.click();
    await button(menu, app).click();
    await region(page, app).waitFor();
    await close(page, app).click();
  }
  await button(page, "Operating system selector").click();
  const os = region(page, "Operating systems");
  assert.ok(await button(os, "Windows XP (current)").isEnabled());
  for (const name of ["Kali Linux", "Mac OS X Tiger"])
    assert.ok(await button(os, name + " (coming soon)").isDisabled());
});

test("desktop windows stack, drag, resize, maximize and support keyboard geometry", async (t) => {
  const page = await fixture(t, {
    viewport: { width: 1920, height: 1080 },
    reducedMotion: "reduce",
  });
  await page.goto(origin);
  await region(page, "Welcome").waitFor();
  await shortcut(page, "My Computer").press("Enter");
  const computer = region(page, "My Computer");
  const caption = button(computer, "My Computer window title");
  assert.ok(await active(caption));
  const before = await computer.boundingBox();
  const handle = await caption.boundingBox();
  await drag(page, handle.x + 18, handle.y + 8, 70, 40);
  const moved = await computer.boundingBox();
  assert.ok(Math.abs(moved.x - before.x - 70) <= 1);
  assert.ok(Math.abs(moved.y - before.y - 40) <= 1);
  await drag(
    page,
    moved.x + moved.width - 2,
    moved.y + moved.height - 2,
    46,
    32,
  );
  const resized = await computer.boundingBox();
  assert.ok(
    resized.width > moved.width + 35 && resized.height > moved.height + 20,
  );
  await caption.press("ArrowRight");
  await caption.press("Shift+ArrowDown");
  const adjusted = await computer.boundingBox();
  assert.equal(adjusted.x, resized.x + 16);
  assert.equal(adjusted.height, resized.height + 16);
  await button(computer, "Maximize My Computer").press("Enter");
  const max = await computer.boundingBox();
  assert.ok(max.width > 1900 && max.height > 1000);
  await button(computer, "Restore My Computer").click();
  assert.deepEqual(await computer.boundingBox(), adjusted);
  await task(page, "Welcome").click();
  assert.equal(
    await task(page, "Welcome").getAttribute("aria-pressed"),
    "true",
  );
  await task(page, "My Computer").click();
  assert.equal(
    await task(page, "My Computer").getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(await task(page, "My Computer").count(), 1);
  await page.setViewportSize({ width: 960, height: 540 });
  await page.waitForFunction(
    (node) => {
      const box = node.getBoundingClientRect();
      return box.right <= 960 && box.bottom <= 502;
    },
    await computer.elementHandle(),
  );
});

test("network explains the portfolio and supports selection, double-click, keyboard and list access", async (t) => {
  const page = await fixture(t, { viewport: { width: 1366, height: 768 } });
  const network = await openNetwork(page);
  assert.match(
    await network.textContent(),
    /Each server represents a different part of my life/,
  );
  assert.deepEqual(
    await network.getByRole("list").getByRole("button").allTextContents(),
    ["IT", "Cybersecurity", "AI", "Professional", "Personal"],
  );
  await assertNetworkFits(network);
  const icons = network.locator(
    'img[src="/artwork/topology-server-tower.webp"]',
  );
  assert.equal(await icons.count(), 6);
  await page.waitForFunction(() =>
    [
      ...document.querySelectorAll(
        'img[src="/artwork/topology-server-tower.webp"]',
      ),
    ].every((icon) => icon.complete && icon.naturalWidth >= 64),
  );
  assert.deepEqual(
    await icons.evaluateAll((images) => images.map((image) => image.width)),
    [64, 48, 48, 48, 48, 48],
  );
  await capture(page, "xp-topology-desktop-1366x768");
  const it = button(network, "IT");
  await it.click();
  assert.equal(await it.getAttribute("aria-pressed"), "true");
  assert.equal(await region(page, "IT Infrastructure").count(), 0);
  assert.match(
    await network.getByRole("status").textContent(),
    /IT · Networking/,
  );
  await it.dblclick();
  const folder = region(page, "IT Infrastructure");
  assert.equal(
    await folder
      .getByRole("link", { name: "Open portfolio page" })
      .getAttribute("href"),
    "/projects/it-infrastructure/",
  );
  await close(page, "IT Infrastructure").click();
  assert.ok(await active(it));
  await it.press("ArrowRight");
  const cyber = button(network, "Cybersecurity");
  assert.ok(await active(cyber));
  await cyber.press("Enter");
  await close(page, "Cybersecurity").click();
  const toggle = button(network, "Server list");
  await toggle.press("Space");
  assert.equal(await toggle.getAttribute("aria-pressed"), "true");
  assert.match(await button(network, "AI").textContent(), /applied AI systems/);
  await button(network, "AI").press("Space");
  await title(region(page, "AI Projects"), "AI-LAB-SRV").waitFor();
  await close(page, "AI Projects").click();
  await toggle.click();
  const caption = button(network, "My Network Places window title");
  for (let step = 0; step < 12; step++) await caption.press("Shift+ArrowLeft");
  assert.ok((await network.boundingBox()).width < 550);
  await assertNetworkFits(network);
});

test("mobile selects and opens all five folders with touch", async (t) => {
  const page = await fixture(t, phone);
  const network = await openNetwork(page, true);
  await assertNetworkFits(network);
  await capture(page, "xp-topology-mobile-390x844");
  for (const [label, name] of [
    ["IT", "IT Infrastructure"],
    ["Cybersecurity", "Cybersecurity"],
    ["AI", "AI Projects"],
    ["Professional", "Professional"],
    ["Personal", "Personal"],
  ]) {
    const node = button(network, label);
    await node.tap();
    assert.equal(await node.getAttribute("aria-pressed"), "true");
    await button(network, "Open selected").tap();
    const category = region(page, name);
    await title(category, label === "AI" ? "AI-LAB-SRV" : name).waitFor();
    assert.ok((await category.boundingBox()).width >= 385);
    assert.equal(await network.count(), 0);
    await close(page, name).tap();
    await network.waitFor();
  }
  await page.setViewportSize({ width: 320, height: 640 });
  await page.waitForFunction(
    (node) => node.getBoundingClientRect().width <= 320,
    await network.elementHandle(),
  );
  await assertNetworkFits(network);
  assert.ok(await button(page, "Operating system selector").isVisible());
});

test("My Documents selects files, opens Notepad, and navigates folders", async (t) => {
  const page = await fixture(t, { viewport: { width: 1366, height: 768 } });
  await page.goto(origin);
  await close(page, "Welcome").click();
  await shortcut(page, "My Documents").dblclick();
  const documents = region(page, "My Documents");
  const file = button(documents, "About Me.txt");
  await file.click();
  assert.equal(await file.getAttribute("aria-pressed"), "true");
  const notepad = region(page, "About Me.txt - Notepad");
  assert.equal(await notepad.count(), 0);
  await file.dblclick();
  assert.match(
    await notepad.locator("pre").textContent(),
    /Computer Science student/,
  );
  await close(page, "About Me.txt - Notepad").click();
  assert.ok(await active(file));
  for (const name of ["Projects", "Certifications", "CTF Writeups", "Photos"]) {
    const folder = button(documents, name);
    await folder.press("Enter");
    await title(documents, name).waitFor();
    if (name === "Projects")
      assert.equal(
        await documents
          .getByRole("link", { name: "Cybersecurity" })
          .getAttribute("href"),
        "/projects/cybersecurity/",
      );
    await documents.getByRole("button", { name: /Back/ }).click();
    assert.ok(await active(folder));
  }
});

test("My Documents opens the text file with one tap on mobile", async (t) => {
  const page = await fixture(t, phone);
  await page.goto(origin);
  await close(page, "Welcome").tap();
  await shortcut(page, "My Documents").tap();
  await button(region(page, "My Documents"), "About Me.txt").tap();
  await region(page, "About Me.txt - Notepad").locator("pre").waitFor();
});

test("Start menu exposes public profiles and Resume loads the PDF on open", async (t) => {
  const page = await fixture(t);
  await page.goto(origin);
  await region(page, "Welcome").waitFor();
  await button(page, "Start").click();
  const menu = region(page, "Start menu");
  for (const name of ["GitHub", "LinkedIn"]) {
    const link = menu.getByRole("link", { name, exact: true });
    assert.equal(await link.getAttribute("target"), "_blank");
    assert.equal(await link.getAttribute("rel"), "noopener noreferrer");
  }
  const loaded = page.waitForResponse(origin + "/GiovanniCarrionResume.pdf");
  await button(menu, "Resume").click();
  const viewer = region(page, "Resume").locator(
    'object[type="application/pdf"]',
  );
  assert.equal(
    await viewer.getAttribute("data"),
    "/GiovanniCarrionResume.pdf#page=1&view=Fit&navpanes=0",
  );
  const response = await loaded;
  assert.equal(response.status(), 200);
  assert.equal(response.headers()["content-type"], "application/pdf");
});

for (const mobile of [false, true]) {
  test(`AI Lab Explorer works on ${mobile ? "mobile" : "desktop"}`, async (t) => {
    const page = await fixture(
      t,
      mobile ? phone : { viewport: { width: 1366, height: 768 } },
    );
    const network = await openNetwork(page, mobile);
    if (mobile) {
      await button(network, "AI").tap();
      await button(network, "Open selected").tap();
    } else await button(network, "AI").dblclick();
    const lab = region(page, "AI Projects");
    const contents = lab.getByRole("region", {
      name: "AI Lab folder contents",
    });
    const back = button(lab, "Back");
    const suffix = mobile ? "mobile-390x844" : "desktop-1366x768";
    const entry = (name) => button(contents, name);
    const open = async (name) => {
      if (mobile) await entry(name).tap();
      else await entry(name).dblclick();
    };
    const separator = String.fromCharCode(92);
    const share = ["", "", "GIOVANNI-CORE", "AI-LAB-SRV"].join(separator);
    await title(contents, "AI-LAB-SRV").waitFor();
    await lab.getByText(share, { exact: true }).waitFor();
    assert.equal(await contents.getByRole("button").count(), 5);
    for (const [name, subtitle] of [
      ["FareFit", "Live Website"],
      ["World Merit", "Internship"],
      ["SereneScape", "Project"],
      ["BridgeCoach", "Project"],
      ["OBD-II AI Concept", "Concept"],
    ]) {
      const caption = entry(name).getByText(subtitle, { exact: true });
      assert.ok(await caption.isVisible());
      assert.equal(
        await caption.evaluate((node) => getComputedStyle(node).fontStyle),
        "italic",
      );
    }
    assert.match(await lab.getByRole("status").textContent(), /5 objects/);
    await capture(page, "ai-lab-root-" + suffix);
    if (!mobile) {
      await entry("FareFit").click();
      assert.equal(await entry("FareFit").getAttribute("aria-pressed"), "true");
      assert.match(
        await lab.getByRole("complementary").textContent(),
        /October 2025.*Live \/ Active/s,
      );
      assert.equal(await title(contents, "FareFit").count(), 0);
    }
    await open("FareFit");
    await lab
      .getByText([share, "FareFit"].join(separator), { exact: true })
      .waitFor();
    const website = contents.getByRole("link", {
      name: "Visit Website",
      exact: true,
    });
    assert.equal(
      await website.getAttribute("href"),
      "https://www.farefit.fit/",
    );
    assert.equal(await website.getAttribute("rel"), "noopener noreferrer");
    assert.equal(await website.getAttribute("target"), "_blank");
    if (!mobile) {
      await page.evaluate(() => {
        window.open = (...args) => {
          window.openedShortcut = args;
          return null;
        };
      });
      await website.click();
      assert.equal(await page.evaluate(() => window.openedShortcut), undefined);
      await website.dblclick();
      assert.deepEqual(await page.evaluate(() => window.openedShortcut), [
        "https://www.farefit.fit/",
        "_blank",
        "noopener,noreferrer",
      ]);
    }
    await capture(page, "ai-lab-farefit-" + suffix);
    await open("About.txt");
    const notepad = region(page, "About.txt - Notepad");
    assert.match(
      await notepad.locator("pre").textContent(),
      /FareScore.+300–850/s,
    );
    await capture(page, "ai-lab-farefit-notepad-" + suffix);
    await close(page, "About.txt - Notepad").click();
    assert.ok(await active(entry("About.txt")));
    await open("Screenshots");
    await open("FareFit Dashboard.webp");
    await verifyImage(page, "FareFit Dashboard.webp");
    await back.click();
    await button(lab, "Forward").click();
    await title(contents, "Screenshots").waitFor();
    await back.click();
    await back.click();
    if (!mobile) {
      await entry("World Merit").press("Enter");
      for (const [name, text] of [
        ["About.txt", /AI Agent Systems Intern/],
        ["How the RAG System Works.txt", /conceptual summary/],
        ["My Contributions.txt", /retrieval gaps|flagged those gaps/],
        ["Technical Challenges.txt", /RETRIEVAL GAPS/],
        ["Technologies.txt", /OLLAMA/],
        ["Testing & Evaluation.txt", /HOW FINDINGS WERE USED/],
        ["About World Merit.txt", /152 countries as of November 2026/],
      ]) {
        await entry(name).press("Enter");
        const nameInWindow = name + " - Notepad";
        assert.match(
          await region(page, nameInWindow).locator("pre").textContent(),
          text,
        );
        await close(page, nameInWindow).click();
      }
      assert.equal(
        await contents
          .getByRole("link", { name: "World Merit Website" })
          .getAttribute("href"),
        "https://worldmerit.org/",
      );
      await back.click();

      for (const [folder, names] of [
        ["BridgeCoach", ["BridgeCoach Team 7.webp"]],
        [
          "OBD-II AI Concept",
          [
            "Solution Workflow.webp",
            "Monitoring Agents.webp",
            "Repair Record Retrieval.webp",
          ],
        ],
      ]) {
        await entry(folder).press("Enter");
        await entry("Screenshots").press("Enter");
        assert.deepEqual(
          await contents.getByRole("button").allTextContents(),
          names,
        );
        for (const name of names) {
          await entry(name).press("Enter");
          await verifyImage(page, name);
        }
        await back.click();
        await back.click();
      }
    }
    if (mobile) await entry("SereneScape").tap();
    else await entry("SereneScape").press("Enter");
    await title(contents, "SereneScape").waitFor();
    await capture(page, "ai-lab-serenescape-" + suffix);
    await open("Screenshots");
    await open("SereneScape Dashboard.webp");
    await verifyImage(page, "SereneScape Dashboard.webp");
  });
}

test("reading pages work with JavaScript disabled and invalid paths return 404", async (t) => {
  const page = await fixture(t, { javaScriptEnabled: false });
  await page.goto(origin);
  await page.getByRole("link", { name: "Portfolio", exact: true }).click();
  await page.getByRole("link", { name: "Cybersecurity" }).click();
  await title(page, "Cybersecurity").waitFor();
  await page.getByRole("link", { name: "About", exact: true }).click();
  assert.match(
    await page.locator("main").textContent(),
    /Giovanni Carrion is a Computer Science student/,
  );
  const missing = await page.goto(origin + "/projects/invalid/");
  assert.equal(missing.status(), 404);
  await title(page, "Page not found").waitFor();
});

test("first-visit Welcome still opens if browser storage is blocked", async (t) => {
  const page = await fixture(t);
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Blocked");
      },
    }),
  );
  await page.goto(origin);
  await title(region(page, "Welcome"), "Welcome to Giovanni OS").waitFor();
});
