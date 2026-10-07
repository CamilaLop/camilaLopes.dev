import { portfolioProjects, type PortfolioProject } from './projects';
import type { Locale } from './translations';

type Copy = { category: string; summary: string; responsibilities: string[] };

// Project names and URLs remain the original, real project identities.
export const projectCopy: Record<Locale, Partial<Record<string, Copy>>> = {
  pt: Object.fromEntries(portfolioProjects.map(p => [p.id, { category: p.category, summary: p.summary, responsibilities: p.responsibilities }])),
  en: {
    'igor-guia': { category: 'Tourism landing page', summary: 'A tourism guide website for Região dos Lagos, with clear navigation, visual presentation and a focus on choosing tours.', responsibilities: ['Front-end structure', 'Responsive layout', 'JavaScript interactions', 'Visual organization of sections'] },
    'lue-brand': { category: 'Web system for an independent brand', summary: 'A website and system for a handmade clothing brand, with inventory, sales and dashboard connected to an online database.', responsibilities: ['Interface visual identity', 'Inventory management', 'Sales flow', 'Supabase and PostgreSQL integration'] },
    'sales-dashboard': { category: 'Management dashboard', summary: 'A dashboard for sales, purchases, suppliers and inventory, with login authentication and an active Supabase database.', responsibilities: ['React front-end architecture', 'Authentication', 'Analytics dashboards', 'Database integration'] },
    'Sale-ecommerce': { category: 'Full stack e-commerce', summary: 'A full stack learning project with storefront, shopping cart, login, authentication and data persistence.', responsibilities: ['Storefront interface', 'Shopping cart flow', 'Prisma data modeling', 'Authentication and PostgreSQL database'] },
    'bruna-dantas': { category: 'Institutional landing page', summary: 'A custom landing page for a lawyer, with a complete visual identity connecting the brand language to the digital experience.', responsibilities: ['Visual identity', 'Visual direction', 'Landing page development', 'Institutional structure'] },
    lazuli: { category: 'Homepage and scheduling concept', summary: 'A psychotherapy practice homepage, with custom visual identity and a proposed professional scheduling integration with Google Calendar.', responsibilities: ['Visual identity', 'Institutional interface', 'Booking flow', 'Calendar integration planning'] },
    'python-call-crud': { category: 'Internal Python application', summary: 'A Python application for a store to register, search, edit and store customer calls and service records.', responsibilities: ['CRUD flow modeling', 'Data organization', 'Simple operational interface', 'Record automation'] },
    'orbis-clinic': { category: 'SaaS for clinics', summary: 'A SaaS in development for clinic administration, with a proposed 24-hour digital service and human-centered workflows.', responsibilities: ['Product conception', 'Visual identity', 'Dashboard UX', 'Next.js and PostgreSQL architecture', 'WhatsApp Business integration planning'] }
  },
  es: {
    'igor-guia': { category: 'Landing page turística', summary: 'Un sitio para guía turístico de Região dos Lagos, con presentación visual, navegación clara y enfoque en la elección de paseos.', responsibilities: ['Estructura front-end', 'Composición adaptable', 'Interacciones en JavaScript', 'Organización visual de las secciones'] },
    'lue-brand': { category: 'Sistema web para marca independiente', summary: 'Sitio y sistema para una marca de ropa artesanal, con inventario, ventas y dashboard conectados a una base de datos online.', responsibilities: ['Identidad visual de la interfaz', 'Control de inventario', 'Flujo de ventas', 'Integración con Supabase y PostgreSQL'] },
    'sales-dashboard': { category: 'Dashboard de gestión', summary: 'Dashboard para ventas, compras, proveedores e inventario, con autenticación y una base de datos activa en Supabase.', responsibilities: ['Arquitectura front-end en React', 'Autenticación', 'Dashboards analíticos', 'Integración con base de datos'] },
    'Sale-ecommerce': { category: 'E-commerce full stack', summary: 'Proyecto de aprendizaje full stack con tienda, carrito, login, autenticación y persistencia de datos.', responsibilities: ['Interfaz de la tienda', 'Flujo del carrito', 'Modelado con Prisma', 'Autenticación y base PostgreSQL'] },
    'bruna-dantas': { category: 'Landing page institucional', summary: 'Landing page para una abogada, con identidad visual completa conectando el lenguaje de la marca a la experiencia digital.', responsibilities: ['Identidad visual', 'Dirección visual', 'Desarrollo de la landing page', 'Estructura institucional'] },
    lazuli: { category: 'Homepage y propuesta de agenda', summary: 'Homepage para un consultorio de psicoterapia, con identidad visual propia y propuesta de integración de agenda con Google Calendar.', responsibilities: ['Identidad visual', 'Interfaz institucional', 'Flujo de citas', 'Planificación de integración con calendarios'] },
    'python-call-crud': { category: 'Aplicación Python interna', summary: 'Programa en Python para registrar, consultar, editar y almacenar llamadas de clientes y acciones de atención en una tienda.', responsibilities: ['Modelado del flujo CRUD', 'Organización de datos', 'Interfaz operativa simple', 'Automatización de registros'] },
    'orbis-clinic': { category: 'SaaS para clínicas', summary: 'SaaS en desarrollo para administración de clínicas, con propuesta de atención digital 24 horas y flujos humanizados.', responsibilities: ['Concepción del producto', 'Identidad visual', 'UX del dashboard', 'Arquitectura con Next.js y PostgreSQL', 'Planificación de integración con WhatsApp Business'] }
  }
};

/** Keep a newly added project usable before all translations are available. */
export function getProjectCopy(locale: Locale, project: PortfolioProject): Copy {
  return projectCopy[locale][project.id] ?? {
    category: project.category,
    summary: project.summary,
    responsibilities: project.responsibilities,
  };
}
