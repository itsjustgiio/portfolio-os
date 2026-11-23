import { aiProjects } from "../src/portfolio/ai-projects.ts";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import {
  publicProfiles,
  resumePdf,
  servers,
} from "../src/portfolio/content.ts";

const output = new URL("../out/", import.meta.url);
const readExport = (path) => readFile(new URL(path, output), "utf8");

test("exports a homepage with ordinary navigation and no external resources", async () => {
  const html = await readExport("index.html");
  const document = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.match(document, /<html lang="en">/);
  assert.match(document, /<title>Giovanni OS<\/title>/);
  assert.match(document, /<h1[^>]*>Giovanni OS<\/h1>/);
  assert.match(document, /href="\/projects\/">Portfolio<\/a>/);
  let resources = document;
  for (const { href } of publicProfiles) {
    const outbound = `<a href="${href}" target="_blank" rel="noopener noreferrer"`;
    assert.ok(document.includes(outbound));
    resources = resources.replace(outbound, "<a");
  }
  assert.doesNotMatch(resources, /\b(?:src|href)="(?:https?:)?\/\//i);
});

test("exports ordinary reading pages and all five simulated categories", async () => {
  const projects = await readExport("projects/index.html");
  for (const { id, title } of servers) {
    assert.ok(projects.includes(`href="/projects/${id}/"`));
    const html = await readExport(`projects/${id}/index.html`);
    assert.ok(html.includes(`<h1>${title}</h1>`));
    let resources = html;
    if (id === "ai-projects") {
      for (const project of aiProjects) {
        assert.ok(html.includes(project.folder));
        for (const { href } of project.links ?? []) {
          const escaped = href.replaceAll("&", "&amp;");
          const outbound = `href="${escaped}" target="_blank" rel="noopener noreferrer"`;
          assert.ok(html.includes(outbound));
          resources = resources.replace(outbound, "");
        }
        for (const { src } of project.images ?? []) {
          const image = await readFile(new URL(src.slice(1), output));
          assert.equal(image.subarray(8, 12).toString(), "WEBP");
        }
      }
    }
    assert.doesNotMatch(resources, /\b(?:src|href)="(?:https?:)?\/\//i);
  }
  assert.match(
    await readExport("about/index.html"),
    /Giovanni Carrion is a Computer Science student/,
  );
  assert.match(await readExport("resume/index.html"), /<h1>Resume<\/h1>/);
  assert.match(await readExport("contact/index.html"), /<h1>Contact<\/h1>/);
});

test("exports a 404 and ships no server entry point", async () => {
  assert.match(await readExport("404.html"), /This page could not be found/);
  const entries = await readdir(output);
  assert.ok(
    !entries.includes("server") &&
      !entries.includes("api") &&
      !entries.includes("prototypes"),
  );
});

test("exports the public résumé PDF and safe shortcuts on static contact page", async () => {
  const resume = await readExport("resume/index.html");
  assert.ok(
    resume.includes(
      `data="${resumePdf}#page=1&amp;view=Fit&amp;navpanes=0" type="application/pdf"`,
    ),
  );
  assert.ok(resume.includes("download="));
  const pdf = await readFile(new URL(resumePdf.slice(1), output));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  const contact = await readExport("contact/index.html");
  for (const { href } of publicProfiles) {
    assert.ok(
      contact.includes(
        `href="${href}" target="_blank" rel="noopener noreferrer"`,
      ),
    );
  }
});
