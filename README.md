# 🎄 Navidad Reviews - Christmas Movies Review Platform

Una aplicación web para reseñar y descubrir películas navideñas, con sistema de rating de calidad y "Navidómetro" especial para medir el espíritu navideño.

## ✨ Características Principales

- 🎬 **Catálogo de Películas Navideñas**: Explora más de 10 películas navideñas clásicas
- ⭐ **Sistema Dual de Rating**:
  - Rating de calidad (1-5 estrellas)
  - 🎄 Navidómetro: rating de espíritu navideño (1-5 árboles)
- 👶 **Badge "Mantiene la Magia"**: Indica películas aptas para niños que preservan la magia navideña
- 🔍 **Búsqueda y Filtros Avanzados**: Por año, rating, navidómetro, y películas aptas para chicos
- 📝 **Sistema de Reviews**: Los usuarios registrados pueden agregar, editar y eliminar sus reviews
- 🔐 **Autenticación Segura**: JWT en HttpOnly cookies con Google OAuth opcional
- 🐳 **Completamente Dockerizado**: Desarrollo y producción con Docker Compose

## 🛠 Stack Tecnológico

### Frontend
- **React 18+** con TypeScript
- **Vite** como bundler
- **React Router v7** para navegación
- **TailwindCSS** para estilos
- **React Query** para manejo de datos
- **shadcn/ui** para componentes UI

### Backend
- **Node.js 20+** con TypeScript
- **Express.js** framework
- **MongoDB** con Mongoose
- **JWT** para autenticación (HttpOnly cookies)
- **bcrypt** para hash de passwords
- **Helmet** y **express-rate-limit** para seguridad
- **express-validator** para validación

### DevOps
- **Docker** y **Docker Compose**
- **Nginx** para servir el frontend en producción
- Multi-stage builds optimizados
- Health checks configurados

## 📋 Requisitos Previos

- **MongoDB Atlas Account** (free tier available)
- **Docker** y **Docker Compose** instalados
- **Node.js 20+** (solo para desarrollo local sin Docker)
- **npm** o **yarn**

## 🗄️ Configuración de MongoDB Atlas

Esta aplicación usa **MongoDB Atlas** como base de datos. Sigue estos pasos:

1. **Crear cuenta en MongoDB Atlas**
   - Ve a https://cloud.mongodb.com/
   - Crea una cuenta gratuita (si no tienes una)

2. **Crear un Cluster**
   - Crea un nuevo cluster (el tier gratuito M0 es suficiente)
   - Espera a que el cluster se provisione (2-5 minutos)

3. **Configurar acceso a la base de datos**
   - Ve a "Database Access" y crea un usuario de base de datos
   - Guarda el username y password de forma segura
   - Ve a "Network Access" y agrega tu IP (o 0.0.0.0/0 para acceso desde cualquier lugar)

4. **Obtener Connection String**
   - Click en "Connect" en tu cluster
   - Selecciona "Connect your application"
   - Copia el connection string (se verá como: `mongodb+srv://...`)
   - Reemplaza `<password>` con tu password real
   - Reemplaza `<dbname>` con `navidad-reviews`

## 🚀 Instalación y Uso

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd true-believers
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tu MongoDB Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/navidad-reviews?retryWrites=true&w=majority
```

3. **Levantar servicios de desarrollo**
```bash
docker-compose up -d
```

4. **Poblar la base de datos con datos de prueba**
```bash
docker-compose exec server npm run seed
```

5. **Acceder a la aplicación**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Health check: http://localhost:3000/api/health

### Opción 2: Desarrollo Local (Sin Docker)

1. **Configurar MongoDB Atlas** (ver sección anterior)

2. **Instalar dependencias**
```bash
npm install
cd client && npm install
cd ../server && npm install
cd ../common && npm install
```

3. **Compilar common**
```bash
cd common && npm run build
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
```
Edita `.env` con tu MongoDB Atlas connection string

5. **Iniciar servicios**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

6. **Poblar base de datos**
```bash
cd server
npm run seed
```

## 🐳 Comandos Docker

### Desarrollo

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f server

# Rebuild después de cambios
docker-compose up -d --build

# Bajar servicios
docker-compose down

# Limpiar todo (incluyendo volúmenes)
docker-compose down -v

# Ejecutar seed
docker-compose exec server npm run seed

# Acceder a MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123
```

### Producción

```bash
# Levantar con configuración de producción
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Rebuild
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate

# Bajar servicios
docker-compose -f docker-compose.prod.yml down

# Backup de MongoDB
docker-compose -f docker-compose.prod.yml exec mongodb mongodump --out=/data/backup
```

