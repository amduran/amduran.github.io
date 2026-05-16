# Antonio M. Durán-Rosal — Astro + Content Collections

Versión moderna y 100% estática de la web personal académica.

## Qué contiene

- Astro en modo `output: 'static'`.
- Contenido en ficheros JSON dentro de `src/content/*`.
- Content Collections modernas con `src/content.config.ts` y `glob()`.
- Páginas en español e inglés.
- Rutas modernas:
  - `/`
  - `/en/`
  - `/publications/`
  - `/publications/25/`
  - `/conferences/16/`
  - `/teaching/`, `/projects/`, `/background/`, `/outreach/`, `/contact/`
- Redirecciones estáticas para las URLs antiguas tipo `ppublications.html` y `ppublication.html?id=25`.

## Instalar

```bash
npm install
npm run dev
```

## Construir la web estática

```bash
npm run build
npm run preview
```

Astro generará la carpeta `dist/`. Esa es la carpeta que se publica en Cloudflare Pages, Netlify, Vercel, Render Static Sites o GitHub Pages.

## Actualizar contenido

Ya no hay SQL. Edita los ficheros de texto de `src/content/`.

Ejemplo para añadir una publicación:

1. Crea un fichero nuevo:

```text
src/content/papers/026.json
```

2. Añade contenido con esta forma:

```json
{
  "idx": 26,
  "authors": "A.M. Durán-Rosal, ...",
  "title": "Título del nuevo artículo",
  "journal": "Nombre de la revista",
  "volume": "1",
  "year": "2026",
  "pages": "100001",
  "impact": "JCR(2025): ... (Q1)",
  "url": "https://doi.org/...",
  "abstract": "Resumen del artículo",
  "citation": "@article{...}"
}
```

3. Ejecuta:

```bash
npm run build
```

Si publicas desde GitHub conectado a Cloudflare Pages/Netlify/Vercel, basta con hacer `git push`: el proveedor reconstruye la web automáticamente.

## Dónde está cada tipo de contenido

- `src/content/site/profile.json`: datos generales, retrato, email, enlaces.
- `src/content/ui/es.json` y `src/content/ui/en.json`: textos de interfaz.
- `src/content/papers/*.json`: artículos.
- `src/content/conferences/*.json`: congresos.
- `src/content/teaching/*.json`: docencia.
- `src/content/projects/*.json`: proyectos de investigación.
- `src/content/directed_projects/*.json`: TFG/TFM/tesis dirigidas.
- `src/content/teaching_innovation_projects/*.json`: innovación docente.
- `src/content/grants/*.json`: becas/estancias/ayudas.
- `src/content/awards/*.json`: premios.
- `src/content/extra_education/*.json`: formación complementaria.
- `src/content/outreach/*.json`: divulgación y medios.

## CV

El proyecto original enlazaba a `download/cv.pdf`, pero ese PDF no venía incluido. Añádelo aquí:

```text
public/download/cv.pdf
```

## Formulario de contacto

Para mantener la web completamente estática, el formulario usa `mailto:`. Si quieres un formulario real sin servidor, puedes usar Netlify Forms, Formspree, Basin o un endpoint serverless.

## Despliegue recomendado

### Cloudflare Pages / Netlify / Vercel

- Build command: `npm run build`
- Publish directory: `dist`

### GitHub Pages

Incluyo un workflow en `.github/workflows/deploy.yml` como punto de partida. Antes de usar GitHub Pages, revisa `site` en `astro.config.mjs` y cámbialo por tu URL real.
