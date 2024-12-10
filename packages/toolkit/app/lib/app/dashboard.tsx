import { Portal } from './portal';
import type { OpenOptionsPageMesssage } from '@extension/shared';
import { OutboundMessageType } from '@extension/shared';
import { OverBudgetFeature } from '@extension/over-budget-widget';
import { Settings } from 'lucide-react';

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

  const overBudgetFeature = new OverBudgetFeature();

  return (
    <Portal mount={widgetMount}>
      <div className="shadow-[rgba(0, 40, 100, 0.04)] flex flex-col justify-start rounded-lg bg-widget shadow-md">
        <div className="m-0 flex flex-row items-center justify-start gap-0 border-b pb-4 pl-6 pr-5 pt-5 text-2xl font-medium text-widget-foreground">
          <span>Monarch Money Toolkit</span>
          <button className="cursor-pointer border-0 bg-transparent pl-1 text-lightBlue" onClick={goSettings}>
            <Settings className="text-lightBlue" />
          </button>
        </div>
        <div>{overBudgetFeature.getComponent()}</div>
      </div>
    </Portal>
  );
}
