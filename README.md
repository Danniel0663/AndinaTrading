# AndinaTrading

Proyecto de simulación bursátil desarrollado con Java y Spring Boot. El código organiza las acciones, las empresas y los usuarios en modelos de dominio y separa la simulación de los controladores de acciones y usuarios.

## Recorrido por el código

- [Simulación](src/main/java/com/andina/trading/controller/SimulacionController.java). Punto de entrada para seguir la lógica de una simulación.
- [Acciones](src/main/java/com/andina/trading/controller/AccionController.java) y [usuarios](src/main/java/com/andina/trading/controller/UsuariosController.java). Controladores de cada recurso.
- [Modelo de dominio](src/main/java/com/andina/trading/model). Incluye las entidades de acción, empresa y usuario, así como la relación entre usuarios y empresas.
- [Configuración de Maven](pom.xml). Declara las dependencias y los complementos utilizados para construir la aplicación.
