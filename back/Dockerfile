# Dockerfile pour Backend Kotlin/Spring Boot
FROM gradle:8.5-jdk17 AS build

WORKDIR /app

# Copier les fichiers de configuration Gradle
COPY gradle gradle
#COPY gradlew .
COPY settings.gradle.kts .
COPY gradle.properties .
COPY build.gradle.kts .

# Télécharger les dépendances
RUN for i in 1 2 3 4 5; do \
    gradle dependencies --no-daemon && break || sleep 10; \
    done

# Copier le code source
COPY src src

# Build de l'application
RUN gradle build -x test --no-daemon

# Image de production
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copier le JAR depuis l'étape de build
COPY --from=build /app/build/libs/*.jar app.jar

# Exposer le port
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/actuator/health || exit 1

# Démarrer l'application
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", \
    "app.jar"]