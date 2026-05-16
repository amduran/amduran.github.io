export type Lang = 'es' | 'en';
export type RouteKey =
  | 'home'
  | 'publications'
  | 'publication'
  | 'conference'
  | 'teaching'
  | 'projects'
  | 'background'
  | 'outreach'
  | 'contact';

export function route(lang: Lang, key: RouteKey, id?: string | number): string {
  const prefix = lang === 'en' ? '/en' : '';
  switch (key) {
    case 'home': return lang === 'en' ? '/en/' : '/';
    case 'publications': return `${prefix}/publications/`;
    case 'publication': return `${prefix}/publications/${id}/`;
    case 'conference': return `${prefix}/conferences/${id}/`;
    case 'teaching': return `${prefix}/teaching/`;
    case 'projects': return `${prefix}/projects/`;
    case 'background': return `${prefix}/background/`;
    case 'outreach': return `${prefix}/outreach/`;
    case 'contact': return `${prefix}/contact/`;
  }
}

export function legacyPageClass(key: RouteKey): string {
  return {
    home: 'index',
    publications: 'ppublications',
    publication: 'ppublication',
    conference: 'pconference',
    teaching: 'pteaching',
    projects: 'pprojects',
    background: 'pinformation',
    outreach: 'ppress',
    contact: 'pcontact',
  }[key];
}
