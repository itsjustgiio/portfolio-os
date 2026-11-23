import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";

const output = new URL("../out/", import.meta.url);

test("exports a readable homepage without client JavaScript", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");
  const document = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  assert.match(document, /<html lang="en">/);
  assert.match(document, /<title>Giovanni OS<\/title>/);
  assert.match(document, /<main><h1>Giovanni OS<\/h1>/);
  assert.match(document, /An interactive portfolio in development\./);
  assert.doesNotMatch(html, /\b(?:src|href)="(?:https?:)?\/\//i);
});

test("exports a 404 and ships no server entry point", async () => {
  const html = await readFile(new URL("404.html", output), "utf8");
  const entries = await readdir(output);

  assert.match(html, /This page could not be found/);
  assert.ok(!entries.includes("server") && !entries.includes("api"));
});
