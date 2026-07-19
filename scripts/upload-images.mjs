#!/usr/bin/env node
// Uploads local image files to listmonk's media library (S3/MinIO/R2-backed,
// see docker-compose.yml + .env.example) and prints back the public URL +
// intrinsic dimensions for each, as JSON. One upload, one URL, reused in both
// the MDX briefing and the listmonk email campaign — see
// content/briefings/ for where the resulting <Image> tags belong.
//
// Usage: node scripts/upload-images.mjs <file1> [file2] [...]

import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename } from "node:path";

function loadEnvFile(path, target) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match || line.trim().startsWith("#")) continue;
    let value = match[2] ?? "";
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    target[match[1]] = value;
  }
}

const env = {};
loadEnvFile(".env", env);
loadEnvFile(".env.local", env);

const listmonkUrl = env.LISTMONK_URL;
const apiUser = env.LISTMONK_API_USER;
const apiKey = env.LISTMONK_API_KEY;

if (!listmonkUrl || !apiUser || !apiKey) {
  console.error(
    "Missing LISTMONK_URL / LISTMONK_API_USER / LISTMONK_API_KEY in .env or .env.local.",
  );
  process.exit(1);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/upload-images.mjs <file1> [file2] [...]");
  process.exit(1);
}

function pixelSize(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], {
    encoding: "utf8",
  });
  const width = Number(out.match(/pixelWidth: (\d+)/)?.[1]);
  const height = Number(out.match(/pixelHeight: (\d+)/)?.[1]);
  if (!width || !height) {
    throw new Error(`Could not read dimensions for ${file} (is it an image?)`);
  }
  return { width, height };
}

async function uploadOne(file) {
  if (!existsSync(file)) {
    throw new Error(`File not found: ${file}`);
  }
  const { width, height } = pixelSize(file);

  const auth = "Basic " + Buffer.from(`${apiUser}:${apiKey}`).toString("base64");
  const form = new FormData();
  form.append("file", new Blob([readFileSync(file)]), basename(file));

  const res = await fetch(`${listmonkUrl}/api/media`, {
    method: "POST",
    headers: { Authorization: auth },
    body: form,
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const reason = body?.message ?? res.statusText;
    throw new Error(
      `Upload failed for ${file}: ${res.status} ${reason} (check the nextjs-service ` +
        `listmonk role has the media:manage permission)`,
    );
  }

  return { file, url: body.data.uri, width, height };
}

const results = [];
for (const file of files) {
  results.push(await uploadOne(file));
}

console.log(JSON.stringify(results, null, 2));
