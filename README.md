# Maite en Movimiento

Sitio web de Maite en Movimiento, construido con Next.js 16, React 19, TypeScript, Neon Postgres y Drizzle ORM. Incluye una biblioteca pública de guías HTML, SEO dinámico y un panel privado de edición.

## Desarrollo local

1. Instala Node.js 22 y pnpm 11.
2. Copia `.env.example` como `.env.local` y completa las variables.
3. Ejecuta `pnpm install`.
4. Aplica la migración con `pnpm db:migrate`.
5. Crea las guías iniciales con `pnpm db:seed`.
6. Inicia el sitio con `pnpm dev`.

Sin `DATABASE_URL`, el sitio muestra datos demostrativos únicamente en desarrollo. En producción la base es obligatoria.

## Base de datos

Las migraciones versionadas están en `db/migrations/` e incluyen el registro interno de Drizzle. La aplicación acepta una URL Neon con pooler en `DATABASE_URL`; `DIRECT_DATABASE_URL` se usa solo para migraciones. También reconoce `NETLIFY_DATABASE_URL` para compatibilidad con la integración anterior de Neon en Netlify.

## Seguridad del panel

- La contraseña nunca se guarda en texto plano; `pnpm auth:hash` la solicita de forma interactiva y genera el hash y un secreto de sesión.
- La sesión usa una cookie firmada, `HttpOnly`, `SameSite=Strict` y `Secure` en producción.
- Las mutaciones validan el origen y todo HTML se valida y sanitiza al guardar y al mostrar.
- No subas archivos `.env*` ni URLs de conexión al repositorio.

## Verificación

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm build
pnpm test:e2e
```

El endpoint `/api/health` comprueba la conexión real con la base sin revelar credenciales.

## Despliegue

Netlify ejecuta `pnpm build`. Configura en el proyecto:

- `DATABASE_URL`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL=https://maitenmovimiento.cl`
- `RESEND_API_KEY` y `CONTACT_TO_EMAIL` si se activará el correo del formulario.

Aplica las migraciones antes de enviar tráfico a una versión nueva. Comprueba después `/api/health`, una lectura pública y una creación/edición desde `/admin`.
