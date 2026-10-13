import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), 'public', 'assets');
const dest = path.join(process.cwd(), '.next', 'static', 'assets');

// Create destination folder if it doesn’t exist
fs.mkdirSync(dest, { recursive: true });

// Copy all files recursively
function copyRecursive(srcDir, destDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(src, dest);
console.log(`Copied assets from ${src} → ${dest}`);
