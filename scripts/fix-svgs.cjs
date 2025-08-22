#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let content = original;

  // Remove a full-size white background rect (common export from some tools)
  const rectRegex = /<rect\b[^>]*fill=["']#(?:fff|ffffff)["'][^>]*\/?>/i;
  content = content.replace(rectRegex, '');

  // Remove width/height attributes from the opening <svg ...> tag so CSS can control sizing,
  // but keep the viewBox (if present).
  const svgOpenMatch = content.match(/<svg\b[^>]*>/i);
  if (svgOpenMatch) {
    const openTag = svgOpenMatch[0];
    const newOpenTag = openTag.replace(/\s(width|height)=["'][^"']*["']/gi, '');
    content = content.replace(openTag, newOpenTag);
  }

  if (content !== original) {
    // create a backup first (only if not already backed up)
    const bakPath = filePath + '.bak';
    if (!fs.existsSync(bakPath)) fs.writeFileSync(bakPath, original, 'utf8');
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function main() {
  if (!fs.existsSync(assetsDir)) {
    console.error('assets directory not found:', assetsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(assetsDir).filter((f) => f.toLowerCase().endsWith('.svg'));
  const changed = [];
  for (const f of files) {
    const fp = path.join(assetsDir, f);
    try {
      const did = processFile(fp);
      if (did) changed.push(f);
    } catch (err) {
      console.error('failed processing', f, err.message);
    }
  }

  if (changed.length) {
    console.log('Updated SVG files (backups saved as .bak):');
    changed.forEach((c) => console.log('-', c));
    process.exit(0);
  } else {
    console.log('No changes needed.');
    process.exit(0);
  }
}

main();
