import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'out');

const pages = [
  {
    file: 'index.html',
    mustContain: [
      '<title>AE 工程降级工具',
      '<meta name="description"',
      '<link rel="canonical"',
      '在线 AEP 降级工具',
      'application/ld+json',
    ],
  },
  {
    file: join('en', 'index.html'),
    mustContain: [
      '<title>AEP Downgrader',
      '<meta name="description"',
      '<link rel="canonical"',
      'Free online AEP downgrader',
      'application/ld+json',
    ],
  },
  {
    file: join('aep-jiangji', 'index.html'),
    mustContain: ['<title>AEP 降级工具', '<meta name="description"', 'AEP 降级工具'],
  },
  {
    file: join('ae-gongcheng-jiangji', 'index.html'),
    mustContain: ['<title>AE 工程降级', '<meta name="description"', 'AE 工程降级'],
  },
  {
    file: join('after-effects-di-banben-dakai', 'index.html'),
    mustContain: ['<title>After Effects 低版本打开', '<meta name="description"', 'After Effects 低版本打开'],
  },
  {
    file: join('en', 'aep-downgrader', 'index.html'),
    mustContain: ['<title>AEP Downgrader', '<meta name="description"', 'AEP Downgrader'],
  },
  {
    file: join('en', 'downgrade-after-effects-project', 'index.html'),
    mustContain: ['<title>Downgrade After Effects Project', '<meta name="description"', 'Downgrade After Effects Project'],
  },
  {
    file: join('en', 'open-aep-in-older-version', 'index.html'),
    mustContain: ['<title>Open AEP in Older Version', '<meta name="description"', 'Open AEP in Older Version'],
  },
];

const requiredFiles = ['sitemap.xml', 'robots.txt'];
const failures = [];

for (const file of requiredFiles) {
  const fullPath = join(outDir, file);
  if (!existsSync(fullPath)) failures.push(`Missing ${file}`);
}

for (const page of pages) {
  const fullPath = join(outDir, page.file);
  if (!existsSync(fullPath)) {
    failures.push(`Missing ${page.file}`);
    continue;
  }

  const html = readFileSync(fullPath, 'utf8');
  for (const needle of page.mustContain) {
    if (!html.includes(needle)) failures.push(`${page.file} missing ${needle}`);
  }
}

if (existsSync(join(outDir, 'sitemap.xml'))) {
  const sitemap = readFileSync(join(outDir, 'sitemap.xml'), 'utf8');
  const expectedUrls = [
    'https://aejiangji.vercel.app/',
    'https://aejiangji.vercel.app/en/',
    'https://aejiangji.vercel.app/aep-jiangji/',
    'https://aejiangji.vercel.app/ae-gongcheng-jiangji/',
    'https://aejiangji.vercel.app/after-effects-di-banben-dakai/',
    'https://aejiangji.vercel.app/en/aep-downgrader/',
    'https://aejiangji.vercel.app/en/downgrade-after-effects-project/',
    'https://aejiangji.vercel.app/en/open-aep-in-older-version/',
  ];

  for (const url of expectedUrls) {
    if (!sitemap.includes(`<loc>${url}</loc>`)) failures.push(`sitemap.xml missing ${url}`);
  }
}

if (failures.length > 0) {
  console.error('SEO verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('SEO verification passed.');
