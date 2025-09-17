# Flamme Rouge PWA

En Progressive Web App til kortstyring i Flamme Rouge brætspil.

## 🚀 Deploy til Vercel

### Hurtig Deploy

1. **Installer Vercel CLI** (hvis ikke allerede installeret):

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
