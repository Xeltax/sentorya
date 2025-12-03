# API Gateway - Spring Boot Kotlin

Backend API migré de Node.js/Express vers Spring Boot avec Kotlin et JPA PostgreSQL.

## Prérequis

- JDK 17+
- PostgreSQL 13+
- Gradle 8.5+

## Configuration

1. Créer une base de données PostgreSQL :
```sql
CREATE DATABASE apigateway;
```

2. Configurer les variables d'environnement (ou modifier `application.yml`) :
```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/apigateway
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export JWT_SECRET=your-secret-key
```

## Lancement

```bash
# Développement
./gradlew bootRun

# Build
./gradlew build

# Exécuter le JAR
java -jar build/libs/api-gateway-1.0.0.jar
```

## Structure du projet

```
src/main/kotlin/com/apigateway/
├── Application.kt              # Point d'entrée
├── config/
│   └── SecurityConfig.kt       # Configuration Spring Security
├── controller/
│   ├── AuthController.kt       # Endpoints d'authentification
│   ├── UserController.kt       # CRUD utilisateurs
│   └── CampaignController.kt   # CRUD campagnes
├── dto/
│   └── DTOs.kt                 # Data Transfer Objects
├── entity/
│   ├── Role.kt                 # Enum des rôles
│   ├── User.kt                 # Entité utilisateur
│   └── Campaign.kt             # Entité campagne
├── exception/
│   ├── Exceptions.kt           # Exceptions personnalisées
│   └── GlobalExceptionHandler.kt
├── repository/
│   ├── UserRepository.kt
│   └── CampaignRepository.kt
├── security/
│   ├── JwtTokenProvider.kt     # Génération/validation JWT
│   └── JwtAuthenticationFilter.kt
└── service/
    ├── AuthService.kt
    ├── UserService.kt
    └── CampaignService.kt
```

## Endpoints API

### Auth
| Méthode | Endpoint      | Description         | Auth |
|---------|---------------|---------------------|------|
| POST    | /auth/login   | Connexion           | Non  |

### Users
| Méthode | Endpoint    | Description           | Auth |
|---------|-------------|-----------------------|------|
| POST    | /user       | Créer un utilisateur  | Non  |
| GET     | /user       | Liste des utilisateurs| Oui  |
| GET     | /user/{id}  | Détail utilisateur    | Oui  |
| PUT     | /user       | Modifier utilisateur  | Oui  |
| DELETE  | /user/{id}  | Supprimer utilisateur | Oui  |

### Campaigns
| Méthode | Endpoint                     | Description              | Auth |
|---------|------------------------------|--------------------------|------|
| POST    | /campaign                    | Créer une campagne       | Non  |
| GET     | /campaign                    | Liste des campagnes      | Oui  |
| GET     | /campaign/{id}               | Détail par ID            | Oui  |
| GET     | /campaign/byCampain/{campId} | Détail par campaignId    | Oui  |
| PUT     | /campaign/{id}               | Modifier campagne        | Oui  |
| PUT     | /campaign/addUser            | Ajouter user à campagne  | Oui  |
| PUT     | /campaign/removeUser         | Retirer user de campagne | Oui  |
| DELETE  | /campaign/{id}               | Supprimer campagne       | Oui  |

## Exemples de requêtes

### Créer un utilisateur
```bash
curl -X POST http://localhost:5000/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123",
    "role": "USER"
  }'
```

### Se connecter
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Accéder à une route protégée
```bash
curl http://localhost:5000/user \
  -H "Authorization: Bearer <token>"
```

## Correspondance avec le backend Node.js original

| Node.js/Prisma          | Spring/Kotlin               |
|-------------------------|-----------------------------|
| Express routes          | @RestController             |
| Prisma Client           | Spring Data JPA             |
| bcrypt                  | BCryptPasswordEncoder       |
| jsonwebtoken            | jjwt                        |
| middleware              | @Component Filter           |
| Prisma schema           | @Entity classes             |
