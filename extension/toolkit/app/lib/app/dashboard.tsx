import type { OpenOptionsPageMesssage } from '@extension/shared';
import { OutboundMessageType, useStorage, DashboardWidgetFeature, Portal } from '@extension/shared';
import { Settings } from 'lucide-react';
import { features } from '@extension/features';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import { useMemo } from 'react';

export function Dashboard() {
  const widgetMount =
    document.getElementById('mmtk-dashboard-widget-root') ??
    Object.assign(document.createElement('div'), { id: 'mmtk-dashboard-widget-root' });

  const scrollRoot = document.querySelectorAll('[class*=Dashboard__DroppableColumn]')[1];
  scrollRoot.insertBefore(widgetMount, scrollRoot.children[0]);

  const goSettings = () => {
    const message: OpenOptionsPageMesssage['data'] = {
      type: OutboundMessageType.OpenOptionsPage,
    };

    chrome.runtime.sendMessage(message);
  };

  const featureInstances = useMemo(() => {
    return features.featureInstances.filter(f => f instanceof DashboardWidgetFeature);
  }, []);

  const widgets = featureInstances.map(w => ({
    widget: w,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    settings: useStorage<EnabledStorage<EnabledSettings>, EnabledSettings>(w.enabledStorage),
  }));

  const widgetInstances = widgets
    .filter(f => f.settings.enabled)
    .map(p => (
      <div key={p.widget.featureName}>
        <div className="h-[2px] bg-widget-secondary" />
        {p.widget.getComponent()}
      </div>
    ));

  if (widgetInstances.length === 0) {
    return <></>;
  }

  return (
    <Portal mount={widgetMount}>
      <div className="shadow-[rgba(0, 40, 100, 0.04)] flex flex-col justify-start rounded-lg bg-widget shadow-md">
        <div className="m-0 flex flex-row items-center justify-start gap-0 pb-4 pl-6 pr-5 pt-5 text-2xl font-medium text-widget-foreground">
          <span>Monarch Money Toolkit</span>
          <button className="cursor-pointer border-0 bg-transparent pl-1 text-lightGray" onClick={goSettings}>
            <Settings className="text-lightGray" />
          </button>
        </div>
        {widgetInstances && widgetInstances}
      </div>
    </Portal>
  );
}
