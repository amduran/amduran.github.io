# Modelo de contenido

Este documento describe el modelo de datos de la web académica de Antonio M. Durán-Rosal.

La web usa **Astro Content Collections**. El contenido se almacena en ficheros JSON dentro de `src/content/` y se valida durante el build según los esquemas definidos en:

```text
src/content.config.ts
```

La web es completamente estática: no usa PHP, MySQL, SQL ni backend en producción.

---

## 1. Principios generales

### Contenido como datos

Cada elemento de contenido se representa como un fichero JSON versionado en Git.

Ejemplos:

```text
src/content/papers/025.json
src/content/conferences/016.json
src/content/projects/003.json
src/content/teaching/050.json
```

Esto permite:

- editar el contenido como texto;
- revisar cambios con `git diff`;
- validar errores en el build;
- publicar automáticamente con GitHub Actions;
- evitar una base de datos tradicional.

---

## 2. Reglas prácticas

### Identificador `idx`

La mayoría de colecciones usan un campo `idx`.

Reglas:

- `idx` debe ser único dentro de cada colección.
- Para artículos y congresos, `idx` se usa en la URL final.
- Conviene que el nombre del archivo coincida con `idx` usando tres dígitos.

Ejemplo:

```text
src/content/papers/026.json
```

```json
{
  "idx": 26
}
```

La publicación anterior generará una URL como:

```text
/publications/26/
/en/publications/26/
```

### Nombres de archivo

Usa nombres ordenados y estables:

```text
001.json
002.json
003.json
...
026.json
```

Evita nombres como:

```text
nuevo.json
paper-final.json
copia.json
```

### JSON válido

Todos los ficheros deben ser JSON válido:

- usa comillas dobles;
- no uses comas finales;
- no incluyas comentarios;
- mantén todos los campos esperados por el esquema.

Correcto:

```json
{
  "idx": 1,
  "title": "Example title"
}
```

Incorrecto:

```json
{
  "idx": 1,
  "title": "Example title",
}
```

### Campos vacíos

Si no tienes un dato, usa una cadena vacía:

```json
{
  "url": "",
  "citation": ""
}
```

Esto es preferible a eliminar el campo si el esquema lo espera.

### HTML heredado

Algunos campos pueden contener HTML mínimo porque la web original ya lo usaba.

Ejemplos de campos donde puede aparecer HTML heredado:

- `authors`
- `abstract`
- `ips`
- `supervisors`

Usa HTML solo si es necesario y solo si procede de una fuente confiable.

No pegues HTML generado por sitios externos no confiables.

---

## 3. Campos bilingües

La mayoría de colecciones usan texto simple. Sin embargo, algunas entradas, especialmente `outreach`, pueden usar campos bilingües con esta forma:

```json
{
  "es": "Texto en español",
  "en": "Text in English"
}
```

Ejemplo:

```json
{
  "label": {
    "es": "Cursos, seminarios, talleres y código",
    "en": "Courses, seminars, workshops and code"
  }
}
```

Reglas:

- Incluye siempre `es` y `en` cuando el campo sea bilingüe.
- No sustituyas el objeto por texto plano si la colección espera traducciones.
- Comprueba siempre con `npm run build` después de editar contenido bilingüe.

---

## 4. Colecciones

## 4.1 Perfil del sitio

Carpeta:

```text
src/content/site/
```

Archivo principal:

```text
src/content/site/profile.json
```

Contiene datos generales del sitio.

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | string | Nombre completo mostrado en la web. |
| `brand` | string | Marca o abreviatura usada en la cabecera. |
| `email` | string | Correo de contacto. |
| `phone` | string | Teléfono de contacto. |
| `location` | string | Ubicación breve. |
| `address` | string | Dirección completa. |
| `cv` | string | Ruta relativa al CV. |
| `portrait` | string | Ruta relativa a la imagen principal. |
| `academic_links` | array | Enlaces académicos. |
| `social_links` | array | Enlaces sociales o profesionales. |

