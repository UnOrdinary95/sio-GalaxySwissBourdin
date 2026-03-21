---
name: swagger-maintenance
description: How to properly add or modify endpoints in apps/backend/src/docs/swagger.yaml
---

# Swagger Documentation Maintenance

This skill describes the exact process for adding or modifying API endpoints in `apps/backend/src/docs/swagger.yaml`.

## Prerequisite: Error Source Analysis

Before writing any Swagger response, you **MUST** trace the error chain for each endpoint:

```
Route → Middleware(s) → Controller → Service → Repository → errorHandler
```

Read all files in this chain to identify every possible error.

---

## Error Source Legend

The centralized error handler (`apps/backend/src/middlewares/errorHandler.ts`) translates errors into HTTP responses. Here is the complete mapping for this project:

| #   | Source                   | Thrown by                                                  | HTTP Code    | Message                                                          |
| --- | ------------------------ | ---------------------------------------------------------- | ------------ | ---------------------------------------------------------------- |
| 1   | AppError (ConflictError) | Repository on unique constraint violation (PG code 23505)  | **409**      | Explicit message (e.g., "Un visiteur avec ce login existe déjà") |
| 2   | AppError (NotFoundError) | Repository on foreign key / missing record (PG code 23503) | **404**      | Explicit message (e.g., "Ressource liée introuvable")            |
| 3   | AppError (DatabaseError) | Repository fallback for other PG errors                    | **500**      | "Erreur base de données"                                         |
| 4   | AppError (generic)       | Controller/Service explicit throw                          | **Variable** | Variable (explicit message)                                      |
| —   | errorHandler fallback    | Uncaught errors                                            | **500**      | "Une erreur interne est survenue"                                |

### Middleware errors (respond directly, NOT routed through errorHandler)

| Middleware       | HTTP Code | Response Format                                         |
| ---------------- | --------- | ------------------------------------------------------- |
| `validateBody()` | **400**   | `{ success: false, errors: { fieldName: [string[]] } }` |

---

## Step-by-step Process

### 1. Identify the middleware chain

Check the route file (`routes/*Router.ts`) to know which middlewares are applied:

- `validateBody(schema)` → validates request body with Zod, returns 400 on failure
- Other custom middlewares → check their error behavior

### 2. Read the controller

Each `await service()` call can throw AppError.
Check if the controller has `try/catch` (it should pass errors to errorHandler via `next(error)`).

### 3. Read the service

Each service function can throw AppError from the repository.
Services typically do NOT have try/catch; errors bubble up.

### 4. Read the repository

Each database operation can throw AppError via `mapDatabaseError()`:

- PG code `23505` (unique constraint) → `ConflictError` (409)
- PG code `23503` (foreign key) → `NotFoundError` (404)
- Other PG errors → `DatabaseError` (500)

Check the actual schema (`docker/init-db/init_db.sql`) for unique constraints.

### 5. Read the Zod schema

Check exact field validations to write accurate error message examples.
Example: `.max(20)` → "Le login ne doit pas dépasser 20 caractères."

### 6. Write the Swagger responses

For each endpoint, list **only** the error codes that are actually reachable:

- Use `$ref` to reusable examples in `components/examples/`
- Do NOT invent error codes that cannot happen
- Check the database schema to know which fields have unique constraints

---

## Swagger Structure Rules

### Reusable examples

All error examples must be defined in `components/examples/` and referenced via `$ref`.
Naming convention: `Err` + Source + Context (e.g., `ErrZodLogin`, `ErrConflictVisiteur`, `ErrDatabaseInternal`).

### Endpoint description

Always include a `**Middlewares:**` line in the endpoint `description` field listing the middleware chain.

Example:

```
"Crée un nouveau compte visiteur. **Middlewares:** validateBody(registerInputSchema)"
```

### Response format

All API responses follow one of two shapes:

**Success** (`makeSuccess`):

```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

**Error (from errorHandler or Zod middleware)**:

```json
{
    "success": false,
    "message": "...",
    "errors": { "field1": ["error1"], "field2": ["error2"] }
}
```

Note: `errors` is present only when thrown by Zod middleware. Errors from controllers/services use `message`.

### Grouping

Endpoints are grouped by tag (example: `Auth`, `Doctors`, `Reports`).

---

## Common Mistakes to Avoid

1. **Adding a 409 where no unique constraint exists** — Check `docker/init-db/init_db.sql` for unique constraints
2. **Forgetting 400 Zod errors** — Every route with `validateBody()` can return 400
3. **Writing generic error messages** — Always use the **exact** message from the code
4. **Documenting unreachable error codes** — Trace the actual code flow before inventing errors
5. **Forgetting middleware chain in description** — Every endpoint description must list its middlewares
6. **Not centralizing examples in components** — All error response examples must be in `components/examples/`

---

## Checklist Before Committing

- [ ] I traced the complete error chain (route → middleware → controller → service → repository)
- [ ] I only documented HTTP codes that are actually reachable
- [ ] I added all examples to `components/examples/` and used `$ref`
- [ ] I included `**Middlewares:**` in the endpoint description
- [ ] I verified error messages match the actual code (word-for-word)
- [ ] I checked the database schema for unique/foreign key constraints
- [ ] I verified the response format matches `makeSuccess()` / `makeError()` / Zod middleware output
