# Dashboard Inter Officer

Dashboard pour analyser et visualiser les métriques Intercom.

## Fonctionnalités

- **Dashboard Général** : Vue d'ensemble des métriques Intercom
  - Nombre de nouveaux tickets/discussions créés
  - Nombre de tickets ouverts en fin de journée
  - Nombre de tickets fermés/rouverts
  - Tickets par agent par jour
  - Charge de travail par agent (tickets actifs assignés)
  - Pourcentage de tickets Intercom envoyés vers Jira
  - Volume de tickets par pack (Pro/Pro+/Expert/Expert+)
  - Volume par heure/jour (peak hours)
  - Âge du backlog (plus vieux ticket non résolu)

## Technologies

- **Frontend** : React 18 avec TypeScript
- **Styling** : Tailwind CSS
- **API** : Service Intercom intégré
- **Build** : Create React App

## Installation

1. Clonez le repository
2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   ```bash
   cp .env.example .env
   ```
   Puis éditez `.env` avec votre token Intercom.

4. Lancez l'application :
   ```bash
   npm start
   ```

## Configuration Intercom

Pour connecter l'application à votre compte Intercom :

1. Allez dans votre compte Intercom > Settings > Developers > Access tokens
2. Créez un nouveau token avec les permissions nécessaires
3. Ajoutez le token dans votre fichier `.env` :
   ```
   REACT_APP_INTERCOM_ACCESS_TOKEN=your_token_here
   ```

## Authentification

- **Login** : admin
- **Mot de passe** : admin123

## Structure du projet

```
src/
├── components/          # Composants React
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── Sidebar.tsx      # Navigation latérale
│   └── StatCard.tsx     # Cartes de statistiques
├── data/               # Données mockées
│   └── mockData.ts     # Données de test
├── services/           # Services API
│   └── intercomService.ts # Service Intercom
├── types/              # Types TypeScript
│   └── intercom.ts     # Types pour les données Intercom
└── App.tsx             # Composant principal
```

## Développement

L'application utilise actuellement des données mockées pour le développement. Pour utiliser les vraies données Intercom, configurez votre token d'accès dans le fichier `.env`.

## Prochaines étapes

- [ ] Implémentation complète de l'API Intercom
- [ ] Ajout de graphiques et visualisations
- [ ] Système d'authentification complet
- [ ] Gestion des erreurs et états de chargement
- [ ] Tests unitaires
- [ ] Déploiement
