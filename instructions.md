# Navidad Reviews - Instrucciones para Claude Code

## Objetivo
Crear una aplicación web para que usuarios registrados publiquen reviews de películas navideñas, con sistema de rating general y "navidómetro" (rating navideño). La aplicación debe estar completamente dockerizada y basarse en la estructura del repositorio codeteca.

## Repositorio Base
- GitHub: https://github.com/alancampora/codeteca
- Estructura: client/ server/ common/
- Mejorar y extender esta estructura existente

## Stack Tecnológico

### Frontend (client/)
- React 18+ con TypeScript
- Vite como bundler
- React Router v6 para navegación
- TailwindCSS para estilos
- Axios para HTTP requests
- React Query para manejo de datos
- Context API para estado de autenticación

### Backend (server/)
- Node.js 20+ con TypeScript
- Express.js
- MongoDB con Mongoose
- JWT para autenticación (HttpOnly cookies)
- bcrypt para hash de passwords
- express-validator para validación
- helmet para security headers
- express-rate-limit para rate limiting
- cors configurado correctamente

### Común (common/)
- Interfaces TypeScript compartidas
- Tipos para User, Movie, Review
- Constantes y validaciones compartidas

### Docker
- Dockerfile para client (multi-stage build con Nginx)
- Dockerfile para server (multi-stage build)
- docker-compose.yml para desarrollo (con hot reload)
- docker-compose.prod.yml para producción
- Container para MongoDB
- Volúmenes para persistencia de datos
- Health checks en todos los servicios

## Modelos de Datos

