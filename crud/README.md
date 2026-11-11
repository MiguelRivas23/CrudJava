# CRUD de Personas — Spring Boot + Angular + H2

Persona: `id`, `nombre`, `edad`. Permite agregar, editar, eliminar y buscar por nombre.

## Requisitos
- Java 17+ y Maven
- Node.js 18.19+ (o 20+) y npm

## 1. Backend (puerto 8080)
```bash
cd backend
mvn spring-boot:run
```
- API: `http://localhost:8080/api/personas`
- Consola H2: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/personasdb`
  - Usuario: `sa` — Contraseña: (vacía)
- Los datos se guardan en `backend/data/` y persisten al reiniciar.

## 2. Frontend (puerto 4200)
```bash
cd frontend
npm install
npm start
```
Abre `http://localhost:4200`.

## Endpoints
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/personas` | Lista todas |
| GET | `/api/personas?nombre=ana` | Busca por nombre (contiene, sin distinguir mayúsculas) |
| GET | `/api/personas/{id}` | Obtiene una |
| POST | `/api/personas` | Crea (`{"nombre":"Ana","edad":30}`) |
| PUT | `/api/personas/{id}` | Edita |
| DELETE | `/api/personas/{id}` | Elimina |

## Estructura
```
crud/
├── backend/   (Spring Boot: model, repository, controller)
└── frontend/  (Angular 18 standalone: servicio + componente)
```
