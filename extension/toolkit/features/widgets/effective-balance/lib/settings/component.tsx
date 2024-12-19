import { EnabledSettings, useStorage } from '@extension/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@extension/ui';
import { featureStorage } from '../feature-storage';

export function EffectiveBalanceFeatureSettings() {
  const { enabled } = useStorage(featureStorage);

  return (
    <EnabledSettings featureStorage={featureStorage}>
      <Card className={enabled ? '' : 'pointer-events-none opacity-40'}>
        <CardHeader>
          <CardTitle>Effective Balance</CardTitle>
          <CardDescription>
            Display total of configured credit account balances as a percentage of configured depository accounts.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </EnabledSettings>
  );
}
