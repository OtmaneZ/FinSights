# Instructions pour ajouter le logo FinSight

## Logo reçu
Votre logo (éclair/lightning) a été reçu.

## Où placer le logo

1. **Sauvegarder l'image** :
   - Convertir l'image en PNG si nécessaire
   - Nom suggéré : `finsight-logo.png`
   - Dimensions recommandées : 200×200px minimum (haute résolution)

2. **Emplacement** :
   ```
   /public/images/finsight-logo.png
   ```

3. **Conversion en Base64** (pour PDF) :
   ```bash
   # Depuis le terminal
   cd /Users/otmaneboulahia/Documents/finsights/public/images
   base64 -i finsight-logo.png -o finsight-logo-base64.txt
   ```

## Intégration dans le PDF

Une fois le logo en place, modifier `/src/lib/pdfExporter.ts` :

```typescript
// Ligne 52 environ - Remplacer le placeholder
private async addCoverPage(options: PDFExportOptions) {
    // ... code existant ...

    // Logo FinSight
    const logoBase64 = 'data:image/png;base64,iVBORw0KGgo...'; // Votre logo en base64
    const logoWidth = 40;
    const logoHeight = 40;
    const logoX = (this.pageWidth - logoWidth) / 2;

    this.pdf.addImage(logoBase64, 'PNG', logoX, 30, logoWidth, logoHeight);

    // ... suite du code ...
}
```

## Alternative : Logo depuis URL

Si vous préférez charger depuis une URL :

```typescript
// Dans pdfExporter.ts
private async loadLogo(): Promise<string> {
    const response = await fetch('/images/finsight-logo.png');
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}

// Puis dans addCoverPage
const logoBase64 = await this.loadLogo();
```

## Prochaines étapes

1. ✅ Structure PDF créée
2. ⏳ Ajouter le vrai logo (après sauvegarde)
3. ⏳ Tester l'export avec données réelles
4. ⏳ Ajuster tailles/positions si besoin
