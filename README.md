# Backend

<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="NestJS Logo" />
  </a>
</p>

<p align="center">
  Backend desarrollado con <a href="https://nestjs.com/" target="_blank">NestJS</a>, un framework progresivo para Node.js que permite construir aplicaciones del lado servidor de forma eficiente y escalable.
</p>

<p align="center">
  <strong>Base de datos:</strong> PostgreSQL, un sistema de gestión de bases de datos relacional potente y confiable.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="License" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI Build" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

---

## Tecnologías principales

- **NestJS:** Framework para Node.js basado en TypeScript, que facilita la creación de aplicaciones escalables y mantenibles.
- **PostgreSQL:** Sistema de gestión de base de datos relacional para almacenar y administrar los datos de la aplicación.
- **Docker & Docker Compose:** Para la orquestación y ejecución de servicios, como la base de datos.

---

## ¿Cómo ejecutar el proyecto?

1. Solicitar el archivo `.env` para la configuración de variables de entorno.
2. Asegurarse de tener Docker instalado.
3. Levantar los servicios necesarios (por ahora solo la base de datos PostgreSQL) con Docker Compose:

```bash
docker-compose up -d
```

Luego correr la app con 
```bash
npm run start
```

## ¿Como probar la api?
## Swagger.



### Para Swagger:
Se utilizo Swagger. Swagger UI es una herramienta que permite visualizar y probar APIs de manera interactiva a través de una interfaz web. Aquí tienes una guía precisa para utilizar Swagger UI para hacer pruebas:

1. Acceder a Swagger UI
URL: Accede a la URL http://localhost:4000/api/docs.