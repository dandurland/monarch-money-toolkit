import { EnabledSettings, useStorage } from '@extension/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@extension/ui';
import { featureStorage } from '../feature-storage';

export function OverBudgetFeatureSettings() {
  const { enabled } = useStorage(featureStorage);

  return (
    <EnabledSettings featureStorage={featureStorage}>
      <Card className={enabled ? '' : 'pointer-events-none opacity-40'}>
        <CardHeader>
          <CardTitle>Over Budget Categories</CardTitle>
          <CardDescription>Displays over budget categories on the dashboard</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </EnabledSettings>
  );
}
