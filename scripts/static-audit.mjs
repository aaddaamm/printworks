import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
	"index.html",
	"styles.css",
	"robots.txt",
	"sitemap.xml",
	"site.webmanifest",
	"favicon.ico",
	"favicon.svg",
	"apple-touch-icon.png",
	"og-image.jpg",
	"llms.txt",
];

const failures = [];
const warnings = [];

const read = (path) => readFileSync(path, "utf8");
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const countMatches = (source, pattern) => [...source.matchAll(pattern)].length;

for (const file of requiredFiles) {
	if (!existsSync(file)) {
		fail(`Missing required public asset: ${file}`);
	}
}

const html = existsSync("index.html") ? read("index.html") : "";
const css = existsSync("styles.css") ? read("styles.css") : "";
const robots = existsSync("robots.txt") ? read("robots.txt") : "";
const sitemap = existsSync("sitemap.xml") ? read("sitemap.xml") : "";

const exactlyOne = (label, pattern) => {
	const count = countMatches(html, pattern);
	if (count !== 1) {
		fail(`${label} must appear exactly once; found ${count}.`);
	}
};

exactlyOne("Title tag", /<title>[\s\S]*?<\/title>/gi);
exactlyOne("Meta description", /<meta\s+[^>]*name=["']description["'][^>]*>/gi);
exactlyOne("Canonical link", /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi);
exactlyOne("Robots meta tag", /<meta\s+[^>]*name=["']robots["'][^>]*>/gi);
exactlyOne("Main landmark", /<main\b/gi);
exactlyOne("H1 heading", /<h1\b[\s\S]*?<\/h1>/gi);

const requiredHtmlPatterns = [
	["viewport meta tag", /<meta\s+[^>]*name=["']viewport["'][^>]*>/i],
	["theme-color meta tag", /<meta\s+[^>]*name=["']theme-color["'][^>]*>/i],
	["Open Graph title", /<meta\s+[^>]*property=["']og:title["'][^>]*>/i],
	[
		"Open Graph description",
		/<meta\s+[^>]*property=["']og:description["'][^>]*>/i,
	],
	["Open Graph image", /<meta\s+[^>]*property=["']og:image["'][^>]*>/i],
	["Open Graph URL", /<meta\s+[^>]*property=["']og:url["'][^>]*>/i],
	["Twitter card", /<meta\s+[^>]*name=["']twitter:card["'][^>]*>/i],
	["Twitter title", /<meta\s+[^>]*name=["']twitter:title["'][^>]*>/i],
	[
		"Twitter description",
		/<meta\s+[^>]*name=["']twitter:description["'][^>]*>/i,
	],
	["Twitter image", /<meta\s+[^>]*name=["']twitter:image["'][^>]*>/i],
	[
		"JSON-LD structured data",
		/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i,
	],
	[
		"skip link",
		/<a\s+[^>]*class=["'][^"']*skip-link[^"']*["'][^>]*href=["']#main-content["'][^>]*>/i,
	],
	["main content target", /<main\s+[^>]*id=["']main-content["'][^>]*>/i],
	["navigation landmark", /<nav\b/i],
	["header landmark", /<header\b/i],
	["footer landmark", /<footer\b/i],
];

for (const [label, pattern] of requiredHtmlPatterns) {
	if (!pattern.test(html)) {
		fail(`Missing ${label}.`);
	}
}

const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
if (title.length > 60) {
	warn(
		`Title is ${title.length} characters; keep important terms near the front to reduce SERP truncation.`,
	);
}

const description =
	html.match(
		/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i,
	)?.[1] ?? "";
if (description.length < 120 || description.length > 160) {
	warn(
		`Meta description is ${description.length} characters; recommended range is 120-160.`,
	);
}

const canonical =
	html.match(
		/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i,
	)?.[1] ?? "";
if (!canonical.startsWith("https://printworks.adamrobinson.tech/")) {
	fail(`Canonical URL must use production origin; found "${canonical}".`);
}

const robotContent =
	html.match(
		/<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i,
	)?.[1] ?? "";
for (const directive of ["index", "follow", "max-image-preview:large"]) {
	if (!robotContent.includes(directive)) {
		fail(`Robots meta tag should include "${directive}".`);
	}
}

const schemaBlocks = [
	...html.matchAll(
		/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
	),
];
for (const [index, match] of schemaBlocks.entries()) {
	try {
		const data = JSON.parse(match[1]);
		const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
		const types = graph.map((item) => item["@type"]);
		for (const type of ["WebSite", "ProfessionalService", "FAQPage"]) {
			if (!types.includes(type)) {
				fail(`JSON-LD block ${index + 1} is missing ${type} schema.`);
			}
		}
	} catch (error) {
		fail(`JSON-LD block ${index + 1} is invalid JSON: ${error.message}`);
	}
}

const headingLevels = [...html.matchAll(/<h([1-6])\b[\s\S]*?<\/h\1>/gi)].map(
	(match) => Number(match[1]),
);
for (let index = 1; index < headingLevels.length; index += 1) {
	if (headingLevels[index] - headingLevels[index - 1] > 1) {
		fail(
			`Heading hierarchy skips from h${headingLevels[index - 1]} to h${headingLevels[index]}.`,
		);
	}
}

const images = [...html.matchAll(/<img\b([^>]*?)>/gi)];
for (const [index, match] of images.entries()) {
	const attrs = match[1];
	if (!/\salt=["'][^"']*["']/i.test(attrs)) {
		fail(`Image ${index + 1} is missing an alt attribute.`);
	}
	if (!/\swidth=["']?\d+/i.test(attrs) || !/\sheight=["']?\d+/i.test(attrs)) {
		warn(
			`Image ${index + 1} is missing explicit width/height attributes; confirm CSS aspect-ratio reserves space.`,
		);
	}
}

const anchors = [...html.matchAll(/<a\b([^>]*?)>/gi)];
for (const [index, match] of anchors.entries()) {
	const href = match[1].match(/\shref=["']([^"']+)["']/i)?.[1];
	if (!href) {
		fail(`Anchor ${index + 1} is missing href.`);
	} else if (href.startsWith("javascript:")) {
		fail(`Anchor ${index + 1} uses a non-crawlable javascript: href.`);
	}
}

const dialogButtons = [...html.matchAll(/<button\b([^>]*?)>/gi)];
for (const [index, match] of dialogButtons.entries()) {
	const attrs = match[1];
	const hasAccessibleName =
		/aria-label=["'][^"']+["']/i.test(attrs) ||
		/aria-labelledby=["'][^"']+["']/i.test(attrs);
	if (
		!hasAccessibleName &&
		/class=["'][^"']*(gallery-close|gallery-prev|gallery-next|gallery-trigger)/i.test(
			attrs,
		)
	) {
		fail(
			`Gallery button ${index + 1} needs an aria-label or aria-labelledby value.`,
		);
	}
}

if (
	!/a:focus-visible[\s\S]*outline:/i.test(css) ||
	!/\.button:focus-visible[\s\S]*outline:/i.test(css)
) {
	fail("CSS must define visible focus outlines for links and buttons.");
}

if (!/prefers-reduced-motion:\s*reduce/i.test(css)) {
	fail("CSS must include a prefers-reduced-motion: reduce media query.");
}

if (/transition-all|transition:\s*all/i.test(css)) {
	fail("Avoid transition-all; list transitioned properties explicitly.");
}

if (
	!/Sitemap:\s*https:\/\/printworks\.adamrobinson\.tech\/sitemap\.xml/i.test(
		robots,
	)
) {
	fail("robots.txt must reference the production sitemap URL.");
}

if (!/<loc>https:\/\/printworks\.adamrobinson\.tech\/<\/loc>/i.test(sitemap)) {
	fail("sitemap.xml must include the production homepage URL.");
}

if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/i.test(sitemap)) {
	fail("sitemap.xml must include an ISO date lastmod value.");
}

if (countMatches(sitemap, /<image:loc>/g) < 1) {
	warn("sitemap.xml has no image sitemap entries.");
}

for (const message of warnings) {
	process.stderr.write(`WARN: ${message}\n`);
}

if (failures.length > 0) {
	process.stderr.write("\nStatic SEO/accessibility audit failed:\n");
	for (const message of failures) {
		process.stderr.write(`- ${message}\n`);
	}
	process.exit(1);
}

process.stdout.write("Static SEO/accessibility audit passed.\n");
if (warnings.length > 0) {
	process.stdout.write(
		`${warnings.length} non-blocking warning(s) reported above.\n`,
	);
}
