/**
 * Script pour générer l'image OpenGraph 1200x630px
 * Usage: node scripts/generate-og-image.js
 */

const fs = require('fs');
const path = require('path');

// Utilise Canvas (npm install canvas) pour générer l'image
async function generateOGImage() {
  try {
    const { createCanvas, loadImage } = require('canvas');
    
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fond gradient corporate (bleu FinSight)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0F3D7A'); // Primary blue
    gradient.addColorStop(1, '#1e5a9e'); // Lighter blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Logo centré
    const logo = await loadImage(path.join(__dirname, '../public/images/zineinsights_logo.jpeg'));
    const logoSize = 200; // Taille du logo sur l'image OG
    const logoX = (width - logoSize) / 2;
    const logoY = 150;
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

    // Texte "FinSight" sous le logo
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FinSight', width / 2, 420);

    // Sous-titre
    ctx.font = '32px Arial';
    ctx.fillStyle = '#E0E0E0';
    ctx.fillText('Dashboard Financier IA pour CFO & DAF', width / 2, 480);

    // Sauvegarder l'image
    const buffer = canvas.toBuffer('image/png');
    const outputPath = path.join(__dirname, '../public/images/og-default.png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log('✅ Image OpenGraph générée: public/images/og-default.png');
    console.log('   Dimensions: 1200x630px');
    console.log('   Taille:', (buffer.length / 1024).toFixed(2), 'KB');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('⚠️  Package "canvas" non installé.');
      console.log('   Pour générer l\'image OG, lance:');
      console.log('   npm install canvas --save-dev');
      console.log('   node scripts/generate-og-image.js');
      console.log('');
      console.log('   Alternative: Crée manuellement public/images/og-default.png (1200x630px)');
      process.exit(0);
    }
    throw error;
  }
}

generateOGImage().catch(console.error);
