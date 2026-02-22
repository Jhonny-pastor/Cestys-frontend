# CESTYS Frontend (React + Vite)

Frontend web con:
- pagina principal (`/`)
- autenticacion (`/auth`)
- carrito y checkout simulado (`/cart`)

## Requisitos

- Node.js 18+
- npm

## Instalacion

1. Entrar al frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` (opcional, recomendado):
```bash
echo VITE_API_URL=http://127.0.0.1:8000/api/v1 > .env
```

4. Levantar en desarrollo:
```bash
npm run dev
```

5. Abrir en navegador:
- normalmente `http://localhost:5173`

## Scripts

Desarrollo:
```bash
npm run dev
```

Build:
```bash
npm run build
```

Lint:
```bash
npm run lint
```

Preview de build:
```bash
npm run preview
```

## Estructura principal

- `src/pages/HomePage.jsx`: landing con categorias y cursos
- `src/pages/AuthPage.jsx`: login/register
- `src/pages/CartPage.jsx`: carrito, orden y pago simulado
- `src/services/authApi.js`: auth API
- `src/services/catalogApi.js`: catalogo API
- `src/services/orderApi.js`: carrito/ordenes/pagos API
- `src/components/SiteHeader.jsx` y `src/components/SiteFooter.jsx`

## Flujo funcional

1. Ingresar a `/` (pagina principal).
2. Ir a `/auth` para iniciar sesion o registrarse.
3. Volver a `/` y agregar cursos al carrito.
4. Ir a `/cart`.
5. Ejecutar `Pagar (simulado)`.
6. Ver orden en `PAID` y matricula generada en backend.

## Nota de integracion con backend

El backend debe estar corriendo en:
- `http://127.0.0.1:8000`

Si usas otra URL o puerto, ajusta:
- `VITE_API_URL` en `.env`

