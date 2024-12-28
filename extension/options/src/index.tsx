import '@extension/ui/dist/global.css';
import '@src/index.css';
import { createRoot } from 'react-dom/client';
import { createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { BudgetSettings } from './budget/component';
import { DashboardSettings } from './dashboard/component';
import { NavBarSettings } from './nav-bar/component';
import { SettingsLayout } from './settings-layout';
import { TransactionSettings } from './transactions/component';
import { StrictMode } from 'react';
import { createBlockingMemoryHistory } from '@extension/shared';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }

  const rootRoute = createRootRoute({
    component: SettingsLayout,
  });

  const emptyRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: DashboardSettings,
  });

  const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: DashboardSettings,
  });

  const budgetRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/budget',
    component: BudgetSettings,
  });

  const navigationRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/nav-bar',
    component: NavBarSettings,
  });

  const transactionRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/transactions',
    component: TransactionSettings,
  });

  const routeTree = rootRoute.addChildren([emptyRoute, dashboardRoute, budgetRoute, navigationRoute, transactionRoute]);

  const router = createRouter({
    routeTree,
    history: createBlockingMemoryHistory({ initialEntries: ['/'] }),
  });

  const root = createRoot(appContainer);
  root.render(
    <>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </>,
  );
}

init();
