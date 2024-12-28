import { Portal } from './portal';
import type { OpenOptionsPageMesssage } from '@extension/shared';
import { OutboundMessageType, WidgetFeature } from '@extension/shared';
import { Settings } from 'lucide-react';
import { features } from '@extension/features';

export function Dashboard() {
  const widgetMount =
    document.getElementById('mmtk-dashboard-widget-root') ??
    Object.assign(document.createElement('div'), { id: 'mmtk-dashboard-widget-root' });

  const scrollRoot = document.querySelectorAll('[class*=Dashboard__DroppableColumn]')[1];
  scrollRoot.insertBefore(widgetMount, scrollRoot.children[0]);

  const goSettings = () => {
    console.log('goSettings');

    const message: OpenOptionsPageMesssage['data'] = {
      type: OutboundMessageType.OpenOptionsPage,
    };

    chrome.runtime.sendMessage(message);
  };

  const widgets = features.featureInstances
    .filter(f => f instanceof WidgetFeature)
    .map(p => (
      <div key={p.featureName}>
        <div className="h-[2px] bg-widget-secondary" />
        {p.getComponent()}
      </div>
    ));

  return (
    <Portal mount={widgetMount}>
      <div className="shadow-[rgba(0, 40, 100, 0.04)] flex flex-col justify-start rounded-lg bg-widget shadow-md">
        <div className="m-0 flex flex-row items-center justify-start gap-0 pb-4 pl-6 pr-5 pt-5 text-2xl font-medium text-widget-foreground">
          <span>Monarch Money Toolkit</span>
          <button className="cursor-pointer border-0 bg-transparent pl-1 text-lightGray" onClick={goSettings}>
            <Settings className="text-lightGray" />
          </button>
        </div>
        {widgets && widgets}
      </div>
    </Portal>
  );
}
