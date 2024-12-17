import { EnabledSettings, useStorage } from '@extension/shared';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@extension/ui';
import type { RowSize } from '../feature-storage';
import { featureStorage } from '../feature-storage';

export function TransactionRowHeightSettings() {
  const settings = useStorage(featureStorage);
  console.log(settings.size);

  const onChange = (value: RowSize) => {
    console.log(settings.size);
    featureStorage.patch({ size: value });
  };

  return (
    <EnabledSettings featureStorage={featureStorage}>
      <Card className={settings.enabled ? '' : 'pointer-events-none opacity-40'}>
        <CardHeader>
          <CardTitle>Transaction Row Height</CardTitle>
          <CardDescription>Change transaction row height</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <RadioGroup defaultValue={settings.size ?? 'default'} onValueChange={onChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="r1" />
                <Label htmlFor="r1">Compact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r2" />
                <Label htmlFor="r2">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="r3" />
                <Label htmlFor="r3">Large</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </EnabledSettings>
  );
}
