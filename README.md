# AndinaTrading

Proyecto de simulación bursátil desarrollado con Java y Spring Boot. El código organiza las acciones, las empresas y los usuarios en modelos de dominio y separa la simulación de los controladores de acciones y usuarios.

## Recorrido por el código

- [Simulación](src/main/java/com/andina/trading/controller/SimulacionController.java). Punto de entrada para seguir la lógica de una simulación.
- [Acciones](src/main/java/com/andina/trading/controller/AccionController.java) y [usuarios](src/main/java/com/andina/trading/controller/UsuariosController.java). Controladores de cada recurso.
- [Modelo de dominio](src/main/java/com/andina/trading/model). Incluye las entidades de acción, empresa y usuario, así como la relación entre usuarios y empresas.
- [Configuración de Maven](pom.xml). Declara las dependencias y los complementos utilizados para construir la aplicación.

## Ejecutar en local

Con Java 21, Maven 3.9 y Node.js 24 instalados, ejecuta desde la raíz del proyecto:

```sh
npm --prefix frontend ci
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Abre http://127.0.0.1:18080/ y crea una cuenta de inversionista con saldo ficticio. El perfil local guarda la base H2 en `.local/` y carga cotizaciones de ejemplo para AAPL, MSFT y NVDA. La simulación sin clave de mercado usa el último precio guardado.

Para comprobar la compilación y las pruebas con una base temporal:

```sh
mvn clean verify -Dspring.profiles.active=local '-Dspring.datasource.url=jdbc:h2:mem:andinatest;MODE=MySQL'
```

Las vistas se editan en `frontend/src/pages`. Maven compila Astro y Tailwind antes de cargar los recursos de Spring. En Resumen y Mercado, el gráfico recibe operaciones de BTC/USD y ETH/USD desde el WebSocket público de Coinbase. Las acciones muestran el historial guardado en la plataforma, consultado cada diez segundos.

## Demo del portafolio

[Desplegar en Render](https://render.com/deploy?repo=https://github.com/Danniel0663/AndinaTrading/tree/codex/portfolio-deploy). El contenedor reúne el frontend compilado y Spring Boot. El perfil `portfolio` crea su propia base H2 en memoria y carga cotizaciones de muestra. Las cuentas y operaciones son temporales. El directorio administrativo solo está disponible en el entorno privado.
