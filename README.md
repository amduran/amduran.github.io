# Antonio M. Durán-Rosal — Academic Website

[![Deploy to GitHub Pages](https://github.com/amduran/amduran.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/amduran/amduran.github.io/actions/workflows/deploy.yml)

Repositorio de la web académica personal de **Antonio M. Durán-Rosal**, desarrollada con **Astro** y publicada como sitio estático en **GitHub Pages**.

Sitio publicado:

```text
https://amduran.github.io/
```

---

## Descripción

Este proyecto contiene el código fuente y el contenido estructurado de una web académica bilingüe, en español e inglés.

La web se genera de forma completamente estática con Astro. No utiliza PHP, SQL, MySQL ni ningún backend en producción. El contenido académico se mantiene en ficheros JSON versionados dentro de `src/content/`.

La web incluye:

- perfil académico y profesional;
- publicaciones científicas y contribuciones a congresos;
- actividad docente;
- proyectos de investigación y financiación;
- premios, becas, estancias y formación complementaria;
- divulgación, medios y recursos;
- versiones en español e inglés;
- despliegue automático mediante GitHub Actions y GitHub Pages.

---

## Tecnologías

- [Astro](https://astro.build/)
- Astro Content Collections
- TypeScript
- JSON como fuente de contenido
- HTML, CSS y JavaScript
- GitHub Actions
- GitHub Pages

Versiones objetivo del proyecto:

```text
Node.js >=20 <22
Astro 5.x
```

---

## Estructura del proyecto

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── css/
│   ├── download/
│   ├── img/
│   └── js/
├── scripts/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── lib/
│   └── pages/
├── astro.config.mjs
├── package.json
├── package-lock.json
├── src/content.config.ts
└── tsconfig.json
```

| Ruta | Descripción |
|---|---|
| `.github/workflows/` | Workflow de GitHub Actions para construir y publicar la web. |
| `public/` | Archivos estáticos copiados directamente al build final. |
| `public/css/` | Hojas de estilo globales. |
| `public/img/` | Imágenes públicas, como retrato y favicon. |
| `public/download/` | Archivos descargables, como el CV. |
| `public/js/` | JavaScript ejecutado en el navegador. |
| `src/components/` | Componentes reutilizables de Astro. |
| `src/content/` | Contenido estructurado en JSON. |
| `src/layouts/` | Plantillas generales de página. |
| `src/lib/` | Funciones auxiliares para contenido, rutas y utilidades. |
| `src/pages/` | Páginas y rutas del sitio. |
| `src/content.config.ts` | Configuración de las colecciones de contenido de Astro. |
| `dist/` | Web estática generada tras el build. No se versiona en Git. |

---

## Desarrollo local

Instalar dependencias:

```bash
npm install
```

Arrancar el servidor de desarrollo:

```bash
npm run dev
```

Generar la web estática:

```bash
npm run build
```

Previsualizar el build de producción:

```bash
npm run preview
```

La web generada se crea en:

```text
dist/
```

---

## Modelo de contenido

El contenido editable está en:

```text
src/content/
```

Cada tipo de contenido tiene su propia carpeta.

| Tipo de contenido | Ubicación |
|---|---|
| Perfil general | `src/content/site/profile.json` |
| Textos de interfaz | `src/content/ui/es.json`, `src/content/ui/en.json` |
| Artículos científicos | `src/content/papers/*.json` |
| Congresos | `src/content/conferences/*.json` |
| Docencia | `src/content/teaching/*.json` |
| Proyectos de investigación | `src/content/projects/*.json` |
| Trabajos dirigidos | `src/content/directed_projects/*.json` |
| Proyectos de innovación docente | `src/content/teaching_innovation_projects/*.json` |
| Becas, estancias y ayudas | `src/content/grants/*.json` |
| Premios | `src/content/awards/*.json` |
| Formación complementaria | `src/content/extra_education/*.json` |
| Divulgación y medios | `src/content/outreach/*.json` |

El esquema de las colecciones se define en:

```text
src/content.config.ts
```

---

## Añadir una publicación

Crear un nuevo fichero en:

```text
src/content/papers/
```

Por ejemplo:

```text
src/content/papers/026.json
```

Con una estructura como esta:

```json
{
  "idx": 26,
  "authors": "A.M. Durán-Rosal, ...",
  "title": "Título del nuevo artículo",
  "journal": "Nombre de la revista",
  "volume": "1",
  "year": "2026",
  "pages": "100001",
  "impact": "JCR(2025): Q1",
  "url": "https://doi.org/...",
  "abstract": "Resumen del artículo.",
  "citation": "@article{...}"
}
```

Después, comprobar que el proyecto compila correctamente:

```bash
npm run build
```

---

## Actualizar contenido existente

Flujo recomendado:

1. Editar el fichero JSON correspondiente dentro de `src/content/`.
2. Comprobar el build:

```bash
npm run build
```

3. Guardar y subir los cambios:

```bash
git add .
git commit -m "Update website content"
git push
```

GitHub Actions reconstruirá y publicará la web automáticamente.

---

## Archivos estáticos

### CV

El CV debe colocarse en:

```text
public/download/cv.pdf
```

Una vez publicado, estará disponible en:

```text
https://amduran.github.io/download/cv.pdf
```

### Imagen principal

La imagen principal está en:

```text
public/img/antonio.jpg
```

La ruta se configura en:

```text
src/content/site/profile.json
```

### Favicon

El favicon está en:

```text
public/img/favicon.png
```

---

## Apariencia y estilos

Los estilos principales están en:

```text
public/css/styles.css
```

Este archivo controla:

- colores;
- tipografías;
- espaciados;
- tarjetas;
- botones;
- navegación;
- diseño responsive;
- tema claro y oscuro.

La estructura global de todas las páginas se define en:

```text
src/layouts/BaseLayout.astro
```

La navegación principal está en:

```text
src/components/Header.astro
```

El pie de página está en:

```text
src/components/Footer.astro
```

---

## Rutas principales

Rutas en español:

```text
/
/publications/
/publications/[id]/
/conferences/[id]/
/teaching/
/projects/
/background/
/outreach/
/contact/
```

Rutas en inglés:

```text
/en/
/en/publications/
/en/publications/[id]/
/en/conferences/[id]/
/en/teaching/
/en/projects/
/en/background/
/en/outreach/
/en/contact/
```

También se mantienen algunas rutas heredadas de la versión anterior mediante redirecciones estáticas.

---

## Despliegue

El despliegue se realiza con GitHub Actions mediante:

```text
.github/workflows/deploy.yml
```

Proceso de despliegue:

1. Se hace `push` a la rama `main`.
2. GitHub Actions instala las dependencias.
3. GitHub Actions ejecuta `npm run build`.
4. La carpeta `dist/` se publica en GitHub Pages.

Sitio publicado:

```text
https://amduran.github.io/
```

---

## Buenas prácticas

No se deben versionar:

- `node_modules/`
- `dist/`
- `.astro/`
- ficheros `.env`
- volcados SQL
- credenciales privadas

El contenido público debe editarse preferentemente a través de `src/content/`.

---

## Licencia

No se ha definido una licencia explícita para este repositorio. Salvo que se añada un archivo de licencia, todos los derechos quedan reservados.
