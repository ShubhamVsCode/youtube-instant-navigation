#!/usr/bin/env node
/**
 * Generate icon files from SVG for Chrome Web Store
 * Requires: sharp (npm install -g sharp)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'chrome-extension', 'public');
const svgPath = join(publicDir, 'icon.png');

const sizes = [16, 48, 128];

// Simple SVG to PNG converter using sharp if available
async function generateIcons() {
  try {
    // Try to use sharp
    const sharp = (await import('sharp')).default;
    const svgBuffer = readFileSync(svgPath);

    for (const size of sizes) {
      const pngBuffer = await sharp(svgBuffer).resize(size, size).png().toBuffer();

      const outputPath = join(publicDir, `icon-${size}.png`);
      writeFileSync(outputPath, pngBuffer);
      console.log(`✓ Generated icon-${size}.png`);
    }

    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('\n❌ Error: sharp is not installed.');
      console.log('\nTo generate icons, install sharp:');
      console.log('  npm install -g sharp');
      console.log('  OR');
      console.log('  pnpm add -D sharp');
      console.log('\nAlternatively, you can:');
      console.log('1. Open icon.svg in a design tool (Figma, Inkscape, etc.)');
      console.log('2. Export as PNG at sizes: 16x16, 48x48, 128x128');
      console.log('3. Save them as icon-16.png, icon-48.png, icon-128.png in chrome-extension/public/');
      process.exit(1);
    } else {
      throw error;
    }
  }
}

generateIcons();
