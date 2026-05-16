# Modelo de contenido

Este proyecto usa Astro Content Collections. Cada colección está definida en:

```text
src/content.config.ts
```

El contenido vive en ficheros JSON, que son texto versionable en Git. Astro valida cada fichero contra el esquema de su colección durante el build.

## Reglas prácticas

- Mantén `idx` único dentro de cada colección.
- Para artículos y congresos, `idx` se usa en la URL final.
- Puedes usar HTML mínimo en campos heredados como `authors`, `abstract`, `ips` y `supervisors`, porque la web anterior ya lo hacía. No pegues HTML de fuentes no confiables.
- Si cambias campos estructurales, actualiza también `src/content.config.ts`.

## Publicaciones

Carpeta: `src/content/papers/`

Campos principales:

- `idx`
- `authors`
- `title`
- `journal`
- `volume`
- `year`
- `pages`
- `impact`
- `url`
- `abstract`
- `citation`

## Congresos

Carpeta: `src/content/conferences/`

Campos principales:

- `idx`
- `authors`
- `title`
- `congress`
- `date`
- `year`
- `city`
- `pages`
- `url`
- `abstract`
- `citation`