Ejemplo de rutas:

```json
{
  "cv": "download/cv.pdf",
  "portrait": "img/antonio.jpg"
}
```

Los archivos correspondientes deben estar en:

```text
public/download/cv.pdf
public/img/antonio.jpg
```

---

## 4.2 Textos de interfaz

Carpeta:

```text
src/content/ui/
```

Archivos:

```text
src/content/ui/es.json
src/content/ui/en.json
```

Contienen textos generales de la interfaz:

- menú;
- botones;
- títulos de página;
- descripciones;
- etiquetas de acciones.

Ejemplo:

```json
{
  "home": "Inicio",
  "publications": "Publicaciones",
  "teaching": "Docencia"
}
```

Si añades una clave nueva a `es.json`, añade también su equivalente en `en.json`.

---

## 4.3 Artículos científicos

Carpeta:

```text
src/content/papers/
```

Genera rutas:

```text
/publications/[idx]/
/en/publications/[idx]/
```

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único de la publicación. |
| `authors` | string | Autores. Puede incluir HTML mínimo heredado. |
| `title` | string | Título del artículo. |
| `journal` | string | Revista. |
| `volume` | string | Volumen, número o identificador. |
| `year` | string | Año de publicación. |
| `pages` | string | Páginas o número de artículo. |
| `impact` | string | Información de impacto, JCR, cuartil, etc. |
| `url` | string | URL externa, DOI o fuente. |
| `abstract` | string | Resumen. Puede incluir HTML mínimo heredado. |
| `citation` | string | Cita BibTeX u otro formato. |

Ejemplo:

```json
{
  "idx": 26,
  "authors": "A.M. Durán-Rosal, Coauthor Name",
  "title": "Title of the article",
  "journal": "Journal Name",
  "volume": "12",
  "year": "2026",
  "pages": "100001",
  "impact": "JCR(2025): Q1",
  "url": "https://doi.org/10.xxxx/example",
  "abstract": "Article abstract.",
  "citation": "@article{example2026,...}"
}
```

---

## 4.4 Congresos

Carpeta:

```text
src/content/conferences/
```

Genera rutas:

```text
/conferences/[idx]/
/en/conferences/[idx]/
```

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único del congreso. |
| `authors` | string | Autores. |
| `title` | string | Título de la contribución. |
| `congress` | string | Nombre del congreso. |
| `date` | string | Fecha o rango de fechas. |
| `year` | string | Año. |
| `city` | string | Ciudad y país. |
| `pages` | string | Páginas si aplica. |
| `url` | string | URL externa. |
| `abstract` | string | Resumen. |
| `citation` | string | Cita si aplica. |

Ejemplo:

```json
{
  "idx": 17,
  "authors": "A.M. Durán-Rosal, Coauthor Name",
  "title": "Conference contribution title",
  "congress": "Conference Name",
  "date": "June 2026",
  "year": "2026",
  "city": "Madrid, Spain",
  "pages": "",
  "url": "https://example.com",
  "abstract": "Contribution abstract.",
  "citation": ""
}
```

---

## 4.5 Docencia

Carpeta:

```text
src/content/teaching/
```

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único. |
| `academic_year` | string | Curso académico. |
| `subject` | string | Asignatura. |
| `degree` | string | Titulación. |
| `course` | string | Curso. |
| `entity` | string | Universidad o entidad. |
| `type` | string | Tipo de docencia. |
| `hours` | string | Horas. |
| `ects` | string | Créditos ECTS. |
| `current` | number | Indica si es docencia actual. |

Ejemplo:

```json
{
  "idx": 51,
  "academic_year": "2025/2026",
  "subject": "Machine Learning",
  "degree": "Bachelor's Degree in Data Science",
  "course": "3",
  "entity": "Universidad Loyola",
  "type": "Theory and practice",
  "hours": "60",
  "ects": "6",
  "current": 1
}
```

