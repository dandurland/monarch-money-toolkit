import { createRootRoute, createRoute } from '@tanstack/react-router';
import AppRoot from './app-root';
import { Dashboard } from './dashboard';

const rootRoute = createRootRoute({
  component: AppRoot,
});

const emptyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const routeTree = rootRoute.addChildren([emptyRoute, dashboardRoute]);

export default routeTree;
