import { useSyncExternalStore } from "react";
import featureStore from "../toolkit/features/feature-store";

export function useWidgetSettings(key: string) : any {

  return useSyncExternalStore(
    (l: any) => featureStore.subscribe(l),
    () => featureStore.getSettingSnapshot(key),
  );

}