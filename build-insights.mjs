import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "insights");
const OUTPUT_DIR = path.join(ROOT, "insights");
const MANIFEST_FILE = path.join(OUTPUT_DIR, "index.json");

const SITE = {
  name: "6 Leaf Clover",
  url: "https://www.6leafclover.co.uk",
  email: "matt@6leafclover.co.uk",
  bookingUrl:
    "https://outlook.office.com/bookwithme/user/096431fd04e74d8491d724ad463fd408@6leafclover.co.uk/meetingtype/wNoemyp6DkeDweaqhTh28A2?anonymous&ismsaljsauthenabled&ep=mlink",
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function escapeHtml(text = "") {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: fileContent };
  }

  const raw = match[1];
  const body = match[2];
  const data = {};

  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, body };
}

function markdownToHtml(markdown = "") {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let inList = false;
  let paragraph = [];

  function flushParagraph() {
    if (paragraph.length) {
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      closeList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      closeList();
      html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      closeList();
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      closeList();
      html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  closeList();

  return html.join("\n");
}

function inlineMarkdown(text = "") {
  let output = escapeHtml(text);

  output = output.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*(.+?)\*/g, "<em>$1</em>");
  output = output.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>'
  );

  return output;
}

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function articleTemplate(post) {
  const seoTitle = escapeHtml(post.seoTitle || post.title);
  const description = escapeHtml(post.description || post.summary || "");
  const title = escapeHtml(post.title);
  const summary = escapeHtml(post.summary || "");
  const category = escapeHtml(post.categoryLabel || "");
  const date = escapeHtml(post.formattedDate || "");
  const bodyHtml = post.bodyHtml;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${description}" />
  <title>${seoTitle} | 6 Leaf Clover</title>
  <link rel="stylesheet" href="/assets/style.css" />
</head>
<body>

<header>
  <div class="header-inner">
    <a href="/"><img src="/assets/6leaf-main.png" class="logo" alt="6 Leaf Clover logo" /></a>
    <nav>
      <a href="/">Summary</a>
      <a href="/objectif-lune.html">Objectif Lune</a>
      <a href="/partners.html">Partners</a>
      <a href="/process.html">Process</a>
      <a href="/insights.html" class="active">Insights</a>
    </nav>
  </div>
</header>

<main>
  <section class="hero">
    <div class="container hero-copy">
      <div class="eyebrow">${category || "Insights"}</div>
      <h1>${title}</h1>
      <p>${summary}</p>
      <div class="kpi-row">
        ${date ? `<div class="kpi">${date}</div>` : ""}
      </div>
      <div class="button-row">
        <a class="button" href="mailto:${SITE.email}">Email Matt</a>
        <a class="button-secondary" href="${SITE.bookingUrl}" target="_blank" rel="noopener">Book Time</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="panel article-body">
        ${bodyHtml}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="panel contact-panel">
        <div class="section-header">
          <div class="section-label">Get in touch</div>
          <h2>Want to discuss this topic?</h2>
          <p>If this issue is live in your business, let’s have a direct conversation.</p>
        </div>
        <div class="button-row">
          <a class="button" href="mailto:${SITE.email}">Email Matt</a>
          <a class="button-secondary" href="${SITE.bookingUrl}" target="_blank" rel="noopener">Book Time</a>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="footer-inner">
    © 6 Leaf Clover · ${SITE.email}
  </div>
</footer>

</body>
</html>`;
}

function categoryLabel(value = "") {
  const map = {
    "objectif-lune": "Objectif Lune",
    "partner-growth": "Partner Growth",
    "process-automation": "Process Automation",
  };
  return map[value] || "Insights";
}

async function cleanGeneratedFolders() {
  await ensureDir(OUTPUT_DIR);
  const entries = await fs.readdir(OUTPUT_DIR, { withFileTypes: true }).catch(() => []);

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await fs.rm(path.join(OUTPUT_DIR, entry.name), { recursive: true, force: true });
    }
  }
}

async function build() {
  await ensureDir(CONTENT_DIR);
  await ensureDir(OUTPUT_DIR);
  await cleanGeneratedFolders();

  const files = await fs.readdir(CONTENT_DIR).catch(() => []);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  const posts = [];

  for (const file of markdownFiles) {
    if (file.toLowerCase() === "readme.md") continue;

    const fullPath = path.join(CONTENT_DIR, file);
    const raw = await fs.readFile(fullPath, "utf8");
    const { data, body } = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/, "");
    const bodyHtml = markdownToHtml(body);

    const post = {
      slug,
      title: data.title || slug,
      seoTitle: data.seo_title || "",
      description: data.description || "",
      category: data.category || "",
      categoryLabel: categoryLabel(data.category || ""),
      date: data.date || "",
      formattedDate: formatDate(data.date || ""),
      summary: data.summary || stripHtml(bodyHtml).slice(0, 180),
      thumbnail: data.thumbnail || "",
      bodyHtml,
      url: `/insights/${slug}/`,
    };

    const articleDir = path.join(OUTPUT_DIR, slug);
    await ensureDir(articleDir);
    await fs.writeFile(path.join(articleDir, "index.html"), articleTemplate(post), "utf8");

    posts.push({
      slug: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      categoryLabel: post.categoryLabel,
      date: post.date,
      formattedDate: post.formattedDate,
      summary: post.summary,
      thumbnail: post.thumbnail,
      url: post.url,
    });
  }

  posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  await fs.writeFile(MANIFEST_FILE, JSON.stringify(posts, null, 2), "utf8");

  console.log(`Built ${posts.length} insight post(s).`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
