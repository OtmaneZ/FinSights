#!/usr/bin/env node
/**
 * Script pour remplacer automatiquement console.log par logger
 * Usage: node scripts/cleanup-console-logs.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const SRC_DIR = path.join(__dirname, '../src');

// Patterns à remplacer
const replacements = [
    {
        // console.log(...) → logger.debug(...)
        pattern: /console\.log\(/g,
        replacement: 'logger.debug(',
        comment: 'Remplacé console.log par logger.debug'
    },
    {
        // console.info(...) → logger.info(...)
        pattern: /console\.info\(/g,
        replacement: 'logger.info(',
        comment: 'Remplacé console.info par logger.info'
    },
    {
        // console.warn(...) → logger.warn(...)
        pattern: /console\.warn\(/g,
        replacement: 'logger.warn(',
        comment: 'Remplacé console.warn par logger.warn'
    },
    {
        // console.error(...) → logger.error(...)
        pattern: /console\.error\(/g,
        replacement: 'logger.error(',
        comment: 'Remplacé console.error par logger.error'
    }
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let needsImport = false;

    // Appliquer les remplacements
    replacements.forEach(({ pattern, replacement }) => {
        if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            modified = true;
            needsImport = true;
        }
    });

    // Ajouter l'import si nécessaire
    if (needsImport && !content.includes('import { logger }')) {
        // Trouver la dernière ligne d'import
        const lines = content.split('\n');
        let lastImportIndex = -1;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
                lastImportIndex = i;
            }
        }

        if (lastImportIndex >= 0) {
            lines.splice(lastImportIndex + 1, 0, "import { logger } from '@/lib/logger';");
            content = lines.join('\n');
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }

    return false;
}

function main() {
    console.log('🧹 Nettoyage des console.log en cours...\n');

    // Trouver tous les fichiers .ts et .tsx
    const files = glob.sync(`${SRC_DIR}/**/*.{ts,tsx}`, {
        ignore: ['**/node_modules/**', '**/*.test.ts', '**/*.test.tsx']
    });

    let modifiedCount = 0;

    files.forEach(file => {
        const relativePath = path.relative(process.cwd(), file);
        if (processFile(file)) {
            console.log(`✅ ${relativePath}`);
            modifiedCount++;
        }
    });

    console.log(`\n✨ Terminé ! ${modifiedCount} fichiers modifiés`);
    console.log('\n⚠️  Attention : Vérifiez les changements avec `git diff` avant de commit !');
}

main();
