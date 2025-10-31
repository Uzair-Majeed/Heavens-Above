// scripts/generateDocs.js
import fs from "fs";
import path from "path";

const SRC_DIR = "./src";
const OUTPUT_DIR = "./docs/build";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.html");

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function escapeHTML(str) {
  return str.replace(/[&<>]/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;"
  }[c]));
}

function extractFunctions(content) {
  const functions = [];

  // Match standard and arrow functions
  const regex = /(?:\/\*\*([\s\S]*?)\*\/)?\s*(?:function|const|let|var)\s+([\w$]+)\s*=?\s*(?:\(([^)]*)\)|function\s*\(([^)]*)\))/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const [, rawComment, name, params1, params2] = match;
    const params = (params1 || params2 || "").trim();
    const comment = rawComment
      ? rawComment.replace(/\n\s*\*\s*/g, "\n").trim()
      : "No description provided.";

    functions.push({ name, params, comment });
  }

  return functions;
}

function generateDocForFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath);
  const functions = extractFunctions(content);

  let html = `<section><h2>${fileName}</h2>`;
  if (functions.length === 0) {
    html += `<p><em>No functions found.</em></p>`;
  } else {
    html += "<ul>";
    for (const f of functions) {
      html += `
        <li>
          <h3>${f.name}(${f.params})</h3>
          <pre>${escapeHTML(f.comment)}</pre>
        </li>`;
    }
    html += "</ul>";
  }

  html += `<details><summary>View Source</summary><pre><code>${escapeHTML(content)}</code></pre></details></section>`;
  return html;
}

let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Heavens Above — Auto Documentation</title>
  <style>
    body { font-family: Arial, sans-serif; background: #fafafa; color: #333; padding: 20px; line-height: 1.5; }
    h1 { color: #2c3e50; }
    h2 { color: #16a085; margin-top: 40px; border-bottom: 2px solid #eee; padding-bottom: 5px; }
    h3 { color: #34495e; margin-top: 20px; }
    pre { background: #f7f7f7; padding: 10px; border-radius: 8px; overflow-x: auto; font-size: 0.9em; }
    ul { list-style-type: none; padding: 0; }
    li { margin-bottom: 15px; }
    summary { cursor: pointer; color: #2980b9; }
  </style>
</head>
<body>
  <h1>Heavens Above — Function Reference</h1>
  <p>Automatically generated documentation from source files.</p>
`;

const files = [
  ...fs.readdirSync(SRC_DIR).filter(f => f.endsWith(".js")).map(f => path.join(SRC_DIR, f)),
  ...fs.readdirSync(".").filter(f => f.endsWith(".js")).map(f => path.join(".", f))
];

for (const file of files) {
  html += generateDocForFile(file);
}

html += `
</body>
</html>
`;

fs.writeFileSync(OUTPUT_FILE, html, "utf-8");
console.log(`✅ Documentation generated at ${OUTPUT_FILE}`);
