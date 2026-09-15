import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "insights");
const OUTPUT_DIR = path.join(ROOT, "insights");
const MANIFEST_FILE = path.join(OUTPUT_DIR, "index.json");
const LATEST_FILE = path.join(ROOT, "assets", "latest-insight.json");

const SITE = {
  name: "6 Leaf Clover",
  url: "https://www.6leafclover.co.uk",
  email: "matt@6leafclover.co.uk",
  bookingUrl:
    "https://outlook.office.com/bookwithme/user/096431fd04e74d8491d724ad463fd408@6leafclover.co.uk/meetingtype/wNoemyp6DkeDweaqhTh28A2?bookingcode=69d25a57-49e8-44cc-b3cb-9e900e9f0cd9&anonymous&ismsaljsauthenabled&ep=mlink",
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
  if (!match) return { data: {}, body: fileContent };

  const raw = match[1];
  const body = match[2];
  const data = {};

  let currentKey = null;

  for (const line of raw.split("\n")) {
    // Wrapped continuation line (Decap/js-yaml folds long values onto
    // indented lines with no "key:" of their own) — append it to whatever
    // key we were last reading instead of discarding it.
    if (/^\s+\S/.test(line) && currentKey) {
      data[currentKey] += (data[currentKey] ? " " : "") + line.trim();
      continue;
    }

    const idx = line.indexOf(":");
    if (idx === -1) {
      currentKey = null;
      continue;
    }

    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();

    data[key] = value;
    currentKey = key;
  }

  // Strip matching surrounding quotes now that wrapped values are whole.
  for (const key of Object.keys(data)) {
    let value = data[key];
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

function categoryLabel(value = "") {
  const map = {
    "objectif-lune": "Objectif Lune",
    "partner-growth": "Partner Growth",
    "process-automation": "Process Automation",
  };
  return map[value] || "Insights";
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

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-89XM09ZV6T"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-89XM09ZV6T');
  </script>
  <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "y4c2ji5exg");
  </script>

  <style>
  :root{
    --navy:#192134;
    --navy-soft:#2A3448;
    --green:#22B573;
    --green-dark:#146B45;
    --cream:#FBF9F3;
    --paper:#F5F2E9;
    --card:#FFFFFF;
    --ink:#192134;
    --ink-soft:#5B6472;
    --rule:#E7E2D2;
    --rule-strong:#D8D2BE;
    --green-tint:#E4F3EA;
    --font:Calibri,"Segoe UI",Arial,sans-serif;
  }
  *{box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{margin:0;background:var(--cream);color:var(--ink);font-family:var(--font);font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased;}
  a{color:inherit;}
  img{max-width:100%;display:block;}
  .wrap{max-width:900px;margin:0 auto;padding:0 32px;}
  h1,h2,h3{font-family:var(--font);font-weight:700;color:var(--navy);margin:1.2em 0 .5em 0;line-height:1.2;}
  h1{margin-top:0;font-size:clamp(32px,4.6vw,48px);color:var(--green-dark);letter-spacing:-.5px;}
  h2{font-size:26px;color:var(--green-dark);}
  h3{font-size:20px;}
  p{margin:0 0 1em 0;}
  ul{margin:0 0 1.2em 0;padding-left:22px;color:var(--ink-soft);}
  li{margin-bottom:8px;}
  strong{color:var(--navy);}
  a.inline-link{color:var(--green-dark);text-decoration:underline;}
  .eyebrow{display:inline-block;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--green-dark);background:var(--green-tint);padding:6px 14px;border-radius:20px;margin-bottom:18px;}

  .topbar{background:var(--navy);color:#fff;font-size:13.5px;text-align:center;padding:8px 12px;letter-spacing:.3px;}

  header.site{background:var(--cream);border-bottom:1px solid var(--rule);}
  .header-inner{display:flex;align-items:center;justify-content:space-between;padding:20px 0;flex-wrap:wrap;gap:16px;}
  .brand img{height:56px;width:auto;}
  nav.mainnav{display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap;}
  nav.mainnav a{font-size:14px;font-weight:600;color:var(--navy);text-decoration:none;}
  nav.mainnav a.current{color:var(--green-dark);border-bottom:2px solid var(--green);padding-bottom:4px;}
  .nav-group{display:flex;flex-direction:column;}
  .nav-group-label{font-size:14px;font-weight:600;color:var(--navy);line-height:1.3;}
  .nav-sub{display:flex;gap:10px;margin-top:3px;}
  .nav-sub a{font-size:11.5px;font-weight:600;color:var(--ink-soft);text-decoration:none;white-space:nowrap;}
  .nav-sub a.current{color:var(--green-dark);}
  .nav-cta{background:var(--green);color:#fff !important;padding:9px 18px;border-radius:8px;font-weight:700 !important;border-bottom:none !important;}

  .hero{padding:56px 0 40px;background:var(--paper);border-bottom:1px solid var(--rule);}
  .hero .date{font-size:13.5px;color:var(--ink-soft);font-weight:600;margin-bottom:8px;}
  .lede{font-size:19px;color:var(--ink-soft);}

  .btn-primary{background:var(--green);color:#fff;padding:14px 26px;border-radius:8px;font-weight:700;font-size:15.5px;text-decoration:none;display:inline-block;border:none;cursor:pointer;box-shadow:0 6px 18px rgba(34,181,115,.24);}
  .btn-secondary{color:var(--navy);font-weight:600;text-decoration:underline;font-size:14.5px;display:inline-block;}
  .button-row{display:flex;gap:20px;align-items:center;flex-wrap:wrap;margin-top:8px;}

  section{padding:48px 0;}
  .article-body{font-size:17px;}

  .cta-band{background:var(--navy);color:#fff;border-radius:20px;padding:48px;text-align:center;}
  .cta-band h2{color:#fff;margin-top:0;}
  .cta-band p{color:#B9C0CC;font-size:16px;}

  footer.site{background:var(--navy);color:#B9C0CC;padding:36px 0;margin-top:20px;}
  .footer-inner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;font-size:13.5px;}
  .footer-inner a{color:#B9C0CC;text-decoration:none;margin-left:18px;}
  .footer-inner a:first-child{margin-left:0;}

  @media(max-width:700px){
    .header-inner{flex-direction:column;align-items:flex-start;}
    .cta-band{padding:32px 24px;}
  }
  </style>
</head>
<body>

<div class="topbar">Currently trading as a solo advisory practice &middot; <strong>limited retainer slots available</strong></div>

<header class="site">
  <div class="wrap header-inner">
    <a href="/" class="brand"><img src="/assets/6leaf-main.png" alt="6 Leaf Clover"></a>
    <nav class="mainnav">
      <a href="/">Home</a>
      <div class="nav-group">
        <span class="nav-group-label">Process Automation</span>
        <span class="nav-sub">
          <a href="/process-automation-direct.html">For Your Business</a>
          <a href="/process-automation-partner.html">Partner Growth</a>
        </span>
      </div>
      <div class="nav-group">
        <span class="nav-group-label">Objectif Lune</span>
        <span class="nav-sub">
          <a href="/objectif-lune-customers.html">Existing Customers</a>
          <a href="/objectif-lune-erp.html">ERP/IBM Channel</a>
        </span>
      </div>
      <a href="/insights.html" class="current">Insights</a>
      <a href="/index.html#contact" class="nav-cta">Book a conversation</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <span class="eyebrow">${category || "Insights"}</span>
    <h1>${title}</h1>
    ${date ? `<div class="date">${date}</div>` : ""}
    <p class="lede">${summary}</p>
    <div class="button-row">
      <a class="btn-primary" href="mailto:${SITE.email}">Email Matt</a>
      <a class="btn-secondary" href="${SITE.bookingUrl}" target="_blank" rel="noopener">Book time</a>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="article-body">
      ${bodyHtml}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta-band">
      <h2>Want to discuss this topic?</h2>
      <p>If this issue is live in your business, let's have a direct conversation.</p>
      <div class="button-row" style="justify-content:center;margin-top:16px;">
        <a class="btn-primary" href="mailto:${SITE.email}">Email Matt</a>
        <a class="btn-secondary" href="${SITE.bookingUrl}" target="_blank" rel="noopener" style="color:#fff;">Book time</a>
      </div>
    </div>
  </div>
</section>

<footer class="site">
  <div class="wrap footer-inner">
    <span>&copy; 6 Leaf Clover &middot; ${SITE.email}</span>
    <div>
      <a href="/">Home</a>
      <a href="/insights.html">Insights</a>
      <a href="mailto:${SITE.email}">Contact</a>
    </div>
  </div>
</footer>

</body>
</html>`;
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
  await ensureDir(path.join(ROOT, "assets"));
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
  await fs.writeFile(LATEST_FILE, JSON.stringify(posts[0] || null, null, 2), "utf8");

  console.log(`Built ${posts.length} insight post(s).`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
