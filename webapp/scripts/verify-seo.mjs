import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const siteUrl = 'https://www.aeback.com';
const outDir = join(process.cwd(), 'out');
const failures = [];

function readOutFile(file) {
  const fullPath = join(outDir, file);
  if (!existsSync(fullPath)) {
    failures.push(`Missing ${file}`);
    return '';
  }
  return readFileSync(fullPath, 'utf8');
}

function htmlFileForUrl(url) {
  const path = new URL(url).pathname;
  if (path === '/') return 'index.html';
  return join(path.replace(/^\/|\/$/g, ''), 'index.html');
}

const sitemap = readOutFile('sitemap.xml');
const robots = readOutFile('robots.txt');

if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
  failures.push('robots.txt missing Sitemap directive');
}

const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const uniqueUrls = new Set(urls);

if (urls.length !== uniqueUrls.size) failures.push('sitemap.xml contains duplicate URLs');
if (urls.length < 39) failures.push(`sitemap.xml should contain at least 39 URLs, found ${urls.length}`);

const requiredUrls = [
  `${siteUrl}/`,
  `${siteUrl}/en/`,
  `${siteUrl}/aep-jiangji/`,
  `${siteUrl}/ae-2026-to-2024/`,
  `${siteUrl}/aep-file-cannot-open/`,
  `${siteUrl}/en/aep-downgrader/`,
  `${siteUrl}/en/ae-2026-to-2024/`,
  `${siteUrl}/en/aep-downgrade-without-upload/`,
  `${siteUrl}/privacy/`,
  `${siteUrl}/terms/`,
  `${siteUrl}/disclaimer/`,
  `${siteUrl}/about/`,
  `${siteUrl}/contact/`,
  `${siteUrl}/en/privacy/`,
  `${siteUrl}/en/terms/`,
  `${siteUrl}/en/disclaimer/`,
  `${siteUrl}/en/about/`,
  `${siteUrl}/en/contact/`,
];

for (const url of requiredUrls) {
  if (!uniqueUrls.has(url)) failures.push(`sitemap.xml missing ${url}`);
}

for (const url of urls) {
  const file = htmlFileForUrl(url);
  const html = readOutFile(file);
  if (!html) continue;

  const checks = [
    ['title', /<title>[^<]{8,}<\/title>/],
    ['description', /<meta name="description" content="[^"]{40,}"/],
    ['canonical', /<link rel="canonical" href="https:\/\/www\.aeback\.com\//],
    ['index robots', /<meta name="robots" content="index, follow"/],
    ['body heading', /<h1[^>]*>/],
  ];

  for (const [label, pattern] of checks) {
    if (!pattern.test(html)) failures.push(`${file} missing ${label}`);
  }

  if (!html.includes('application/ld+json')) {
    failures.push(`${file} missing structured data`);
  }
}

if (failures.length > 0) {
  console.error('SEO verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO verification passed for ${urls.length} URLs.`);
