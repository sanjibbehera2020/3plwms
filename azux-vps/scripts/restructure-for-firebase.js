#!/usr/bin/env node
/**
 * Restructure TanStack Start build output for Firebase Hosting
 * 
 * Since TanStack Start builds both client and server code,
 * we need to extract just the client files for static hosting on Firebase.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distClientDir = path.join(distDir, 'client');
const distServerDir = path.join(distDir, 'server');
const publicDir = path.join(rootDir, 'public');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeDir(dir) {
  if (!fs.existsSync(dir)) return;
  
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`✓ Removed ${path.relative(rootDir, dir)}`);
}

console.log('\n========================================');
console.log('Restructuring for Firebase Hosting');
console.log('========================================\n');

try {
  // Step 1: Copy client files to dist root
  console.log('Step 1: Copying client files to dist root...');
  if (fs.existsSync(distClientDir)) {
    copyDirSync(distClientDir, distDir);
    console.log('✓ Client files copied');
  }

  // Step 2: Remove client folder
  console.log('\nStep 2: Cleaning up...');
  removeDir(distClientDir);

  // Step 3: Remove server folder
  removeDir(distServerDir);

  // Step 4: Ensure index.html exists
  console.log('\nStep 3: Adding entry point...');
  const distIndexHtml = path.join(distDir, 'index.html');
  const publicIndexHtml = path.join(publicDir, 'index.html');
  
  if (!fs.existsSync(distIndexHtml) && fs.existsSync(publicIndexHtml)) {
    fs.copyFileSync(publicIndexHtml, distIndexHtml);
    console.log('✓ index.html copied to dist');
  } else if (fs.existsSync(distIndexHtml)) {
    console.log('✓ index.html already in dist');
  }

  // Step 5: Display structure
  console.log('\n========================================');
  console.log('✓ Restructuring complete!');
  console.log('========================================\n');

  const fileCount = countFiles(distDir);
  const size = getDirectorySize(distDir);

  console.log(`Files in dist: ${fileCount}`);
  console.log(`Total size: ${formatBytes(size)}\n`);

  console.log('Ready for Firebase Hosting deployment!\n');
} catch (error) {
  console.error('✗ Error during restructuring:', error.message);
  process.exit(1);
}

// Helper functions
function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

function getDirectorySize(dir) {
  if (!fs.existsSync(dir)) return 0;
  let size = 0;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      size += getDirectorySize(fullPath);
    } else {
      size += fs.statSync(fullPath).size;
    }
  }
  return size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
