import { features } from '@extension/features';
import { useLocation } from '@tanstack/react-router';
import { PortalFeature } from '@extension/shared';

export function PortalMount() {
  const location = useLocation();
  const { pathname } = location;

  console.log(`PortalMount - ${pathname}`);

  const p = features.featureInstances.filter(f => f instanceof PortalFeature);
  const portals = p.filter(p => p.shouldMount(pathname));

  return <>{portals && <>{portals.map(p => p.getPortal())}</>}</>;
}
