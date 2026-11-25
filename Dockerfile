FROM node:24-bookworm-slim AS web
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src/ src/
COPY --from=web /app/target/generated-resources/astro/ target/generated-resources/astro/
RUN mvn -B -Dexec.skip=true -Dspring.profiles.active=local "-Dspring.datasource.url=jdbc:h2:mem:build;MODE=MySQL" package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/AndinaTrading-*.jar app.jar
USER 10001
ENV SPRING_PROFILES_ACTIVE=portfolio
EXPOSE 10000
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=60", "-jar", "/app/app.jar"]
