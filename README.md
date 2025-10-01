# Insspira Backend

<p align="center">
  <img src="https://raw.githubusercontent.com/tu_usuario/Insspira/main/logo.png" width="120" alt="Insspira Logo"/>
</p>

<p align="center">
  Backend de **Insspira**, una aplicación de imágenes inspiradoras, similar a Pinterest.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nestjs/core"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version"/></a>
  <a href="https://github.com/tu_usuario/Insspira/actions/workflows/nodejs.yml"><img src="https://img.shields.io/github/actions/workflow/status/tu_usuario/Insspira/nodejs.yml" alt="Build Status"/></a>
  <a href="https://codecov.io/gh/tu_usuario/Insspira"><img src="https://img.shields.io/codecov/c/github/tu_usuario/Insspira" alt="Coverage"/></a>
</p>

---

## 📝 Descripción

Insspira es una plataforma para descubrir y compartir imágenes inspiradoras.  
Los usuarios pueden registrarse, subir imágenes, seguir a otros usuarios y explorar contenido por categorías.

---

## 🚀 Tecnologías

- **NestJS** - Framework escalable de Node.js  
- **PostgreSQL** - Base de datos relacional  
- **TypeORM** - ORM para la gestión de datos  
- **Passport.js** - Autenticación (Google OAuth2)  
- **JWT** - Tokens para rutas privadas  
- **Swagger** - Documentación de la API  
- **Cloudinary** - Gestión de imágenes  
- **MercadoPago & PayPal** - Integración de pagos  
- **Nodemailer** - Envío de correos electrónicos  

---

## ⚙️ Instalación y configuración

1. Clonar el repositorio:

```bash
git clone https://github.com/insspiraproject/Insspira-back.git
code .
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno (.env):

```bash
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
SESSION_SECRET=clave_secreta_para_passport
JWT_SECRET=clave_secreta_jwt
DATABASE_URL=postgres://usuario:password@host:puerto/dbname
```

4. Levantar la app en desarrollo:

```bash
npm run start:dev
```

5. Levantar la app en desarrollo:

```bash
npm run start:prod
```


## 🌐 Endpoints principales (Ejemplos)

Autenticación

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

Respuesta:

```bash
{
  "accessToken": "jwt_token",
  "subscription": {
    "id": "uuid",
    "name": "Free Plan",
    "price": "0.00",
    "type": "free",
    "currency": "ARS",
    "features": "Pin creation limit. Limit of likes per post, saves, and comments.",
    "createdAt": "2025-09-30T21:02:13.918Z"
    }
  }
```

Creación de Imagenes:

```bash
POST /pins
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

Respuesta:

```bash
{
  "id": "uuid",
  "category": {
    "id": "uuid"
  },
  "user": {
    "id": "uuid",
    "post": 0
  },
  "image": "<https://url>",
  "description": "description example",
  "like": 0,
  "comment": 0,
  "hashtag": [
    {
      "id": "uuid",
      "tag": "#example"
    }
  ],
  "date": "2025-10-01T00:27:32.878Z"
}
```


## 📊 Diagrama de flujo básico

```bash
graph TD
  A[Usuario] -->|Login/Register| B[Auth Module]
  B -->|JWT| C[User Module]
  C --> D[Posts Module]
  C --> E[Follow/Unfollow Users]
  D --> F[Cloudinary - Imágenes]
  B --> G[Google OAuth]
```


## 🧪 Testing

```bash
Unitarios: npm run test

E2E: npm run test:e2e

Cobertura: npm run test:cov
```


## 💡 Recursos

```bash
NestJS Documentation

PostgreSQL

Passport.js

Cloudinary
```

## 📄 License

```bash
Insspira Backend está bajo UNLICENSED.
```