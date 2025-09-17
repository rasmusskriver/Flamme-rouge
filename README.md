# Flamme Rouge Kortstyring - Modern Web App

En moderne digital kortstyring til Flamme Rouge brætspillet, bygget som en Progressive Web App (PWA) og optimeret til deployment på Vercel.

## 🚀 Funktioner

- **Digital Kortstyring**: Håndter kort for alle spillere og ryttere
- **Turbaseret Gameplay**: Organiseret spil med skjulte kortvalg
- **PWA Support**: Installer som app på mobil og desktop
- **Responsive Design**: Optimeret til alle skærmstørrelser
- **Offline Support**: Service Worker til caching og offline brug

## 📁 Projektstruktur

```
flamme-rouge/
├── src/
│   ├── styles.css      # Alle CSS styles
│   └── app.js          # JavaScript applikationslogik
├── index.html          # Hovedapplikation
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── vercel.json        # Vercel deployment konfiguration
├── package.json       # Project dependencies og scripts
└── README.md          # Denne fil
```

## 🛠️ Development

### Forudsætninger
- Node.js 18+ 
- npm eller yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
# Eller
npm start
```

### Build & Deploy
```bash
# Lokal build validation
npm run build

# Deploy til Vercel
npm run deploy

# Production deployment
npm run deploy:prod
```

### Code Quality
```bash
# Lint JavaScript
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Validate HTML
npm run test:validate
```

   ```bash
   npm i -g vercel
   ```

2. **Login til Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy projektet**:

   ```bash
   vercel
   ```

   Følg promptsene:

   - Set up and deploy? `Y`
   - Which scope? Vælg din konto
   - Link to existing project? `N` (for nyt projekt)
   - What's your project's name? `flamme-rouge-pwa`
   - In which directory is your code located? `./`

### Alternative: GitHub Deploy

1. **Push til GitHub repository**
2. **Gå til [vercel.com](https://vercel.com)**
3. **Klik "Import Project"**
4. **Vælg dit GitHub repository**
5. **Deploy automatisk**

## 📱 PWA Funktioner

- ✅ Installering som app på mobil/desktop
- ✅ Offline funktionalitet
- ✅ Service Worker caching
- ✅ App ikoner og manifest

## 🔧 Filer Struktur

```
flamme-rouge/
├── index.html          # Hoved app fil
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── vercel.json        # Vercel konfiguration
├── icon-192.svg       # App ikon (lille)
├── icon-512.svg       # App ikon (stor)
└── README.md          # Denne fil
```

## 🌐 Efter Deploy

Når appen er deployed:

1. **Test PWA funktionalitet** på den live URL
2. **Test installation** på mobil og desktop
3. **Verificer offline funktionalitet**

## 🔄 Opdateringer

For at deploye opdateringer:

```bash
vercel --prod
```

Eller push til GitHub for automatisk deploy.
