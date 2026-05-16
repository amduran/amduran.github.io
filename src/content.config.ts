import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const asString = z.preprocess((value) => value == null ? '' : String(value), z.string());
const asNumber = z.preprocess((value) => Number(value ?? 0), z.number());
const localizedText = z.union([asString, z.record(asString)]);
const link = z.object({ label: localizedText, url: asString });

const site = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/site' }),
  schema: z.object({
    name: asString,
    brand: asString,
    email: asString,
    phone: asString,
    location: asString,
    address: asString,
    cv: asString,
    portrait: asString,
    academic_links: z.array(z.object({ label: asString, url: asString })).default([]),
    social_links: z.array(z.object({ icon: asString, url: asString })).default([]),
  }),
});

const ui = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/ui' }),
  schema: z.record(asString),
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/education' }),
  schema: z.object({ idx: asNumber, title: asString, entity: asString, year: asString, grade: asString, project: asString, url_project: asString }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experience' }),
  schema: z.object({ idx: asNumber, title: asString, entity: asString, url_entity: asString, date_ini: asString, date_end: asString, city: asString, country: asString }),
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/papers' }),
  schema: z.object({ idx: asNumber, authors: asString, title: asString, journal: asString, volume: asString, year: asString, pages: asString, impact: asString, url: asString, abstract: asString, citation: asString }),
});

const conferences = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/conferences' }),
  schema: z.object({ idx: asNumber, authors: asString, title: asString, congress: asString, date: asString, year: asString, city: asString, pages: asString, url: asString, abstract: asString, citation: asString }),
});

const teaching = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/teaching' }),
  schema: z.object({ idx: asNumber, academic_year: asString, subject: asString, degree: asString, course: asString, entity: asString, type: asString, hours: asString, ects: asString, current: asNumber }),
});

const directed_projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/directed_projects' }),
  schema: z.object({ idx: asNumber, type: asString, title: asString, author: asString, supervisors: asString, year: asString, qualification: asString }),
});

const teaching_innovation_projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/teaching_innovation_projects' }),
  schema: z.object({ idx: asNumber, reference: asString, title: asString, entity: asString, ips: asString, money: asString, rol: asString, academic_year: asString }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({ idx: asNumber, reference: asString, title: asString, entity: asString, scope: asString, ips: asString, date_ini: asString, date_end: asString, money: asString, rol: asString, status: asString }),
});

const grants = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/grants' }),
  schema: z.object({ idx: asNumber, name: asString, entity: asString, date_ini: asString, date_end: asString, entity_realisation: asString, school: asString, city: asString, country: asString }),
});

const awards = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/awards' }),
  schema: z.object({ idx: asNumber, description: asString, entity: asString, date: asString }),
});

const extra_education = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/extra_education' }),
  schema: z.object({ idx: asNumber, title: asString, entity: asString, date: asString, hours: asString }),
});

const outreach = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/outreach' }),
  schema: z.object({
    idx: asNumber,
    label: localizedText,
    items: z.array(z.object({
      title: localizedText,
      links: z.array(link).default([]),
    })).default([]),
  }),
});

export const collections = {
  site,
  ui,
  education,
  experience,
  papers,
  conferences,
  teaching,
  directed_projects,
  teaching_innovation_projects,
  projects,
  grants,
  awards,
  extra_education,
  outreach,
};