---

## 4.6 Trabajos dirigidos

Carpeta:

```text
src/content/directed_projects/
```

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único. |
| `type` | string | Tipo de trabajo: TFG, TFM, tesis, etc. |
| `title` | string | Título del trabajo. |
| `author` | string | Autor/a. |
| `supervisors` | string | Directores o supervisores. Puede contener HTML mínimo. |
| `year` | string | Año. |
| `qualification` | string | Calificación si aplica. |

---

## 4.7 Proyectos de innovación docente

Carpeta:

```text
src/content/teaching_innovation_projects/
```

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único. |
| `reference` | string | Referencia del proyecto. |
| `title` | string | Título. |
| `entity` | string | Entidad financiadora o convocante. |
| `ips` | string | Investigadores principales. Puede contener HTML mínimo. |
| `money` | string | Financiación. |
| `rol` | string | Rol desempeñado. |
| `academic_year` | string | Curso académico. |

---

## 4.8 Proyectos de investigación

Carpeta:

```text
src/content/projects/
```

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único. |
| `reference` | string | Referencia del proyecto. |
| `title` | string | Título del proyecto. |
| `entity` | string | Entidad financiadora. |
| `scope` | string | Ámbito: regional, nacional, europeo, etc. |
| `ips` | string | Investigadores principales. Puede contener HTML mínimo. |
| `date_ini` | string | Fecha de inicio. |
| `date_end` | string | Fecha de fin. |
| `money` | string | Financiación. |
| `rol` | string | Rol. |
| `status` | string | Estado del proyecto. |

---

## 4.9 Becas, estancias y ayudas

Carpeta:

```text
src/content/grants/
```

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único. |
| `name` | string | Nombre de la ayuda o estancia. |
| `entity` | string | Entidad financiadora. |
| `date_ini` | string | Fecha de inicio. |
| `date_end` | string | Fecha de fin. |
| `entity_realisation` | string | Entidad donde se realiza. |
| `school` | string | Departamento, escuela o grupo. |
| `city` | string | Ciudad. |
| `country` | string | País. |

---

## 4.10 Premios

Carpeta:

```text
src/content/awards/
```

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único. |
| `description` | string | Descripción del premio. |
| `entity` | string | Entidad que concede el premio. |
| `date` | string | Fecha. |

---

## 4.11 Formación complementaria

Carpeta:

```text
src/content/extra_education/
```

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único. |
| `title` | string | Título del curso o actividad. |
| `entity` | string | Entidad organizadora. |
| `date` | string | Fecha. |
| `hours` | string | Número de horas. |

---

## 4.12 Formación principal

Carpeta:

```text
src/content/education/
```

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único. |
| `title` | string | Título académico. |
| `entity` | string | Universidad o entidad. |
| `year` | string | Año. |
| `grade` | string | Calificación o mención. |
| `project` | string | Proyecto, tesis o trabajo asociado. |
| `url_project` | string | URL del proyecto si existe. |

---

## 4.13 Experiencia

Carpeta:

```text
src/content/experience/
```

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único. |
| `title` | string | Puesto o cargo. |
| `entity` | string | Institución. |
| `url_entity` | string | URL de la entidad. |
| `date_ini` | string | Fecha de inicio. |
| `date_end` | string | Fecha de fin. |
| `city` | string | Ciudad. |
| `country` | string | País. |

---

## 4.14 Divulgación y medios

Carpeta:

```text
src/content/outreach/
```

Esta colección usa campos bilingües.

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `idx` | number | Identificador único de la sección. |
| `label` | localized text | Etiqueta de la sección. |
| `items` | array | Lista de bloques dentro de la sección. |
| `items[].title` | localized text | Título del bloque. |
| `items[].links` | array | Enlaces asociados. |
| `items[].links[].label` | localized text | Texto del enlace. |
| `items[].links[].url` | string | URL del enlace. |

Ejemplo:

