import { Portal } from './portal';
import { OpenOptionsPageMesssage, OutboundMessageType } from '@extension/shared';
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
      <div className="flex flex-col justify-start rounded-lg shadow-md shadow-[rgba(0, 40, 100, 0.04)] bg-widget">
        <div className="flex flex-row justify-start items-center m-0 gap-0 pt-5 pr-5 pb-4 pl-6 border-b text-2xl font-medium text-widget-foreground">
          <span>Monarch Money Toolkit</span>
          <button className="bg-transparent border-0 cursor-pointer pl-1 text-lightBlue" onClick={goSettings}>
            <Settings className="text-lightBlue" />
          </button>
        </div>
        <div>{overBudgetFeature.getComponent()}</div>
      </div>
    </Portal>
  );
}
