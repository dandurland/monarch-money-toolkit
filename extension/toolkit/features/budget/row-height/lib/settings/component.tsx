import { useStorage } from '@extension/shared';
import { Label, RadioGroup, RadioGroupItem } from '@extension/ui';
import type { RowSize } from '../feature-storage';
import { featureStorage } from '../feature-storage';
import { useEffect } from 'react';

export function BudgetRowHeightSettings({ enabled }: { enabled: boolean }) {
  const settings = useStorage(featureStorage);

  useEffect(() => {
    if (!enabled) {
      featureStorage.disable();
      return;
    }

    featureStorage.enable();
  }, [enabled]);

  console.log(settings.size);

  const onChange = (value: RowSize) => {
    console.log(settings.size);
    featureStorage.patch({ size: value });
  };

  return (
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
  );
}
