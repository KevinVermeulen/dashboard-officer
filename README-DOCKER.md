# Dashboard Intercom - Déploiement Docker

## 📋 Prérequis

- Docker et Docker Compose installés
- Accès à l'API Intercom avec un token valide

## 🚀 Déploiement Local

### 1. Configuration des variables d'environnement

Copiez le fichier `.env.example` vers `.env` et configurez votre token Intercom :

```bash
cp .env.example .env
```

Éditez le fichier `.env` :
```env
REACT_APP_INTERCOM_ACCESS_TOKEN=your_intercom_access_token_here
```

### 2. Construction et lancement avec Docker Compose

```bash
# Construction et lancement
docker-compose up -d

# Vérification des logs
docker-compose logs -f

# Arrêt
docker-compose down
```

### 3. Construction manuelle de l'image

```bash
# Construction de l'image
docker build -t dashboard-intercom .

# Lancement du conteneur
docker run -d -p 80:80 --name dashboard-intercom dashboard-intercom
```

## 🌐 Déploiement sur Dokploy

### 1. Préparation du projet

1. Assurez-vous que tous les fichiers Docker sont présents :
   - `Dockerfile`
   - `docker-compose.yml`
   - `nginx.conf`
   - `.dockerignore`

2. Configurez vos variables d'environnement dans Dokploy

### 2. Configuration Dokploy

1. **Créer une nouvelle application** dans Dokploy
2. **Type de déploiement** : Docker Compose
3. **Repository** : Votre repository Git contenant le projet
4. **Variables d'environnement** :
   ```
   REACT_APP_INTERCOM_ACCESS_TOKEN=your_token_here
   ```

### 3. Fichiers de configuration

Le projet inclut :

- **Dockerfile multi-stage** : Construction optimisée avec Node.js + Nginx
- **Configuration Nginx** : Serveur web optimisé pour React SPA
- **Docker Compose** : Configuration complète avec health checks
- **Dockerignore** : Exclusion des fichiers inutiles

## 🔧 Architecture Docker

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Builder       │    │   Production     │    │   Nginx         │
│   (Node.js)     │───▶│   (Files)        │───▶│   (Web Server)  │
│   - npm ci      │    │   - /build       │    │   - Port 80     │
│   - npm build   │    │   - Static files │    │   - Gzip        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📊 Monitoring

### Health Check

Le conteneur inclut un health check automatique :
- **Endpoint** : `http://localhost/`
- **Intervalle** : 30 secondes
- **Timeout** : 10 secondes
- **Retries** : 3 tentatives

### Logs

```bash
# Voir les logs en temps réel
docker-compose logs -f dashboard-intercom

# Voir les logs Nginx
docker exec -it dashboard-intercom_dashboard-intercom_1 tail -f /var/log/nginx/access.log
```

## 🛠️ Dépannage

### Problèmes courants

1. **Erreur de build TypeScript**
   - Vérifiez que toutes les dépendances sont installées
   - Assurez-vous que le code TypeScript compile localement

2. **Problème de CORS**
   - Vérifiez la configuration du proxy dans `proxyService.js`
   - Assurez-vous que l'API Intercom est accessible

3. **Variables d'environnement**
   - Les variables React doivent commencer par `REACT_APP_`
   - Elles sont intégrées au build, pas au runtime

### Commandes utiles

```bash
# Reconstruire l'image
docker-compose build --no-cache

# Accéder au conteneur
docker exec -it dashboard-intercom_dashboard-intercom_1 sh

# Vérifier la configuration Nginx
docker exec -it dashboard-intercom_dashboard-intercom_1 nginx -t

# Redémarrer Nginx
docker exec -it dashboard-intercom_dashboard-intercom_1 nginx -s reload
```

## 📈 Performance

### Optimisations incluses

- **Multi-stage build** : Image finale légère (~25MB)
- **Compression Gzip** : Réduction de la taille des fichiers
- **Cache des assets** : Headers de cache optimisés
- **Serveur statique** : Nginx haute performance

### Métriques

- **Taille de l'image** : ~25MB (Alpine Linux + Nginx)
- **Temps de démarrage** : ~5 secondes
- **Mémoire utilisée** : ~10MB en fonctionnement

## 🔒 Sécurité

- **Utilisateur non-root** dans le conteneur
- **Headers de sécurité** configurés dans Nginx
- **Tokens sensibles** via variables d'environnement
- **Pas de données sensibles** dans l'image Docker
