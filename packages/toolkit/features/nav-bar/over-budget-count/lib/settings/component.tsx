import { EnabledSettings } from '@extension/shared';
import { useStorage } from '@extension/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@extension/ui';
import { featureStorage } from '../feature-storage';

export function OverBudgetCountFeatureSettings() {
  const settings = useStorage(featureStorage);

  return (
    <EnabledSettings featureStorage={featureStorage}>
      <Card className={settings.enabled ? '' : 'opacity-40 pointer-events-none'}>
        <CardHeader>
          <CardTitle>Over Budget Count</CardTitle>
          <CardDescription>Displays count of over budget categories on Budget navigation</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </EnabledSettings>
  );
}
