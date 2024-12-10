import '@src/options.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { createMemoryRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { SettingsLayout } from '@src/settings-layout';
import { DashboardSettings } from '@src/dashboard/component';
import { TransactionSettings } from '@src/transactions/component';
import { NavBarSettings } from './nav-bar/component';

const router = createMemoryRouter(
  createRoutesFromElements(
    <Route path="/" element={<SettingsLayout />}>
      <Route index element={<DashboardSettings />} />
      <Route path="/options/dashboard" element={<DashboardSettings />} />
      <Route path="/options/nav-bar" element={<NavBarSettings />} />
      <Route path="/options/transactions" element={<TransactionSettings />} />
      <Route path="*" element={<DashboardSettings />} />
    </Route>,
  ),
);

const Options = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