## 📁 Estructura del Proyecto

```
true-believers/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # React components
│   │   ├── context/       # React contexts
│   │   ├── pages/         # Page components
│   │   └── ...
│   ├── Dockerfile
│   └── nginx.conf
├── server/                # Backend Express
│   ├── src/
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── scripts/      # Utility scripts (seed, etc.)
│   │   └── index.ts      # Entry point
│   └── Dockerfile
├── common/                # Shared TypeScript types
│   └── src/
├── docker-compose.yml     # Development compose
├── docker-compose.prod.yml # Production compose
└── .env.example          # Environment variables template
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuario actual

### Movies
- `GET /api/movies` - Listar películas (con filtros y paginación)
- `GET /api/movies/:id` - Detalle de película
- `POST /api/movies` - Crear película (admin)
- `PUT /api/movies/:id` - Actualizar película (admin)
- `DELETE /api/movies/:id` - Eliminar película (admin)

### Reviews
- `GET /api/reviews` - Listar reviews
- `GET /api/reviews/movie/:movieId` - Reviews de una película
- `GET /api/reviews/user/:userId` - Reviews de un usuario
- `GET /api/reviews/:id` - Detalle de review
- `POST /api/reviews` - Crear review (requiere auth)
- `PUT /api/reviews/:id` - Actualizar review (requiere auth + ownership)
- `DELETE /api/reviews/:id` - Eliminar review (requiere auth + ownership)

## 👤 Usuarios de Prueba

Después de ejecutar el seed, puedes usar estos usuarios:

- **Email:** user1@test.com | **Password:** password123 | **Username:** ChristmasFan
- **Email:** user2@test.com | **Password:** password123 | **Username:** MovieCritic
- **Email:** admin@test.com | **Password:** password123 | **Username:** Admin

## 🎬 Películas Incluidas

El seed incluye 10 películas navideñas clásicas:
1. Mi Pobre Angelito (Home Alone) - 1990
2. El Grinch - 2000
3. Elf - 2003
4. The Nightmare Before Christmas - 1993
5. Love Actually - 2003
6. Bad Santa - 2003 ⚠️
7. Klaus - 2019
8. Jingle All the Way - 1996
9. The Polar Express - 2004
10. Die Hard - 1988

## 🔒 Seguridad

- JWT en HttpOnly cookies (previene XSS)
- Passwords hasheados con bcrypt (salt rounds: 10)
- Helmet.js para security headers
- Rate limiting: 100 requests por 15 minutos
- CORS configurado correctamente
- Validación exhaustiva con express-validator
- Queries parametrizadas (Mongoose)

## 🌟 Características Especiales

- **Navidómetro**: Sistema único de rating para medir el espíritu navideño
- **Badge "Mantiene la Magia"**: Indica películas que no revelan que Santa no existe
- **Búsqueda de texto completo**: Con índice en MongoDB
- **Responsive design**: Mobile-first con TailwindCSS
- **Hot reload** en desarrollo con volumes de Docker
- **Health checks** en todos los servicios

## 📝 Variables de Entorno

Ver `.env.example` para todas las variables disponibles. Las más importantes:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/navidad-reviews?retryWrites=true&w=majority

# JWT (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret

# URLs
FE_URI=http://localhost:5173
VITE_API_URL=http://localhost:3000/api
```

## 🐛 Troubleshooting

### El servidor no se conecta a MongoDB Atlas
- Verificar que el connection string en `.env` sea correcto
- Asegurarse de haber reemplazado `<password>` con tu password real
- Verificar que tu IP esté en la whitelist de MongoDB Atlas (Network Access)
- Revisar logs: `docker-compose logs server`

### Error: "IP not whitelisted"
- Ve a MongoDB Atlas → Network Access
- Agrega tu IP actual o usa `0.0.0.0/0` para permitir todas las IPs (solo para desarrollo)

### El cliente no se conecta al servidor
- Verificar que `VITE_API_URL` esté configurado correctamente
- Verificar que el servidor esté corriendo: `docker-compose logs server`
- Verificar CORS en el servidor

### Errores al compilar common
```bash
cd common && npm run build
```

### Error al hacer seed
- Asegurarse de que el servidor pueda conectarse a MongoDB Atlas primero
- Verificar los logs del servidor para ver errores de conexión

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia ISC.

## 🎅 Créditos

Desarrollado con ❤️ y ☕ para la temporada navideña 🎄

---

**¡Felices fiestas y feliz coding!** 🎄✨
