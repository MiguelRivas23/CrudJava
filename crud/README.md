# CRUD Departamentos y Municipios — Spring Boot + Angular + Oracle (JWT)

- `departamento` (id, nombre) 1 → N `municipio` (id, nombre, departamento_id)
- `usuarios` (id, username, password cifrada con BCrypt)
- Login con JWT: usuario `admin`, contraseña `pass`

## Requisitos
- Java 17+ y Maven
- Node.js 18.19+ (o 20+) y npm
- Oracle Database (XE 18c/21c u otra) en `localhost:1521`

## 1. Base de datos Oracle
Ejecuta `oracle/crear_crud_db.sql` (paso 1 como SYSTEM, paso 2 como `crud_db`).
Ajusta la URL en `backend/src/main/resources/application.properties` si tu servicio no es `XEPDB1`.

## 2. Backend (puerto 8080)
```bash
cd backend
mvn spring-boot:run
```
La primera vez crea el usuario `admin` (con la contraseña `pass` guardada como hash BCrypt).

## 3. Frontend (puerto 4200)
```bash
cd frontend
npm install
npm start
```
Abre `http://localhost:4200` e inicia sesión con `admin` / `pass`.

## Endpoints (requieren `Authorization: Bearer <token>`)
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/auth/login` | Devuelve el token (público) |
| GET | `/api/departamentos` | Lista (con `?nombre=` para buscar) |
| GET | `/api/departamentos/{id}` | Obtiene uno |
| POST | `/api/departamentos` | Crea `{"nombre":"..","municipios":[{"nombre":".."}]}` |
| PUT | `/api/departamentos/{id}` | Edita departamento y sus municipios |
| DELETE | `/api/departamentos/{id}` | Elimina (y sus municipios) |
