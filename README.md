# T-Ponge PWA - Application de Commandes Foire

Application PWA offline-first pour la prise de commandes d'éponges lors de foires commerciales.

## 🎯 Fonctionnalités

- ✅ **100% Offline** : Fonctionne sans Internet, même après redémarrage
- ✅ **PWA Installable** : Compatible iPad et Android
- ✅ **Interface Kiosque** : Grandes cibles tactiles, anti-misclick
- ✅ **Stockage Local** : IndexedDB avec Dexie
- ✅ **Export CSV** : Compatible Google Sheets
- ✅ **Multi-tablettes** : Fonctionnement indépendant
- ✅ **Mode Sécurisé** : Compatible Accès Guidé (iOS) et Épinglage d'écran (Android)

## 🚀 Installation

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build de production
npm run build

# Preview de production
npm run preview

# Tests
npm run test

# Linting et formatage
npm run lint
npm run format

# CI complète
npm run ci
```

## 📱 Utilisation

### Configuration initiale
1. Ouvrir l'application
2. Cliquer sur "⚙️ Paramètres"
3. Configurer l'ID de la tablette (ex: TAB1, TAB2)
4. Définir le point de vente

### Prise de commandes
1. Sélectionner des produits dans le catalogue
2. Ajuster les quantités dans le panier
3. Cliquer sur "Finaliser la commande"
4. Remplir les informations client (optionnel)
5. Confirmer la commande

### Export des données
1. Cliquer sur "📊 Exporter CSV"
2. Le fichier est téléchargé automatiquement
3. Importer dans Google Sheets

## 🗄️ Structure des données

### Format ID Commande
`${tabletId}-${YYYYMMDD}-${counter4}`
Exemple: `TAB1-20250818-0001`

### Export CSV
Colonnes exportées :
- ID Commande
- Date Création
- Point de Vente
- Nom Client
- Téléphone Client
- SKU Produit
- Libellé Produit
- Quantité
- Prix Unitaire TTC
- Total Ligne TTC
- Total Commande TTC
- Notes

## 🛠️ Architecture Technique

### Stack
- **Frontend** : React 18 + TypeScript
- **Build** : Vite
- **PWA** : Workbox (Service Worker)
- **Base de données** : IndexedDB + Dexie
- **Tests** : Playwright
- **Qualité** : ESLint + Prettier

### Tables IndexedDB
- `orders` : Commandes avec items intégrés
- `products` : Catalogue des produits
- `settings` : Configuration de la tablette

## 📋 Tests

```bash
# Tests E2E avec Playwright
npm run test

# Tests avec interface
npm run test:ui
```

Tests couverts :
- Fonctionnement offline
- Persistance des données
- Création de commandes
- Export CSV
- Interface tactile

## 🔧 Configuration PWA

### Installation sur tablette
1. Ouvrir dans le navigateur
2. "Ajouter à l'écran d'accueil" (iOS) ou "Installer l'app" (Android)
3. L'app s'ouvre en mode plein écran

### Mode Kiosque
- **iOS** : Activer "Accès Guidé" dans Réglages > Accessibilité
- **Android** : Utiliser "Épinglage d'écran" ou mode kiosque

## 📦 Déploiement

```bash
# Build de production
npm run build

# Les fichiers sont dans /dist
# Déployer sur serveur web statique
```

## 🔍 Dépannage

### L'app ne fonctionne pas offline
- Vérifier que le Service Worker est enregistré
- Vider le cache du navigateur
- Réinstaller la PWA

### Problème d'export CSV
- Vérifier les permissions de téléchargement
- Tester avec un autre navigateur

### Données perdues
- Les données sont stockées localement dans IndexedDB
- Éviter de vider les données du navigateur

## 📞 Support

Pour toute question technique, consulter :
- Console du navigateur (F12)
- Logs du Service Worker
- Tests Playwright pour exemples d'usage
