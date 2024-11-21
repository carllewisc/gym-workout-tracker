import fs from 'fs';
import path from 'path';

interface MenuItem {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  shortcut?: string[];
  items?: MenuItem[];
}

interface ModuleConfig {
  icon?: string;
  shortcut?: string[];
}

const EXCLUDED_DIRS = ['api', 'public', 'styles', 'utils', 'components'];

export function generateMenuStructure(basePath: string = 'app'): MenuItem[] {
  const rootDir = path.join(process.cwd(), basePath);
  return scanDirectory(rootDir);
}

function scanDirectory(dir: string, baseUrl: string = ''): MenuItem[] {
  const menuItems: MenuItem[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const directories = entries.filter(entry =>
    entry.isDirectory() &&
    !entry.name.startsWith('_') &&
    !entry.name.startsWith('.') &&
    !EXCLUDED_DIRS.includes(entry.name)
  );

  for (const directory of directories) {
    const fullPath = path.join(dir, directory.name);
    const isRouteGroup = directory.name.startsWith('(') && directory.name.endsWith(')');
    const dirName = isRouteGroup ? directory.name.slice(1, -1) : directory.name;

    const moduleItem: MenuItem = {
      title: `Module ${formatTitle(dirName)}`,
      url: '#',
      icon: getIconForModule(dirName),
      isActive: false,
      shortcut: ['d', 'd'],
      items: []
    };

    // Add the root page of the module if it exists
    if (fs.existsSync(path.join(fullPath, 'page.tsx'))) {
      moduleItem.items.push({
        title: formatTitle(dirName),
        url: `/${dirName}`,
        icon: 'userPen',
        shortcut: ['m', 'm']
      });
    }

    // Scan for routes within this module
    const routes = scanRoutes(fullPath, dirName);
    moduleItem.items.push(...routes);

    if (moduleItem.items.length > 0) {
      menuItems.push(moduleItem);
    }
  }

  return menuItems;
}

function scanRoutes(dir: string, moduleBase: string): MenuItem[] {
  const routes: MenuItem[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const fullPath = path.join(dir, entry.name);
    const isRouteGroup = entry.name.startsWith('(') && entry.name.endsWith(')');
    const isDynamicRoute = entry.name.startsWith('[') && entry.name.endsWith(']');

    if (isRouteGroup) {
      // Para grupos de rutas, escanear el contenido sin añadir nada a la URL
      const groupRoutes = scanRoutes(fullPath, moduleBase);
      routes.push(...groupRoutes);
    } else if (isDynamicRoute) {
      // Ignorar las rutas dinámicas en el menú
      continue;
    } else {
      // Para directorios normales
      if (fs.existsSync(path.join(fullPath, 'page.tsx'))) {
        routes.push({
          title: formatTitle(entry.name),
          url: createUrl(moduleBase, entry.name),
          icon: 'userPen',
          shortcut: ['m', 'm']
        });
      }

      // Recursivamente buscar en subdirectorios
      const subRoutes = scanRoutes(fullPath, moduleBase);
      routes.push(...subRoutes);
    }
  }

  return routes;
}

function createUrl(...parts: string[]): string {
  // Filtrar partes vacías y unir con '/'
  return '/' + parts
    .filter(part => part && part.trim() !== '')
    .join('/');
}

function formatTitle(str: string): string {
  return str
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getIconForModule(moduleName: string): string {
  const iconMap: { [key: string]: string } = {
    workout: 'gym',
    finance: 'gym',
    overview: 'gym',
    mvp: 'gym',
    dashboard: 'gym',
    auth: 'gym',
    default: 'gym'
  };

  return iconMap[moduleName.toLowerCase()] || iconMap.default;
}

export default generateMenuStructure;