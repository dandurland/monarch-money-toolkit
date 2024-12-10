import AppRoot from './app-root';
import { Dashboard } from './dashboard';

const routes = [
  {
    path: '/',
    element: <AppRoot />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: '*',
      },
    ],
  },
];

export default routes;