### User
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  password: string; // hasheado con bcrypt
  createdAt: Date;
  updatedAt: Date;
}
```

### Movie
```typescript
interface Movie {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
  synopsis: string;
  director: string;
  averageRating: number; // Promedio de ratings de calidad (1-5)
  christmasRating: number; // 🎄 NAVIDÓMETRO - Promedio de ratings navideños (1-5)
  isKidFriendly: boolean; // 🎅 Indica si mantiene la magia navideña (no revela que Papá Noel no existe)
  reviewCount: number;
  christmasVotes: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Review
```typescript
interface Review {
  id: string;
  movieId: string;
  userId: string;
  rating: number; // Rating de calidad general (1-5)
  christmasRating: number; // 🎄 Voto del navidómetro (1-5)
  comment: string; // Entre 10 y 1000 caracteres
  createdAt: Date;
  updatedAt: Date;
  user?: {
    username: string;
  };
  movie?: {
    title: string;
  };
}
```

## Funcionalidades Requeridas

### Públicas (sin autenticación)
1. **Página Principal**
   - Grid de películas navideñas con cards
   - Cada card muestra:
     - Poster de la película
     - Título y año
     - ⭐ Rating de calidad (promedio)
     - 🎄 Navidómetro (promedio)
     - 👶 Badge "Mantiene la magia" si isKidFriendly === true
     - Cantidad de reviews
   - Filtros:
     - Por año
     - Por rating mínimo
     - Por navidómetro mínimo
     - Solo "Aptas para chicos"
     - Ordenar por: rating, navidómetro, año, más recientes
   - Búsqueda por título
   - Click en card lleva a página de detalle

2. **Página de Detalle de Película**
   - Toda la información de la película
   - Sinopsis completa
   - Ratings y navidómetro
   - Lista de reviews (paginada)
   - Botón "Agregar Review" (redirige a login si no está autenticado)

3. **Registro de Usuario**
   - Formulario con email, username, password, confirmar password
   - Validaciones:
     - Email válido y único
     - Username único, mínimo 3 caracteres
     - Password mínimo 8 caracteres
   - Mensaje de error claro

4. **Login de Usuario**
   - Formulario con email/username y password
   - Opción "Recordarme" para refresh token de 7 días
   - Mensaje de error claro
   - Redirección a página anterior después del login

### Privadas (requieren autenticación)
5. **Agregar Review**
   - Formulario con:
     - Rating de calidad (1-5 estrellas)
     - Navidómetro (1-5 árboles/copos de nieve)
     - Comentario (textarea, 10-1000 caracteres)
   - Validaciones en frontend y backend
   - Un usuario solo puede dejar una review por película
   - Si ya existe review, mostrar opción de editar

6. **Editar Review**
   - Solo puede editar sus propias reviews
   - Mismo formulario que agregar
   - Guardar cambios actualiza updatedAt

7. **Eliminar Review**
   - Solo puede eliminar sus propias reviews
   - Confirmación antes de eliminar
   - Actualiza los promedios de la película

8. **Perfil de Usuario**
   - Ver todas mis reviews
   - Cantidad total de reviews
   - Link a cada película revieweada

9. **Logout**
   - Limpia cookies
   - Redirige a home

## API Endpoints

### Auth
- POST /api/auth/register - Registro de usuario
- POST /api/auth/login - Login (retorna HttpOnly cookie con JWT)
- POST /api/auth/logout - Logout (limpia cookie)
- GET /api/auth/me - Obtener usuario actual (con JWT)
- POST /api/auth/refresh - Refresh token

### Movies
- GET /api/movies - Listar películas (con filtros y paginación)
- GET /api/movies/:id - Detalle de película
- POST /api/movies - Crear película (solo admin - opcional)
- PUT /api/movies/:id - Actualizar película (solo admin - opcional)
- DELETE /api/movies/:id - Eliminar película (solo admin - opcional)

### Reviews
- GET /api/reviews - Listar reviews (con filtros y paginación)
- GET /api/reviews/movie/:movieId - Reviews de una película
- GET /api/reviews/user/:userId - Reviews de un usuario
- GET /api/reviews/:id - Detalle de review
- POST /api/reviews - Crear review (requiere auth)
- PUT /api/reviews/:id - Actualizar review (requiere auth + ownership)
- DELETE /api/reviews/:id - Eliminar review (requiere auth + ownership)

## Seguridad

### Autenticación
- JWT almacenado en HttpOnly cookies (prevenir XSS)
- Access token: 15 minutos
- Refresh token: 7 días (opcional)
- Passwords hasheados con bcrypt (salt rounds: 12)

### Protección de Backend
- Helmet.js para security headers
- CORS configurado correctamente
- Rate limiting: 100 requests por 15 minutos por IP
- Validación de inputs con express-validator
- Sanitización de datos
- Queries de MongoDB parametrizadas (Mongoose)
- Protección contra NoSQL injection

### Validaciones
- Frontend: validación antes de submit
- Backend: validación de todos los inputs
- Mensajes de error claros pero no revelan info sensible

## Docker Setup

### Estructura de Archivos Docker
```
/client/
  - Dockerfile
  - .dockerignore
  - nginx.conf
/server/
  - Dockerfile
  - .dockerignore
/docker-compose.yml
/docker-compose.prod.yml
/.env.example
```

### Dockerfile Client (Multi-stage)
1. **Build stage**: Node Alpine, instalar deps, build con Vite
2. **Production stage**: Nginx Alpine, copiar build, configurar nginx
3. Health check endpoint
4. Gzip compression habilitado
5. Security headers configurados

### Dockerfile Server (Multi-stage)
1. **Build stage**: Node Alpine, instalar deps, compilar TypeScript
2. **Production stage**: Node Alpine, copiar dist y node_modules
3. Usuario no-root (nodejs)
4. Health check endpoint (/api/health)
5. Variables de entorno para configuración

### docker-compose.yml (Desarrollo)
- Service: client
  - Build desde ./client
  - Port: 5173 (Vite dev server)
  - Volumes: código source para hot reload
  - Depends on: server
  
- Service: server
  - Build desde ./server
  - Port: 3000
  - Volumes: código source para hot reload
  - Environment: NODE_ENV=development
  - Depends on: mongodb
  - Health check configurado
  
- Service: mongodb
  - Image: mongo:7-alpine
  - Port: 27017
  - Volume: mongo-data para persistencia
  - Environment: credenciales de MongoDB
  - Health check configurado

- Networks: red compartida
- Volumes: mongo-data

### docker-compose.prod.yml (Producción)
- Service: client
  - Build optimizado (sin source maps)
  - Nginx sirviendo build estático
  - Port: 80
  - Resource limits configurados
  
- Service: server
  - Build optimizado
  - Environment: NODE_ENV=production
  - Resource limits configurados
  - Health check configurado
  
- Service: mongodb
  - Credenciales seguras desde .env
  - Volume para backup
  - Resource limits configurados

### Variables de Entorno (.env.example)
```bash
# Server
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/navidad-reviews
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=change-this-password
MONGO_INITDB_DATABASE=navidad-reviews

# Client
VITE_API_URL=http://localhost:3000/api

# Production overrides
# VITE_API_URL=https://your-domain.com/api
```

## Seed Data

Incluir mínimo 10 películas navideñas en el seed:
1. Mi Pobre Angelito (Home Alone) - 1990
   - christmasRating: 4.8
   - isKidFriendly: true
   
2. El Grinch (How the Grinch Stole Christmas) - 2000
   - christmasRating: 4.5
   - isKidFriendly: true
   
3. Elf - 2003
   - christmasRating: 4.7
   - isKidFriendly: true
   
4. The Nightmare Before Christmas - 1993
   - christmasRating: 4.6
   - isKidFriendly: true
   
5. Love Actually - 2003
   - christmasRating: 4.3
   - isKidFriendly: true
   
6. Bad Santa - 2003
   - christmasRating: 3.2
   - isKidFriendly: false (⚠️ revela que Santa no existe)
   
7. Klaus - 2019
   - christmasRating: 4.9
   - isKidFriendly: true
   
8. Jingle All the Way - 1996
   - christmasRating: 4.1
   - isKidFriendly: true
   
9. The Polar Express - 2004
   - christmasRating: 4.5
   - isKidFriendly: true
   
10. Die Hard - 1988
    - christmasRating: 2.8 (debatible si es navideña)
    - isKidFriendly: false

Script de seed en /server/src/seed.ts que:
- Limpia la base de datos
- Inserta películas
- Crea usuario de prueba
- Crea algunas reviews de ejemplo

## UI/UX Requerimientos

### Tema Navideño
- Paleta de colores: rojos, verdes, blancos, dorados
- Iconos: 🎄 🎅 ⭐ 🎁 ❄️
- Fonts: festivas pero legibles
- Animaciones sutiles (copos de nieve opcional)

### Responsive
- Mobile-first
- Breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- Grid de películas: 1 columna mobile, 2-3 tablet, 4-5 desktop

### Componentes Clave
- Navbar con logo, búsqueda, login/logout
- MovieCard componente reutilizable
- ReviewCard componente
- RatingStars componente (para mostrar y seleccionar)
- ChristmasRating componente (árboles o copos de nieve)
- FormInput componentes con validación
- Loading states
- Error boundaries
- Toast notifications para feedback

### Navegación
- / - Home (listado de películas)
- /movie/:id - Detalle de película
- /login - Login
- /register - Registro
- /profile - Perfil del usuario (privado)
- /movie/:id/review - Agregar/editar review (privado)

## Comandos Docker

### Desarrollo
```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Rebuild después de cambios
docker-compose up -d --build

# Bajar servicios
docker-compose down

# Limpiar todo (incluyendo volúmenes)
docker-compose down -v
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
```

### Útiles
```bash
# Ejecutar seed
docker-compose exec server npm run seed

# Acceder a MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password

# Backup de MongoDB
docker-compose exec mongodb mongodump --out=/data/backup

# Ver uso de recursos
docker stats
```

## Testing (Opcional pero Recomendado)

### Backend
- Jest + Supertest para integration tests
- Tests de endpoints de API
- Tests de autenticación
- Tests de validaciones

### Frontend
- Vitest + React Testing Library
- Tests de componentes
- Tests de navegación
- Tests de formularios

## README.md

Incluir:
- Descripción del proyecto
- Features principales
- Stack tecnológico
- Requisitos (Docker, Node)
- Instrucciones de instalación
- Comandos de Docker
- Variables de entorno
- Estructura del proyecto
- Endpoints de API
- Screenshots (opcional)
- Créditos

## Mejoras sobre codeteca

1. **Seguridad mejorada**
   - HttpOnly cookies en lugar de localStorage
   - Rate limiting
   - Helmet para security headers
   - Validación exhaustiva
   
2. **Docker optimizado**
   - Multi-stage builds
   - Health checks
   - Resource limits en producción
   - Hot reload en desarrollo
   
3. **Código más limpio**
   - Mejor separación de concerns
   - Middleware organizados
   - Controladores separados
   - Servicios reutilizables
   
4. **Mejor manejo de errores**
   - Error handling centralizado
   - Mensajes de error claros
   - Logging apropiado
   
5. **TypeScript estricto**
   - Types compartidos en /common
   - No usar 'any'
   - Interfaces bien definidas

## Notas Importantes

- Todos los archivos deben tener comentarios explicativos
- Código debe seguir principios SOLID
- Commits con mensajes descriptivos
- No hardcodear valores sensibles
- Usar variables de entorno
- Código debe ser maintainable y escalable
- Seguir convenciones de naming
- Agregar .gitignore completo
- Documentar decisiones de diseño importantes

## Criterios de Éxito

El proyecto está completo cuando:
1. ✅ Se puede levantar con docker-compose up
2. ✅ Un usuario puede registrarse
3. ✅ Un usuario puede loguearse
4. ✅ Un usuario puede ver películas sin login
5. ✅ Un usuario logueado puede agregar review con rating y navidómetro
6. ✅ Los promedios se actualizan correctamente
7. ✅ Los filtros funcionan
8. ✅ La búsqueda funciona
9. ✅ El badge "Mantiene la magia" aparece en películas kid-friendly
10. ✅ Hot reload funciona en desarrollo
11. ✅ Build de producción es optimizado
12. ✅ Todos los health checks pasan
13. ✅ No hay errores en consola
14. ✅ La UI es responsive
15. ✅ El código está limpio y documentado

---

## Ejecución con Claude Code

Guardar este archivo como `instructions.md` y ejecutar:

```bash
claude code --instructions instructions.md --repo /path/to/codeteca
```

O si se quiere crear desde cero:

```bash
mkdir navidad-reviews
cd navidad-reviews
claude code --instructions instructions.md
```

¡Éxito! 🎄🎅