```json
{
  "idx": 1,
  "label": {
    "es": "Cursos, seminarios, talleres y código",
    "en": "Courses, seminars, workshops and code"
  },
  "items": [
    {
      "title": {
        "es": "Seminario de introducción a ciencia de datos y aprendizaje automático",
        "en": "Seminar on Introduction to Data Science and Machine Learning"
      },
      "links": [
        {
          "label": {
            "es": "Material del seminario",
            "en": "Seminar material"
          },
          "url": "https://github.com/example/repository"
        }
      ]
    }
  ]
}
```

---

## 5. Añadir contenido

### Añadir un nuevo elemento

1. Crea un fichero JSON en la colección correspondiente.
2. Usa el siguiente `idx` disponible.
3. Mantén el nombre del archivo con tres dígitos.
4. Rellena todos los campos esperados.
5. Ejecuta el build.

Ejemplo:

```bash
cp src/content/papers/025.json src/content/papers/026.json
```

Después edita:

```text
src/content/papers/026.json
```

Y cambia al menos:

- `idx`
- `authors`
- `title`
- `year`
- `url`
- `abstract`
- `citation`

---

## 6. Modificar contenido

Edita el JSON correspondiente y ejecuta:

```bash
npm run build
```

Si el build funciona, guarda el cambio:

```bash
git add src/content/...
git commit -m "Update content"
git push
```

---

## 7. Eliminar contenido

Para eliminar una entrada, borra su fichero JSON.

Ejemplo:

```bash
rm src/content/papers/026.json
```

Después ejecuta:

```bash
npm run build
```

Y guarda el cambio:

```bash
git add -A
git commit -m "Remove content item"
git push
```

Atención: si eliminas una publicación o congreso, su URL dejará de existir.

---

## 8. Validación

Astro valida el contenido durante:

```bash
npm run build
```

Si hay errores de modelo, suelen venir de:

- JSON inválido;
- campos obligatorios ausentes;
- tipos incorrectos;
- objetos bilingües mal formados;
- `idx` no numérico;
- comas finales;
- rutas o URLs mal escritas.

---

## 9. Checklist antes de publicar

Antes de hacer `git push`, ejecuta:

```bash
npm run build
git status
git diff
```

Comprueba que:

- el build termina sin errores;
- no aparecen archivos inesperados;
- no se suben `dist/`, `.astro/`, `node_modules/`, `.env` ni SQL;
- los JSON modificados son los esperados;
- no hay credenciales ni datos privados.

---

## 10. Relación entre contenido y páginas

El contenido de `src/content/` se muestra desde páginas de `src/pages/`.

Ejemplos:

| Contenido | Página principal | Página de detalle |
|---|---|---|
| `papers` | `src/pages/publications/index.astro` | `src/pages/publications/[id].astro` |
| `conferences` | `src/pages/publications/index.astro` | `src/pages/conferences/[id].astro` |
| `teaching` | `src/pages/teaching/index.astro` | No aplica |
| `projects` | `src/pages/projects/index.astro` | No aplica |
| `outreach` | `src/pages/outreach/index.astro` | No aplica |

Las versiones inglesas están en:

```text
src/pages/en/
```

---

## 11. Cuándo editar `src/content.config.ts`

Solo debes modificar `src/content.config.ts` si cambias el modelo de datos.

Ejemplos:

- añadir un campo nuevo a una colección;
- crear una colección nueva;
- permitir campos bilingües en una colección;
- cambiar un campo de número a texto;
- hacer opcional un campo.

Si solo quieres cambiar contenido, no modifiques `src/content.config.ts`.

---

## 12. Comandos útiles

```bash
npm run dev      # servidor de desarrollo
npm run build    # validar y construir la web
npm run preview  # previsualizar el build

git status       # ver estado del repositorio
git diff         # ver cambios antes del commit
git add .        # añadir cambios
git commit -m "Mensaje del cambio"
git push         # subir cambios y desplegar
```
