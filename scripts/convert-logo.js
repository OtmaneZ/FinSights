// Script pour convertir le logo en base64
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '../public/images/zineinsights_logo.jpeg');
const outputPath = path.join(__dirname, '../src/lib/logo.ts');

try {
    // Lire le fichier image
    const imageBuffer = fs.readFileSync(logoPath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = logoPath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    // Créer le fichier TypeScript
    const content = `// Logo FinSight - Généré automatiquement
// Ne pas modifier manuellement - utiliser scripts/convert-logo.js

export const FINSIGHT_LOGO_BASE64 = \`data:${mimeType};base64,${base64Image}\`;
`;
    
    fs.writeFileSync(outputPath, content);
    console.log('✅ Logo converti avec succès !');
    console.log(`📁 Fichier généré : ${outputPath}`);
    console.log(`📏 Taille : ${(base64Image.length / 1024).toFixed(2)} KB`);
} catch (error) {
    console.error('❌ Erreur :', error.message);
    process.exit(1);
}
