import type { OpenOptionsPageMesssage } from '@extension/shared';
import { OutboundMessageType, useStorage, DashboardWidgetFeature, Portal, ErrorBoundary } from '@extension/shared';
import { Settings } from 'lucide-react';
import { features } from '@extension/features';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import { useState } from 'react';
import type { DraggableStyle } from '@hello-pangea/dnd';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { toolkitStorage } from './toolkit-storage';
import { DraggableContext } from '@extension/ui';

const ROOT_ID = 'mmtk-dashboard-widget-root';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFeatureInstances(widgetOrder: string[]): DashboardWidgetFeature<any>[] {
  return features.featureInstances
    .filter(f => f instanceof DashboardWidgetFeature)
    .toSorted((x, y) => (widgetOrder.indexOf(x.featureId) > widgetOrder.indexOf(y.featureId) ? 1 : -1));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortWidgets = (list: DashboardWidgetFeature<any>[], start: number, end: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(start, 1);
  result.splice(end, 0, removed);
  return result;
};

const goSettings = () => {
  const message: OpenOptionsPageMesssage['data'] = {
    type: OutboundMessageType.OpenOptionsPage,
  };

  chrome.runtime.sendMessage(message);
};

export function Dashboard() {
  const storage = useStorage(toolkitStorage);
  const [widgets, setWidgets] = useState(getFeatureInstances(storage.dashboard.widgetOrder));

  //TODO: refactor into hook
  const enabledHooks = features.featureInstances
    .filter(f => f instanceof DashboardWidgetFeature)
    .map(f => {
      return {
        featureId: f.featureId,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        enabled: useStorage<EnabledStorage<EnabledSettings>, EnabledSettings>(f.enabledStorage),
      };
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }

    const items = sortWidgets(widgets, result.source.index, result.destination.index);
    setWidgets(items);
    await toolkitStorage.patch({ dashboard: { ...storage.dashboard, widgetOrder: items.map(x => x.featureId) } });
  }

  const getItemStyle = (/*isDragging: boolean,*/ draggableStyle: DraggableStyle | undefined) => ({
    background: 'hsl(var(--widget))',
    ...draggableStyle,
  });

  if (enabledHooks.findIndex(w => w.enabled.enabled) === -1) {
    document.getElementById(ROOT_ID)?.remove();
    return <></>;
  }

  const widgetMount = document.getElementById(ROOT_ID) ?? Object.assign(document.createElement('div'), { id: ROOT_ID });
  const scrollRoot = document.querySelectorAll('[class*=Dashboard__DroppableColumn]')[1];
  scrollRoot.insertBefore(widgetMount, scrollRoot.children[0]);

  return (
    <Portal mount={widgetMount}>
      <div className="shadow-[rgba(0, 40, 100, 0.04)] flex flex-col justify-start overflow-hidden rounded-lg bg-widget shadow-md">
        <div className="m-0 flex flex-row items-center justify-start gap-0 pb-4 pl-6 pr-5 pt-5 text-2xl font-medium text-widget-foreground">
          <span>Monarch Money Toolkit</span>
          <button className="cursor-pointer border-0 bg-transparent pl-1 text-lightGray" onClick={goSettings}>
            <Settings className="text-lightGray" />
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <ul className="last:rounded-b-lg" {...provided.droppableProps} ref={provided.innerRef}>
                {widgets.map((widget, index) => (
                  <Draggable key={widget.featureId} draggableId={widget.featureId} index={index}>
                    {(provided, snapshot) => (
                      <li
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        style={getItemStyle(
                          /*snapshot.isDragging,*/
                          provided.draggableProps.style,
                        )}>
                        <DraggableContext.Provider
                          value={{ dragHandleProps: provided.dragHandleProps ?? undefined, state: snapshot }}>
                          <div className="h-[2px] bg-widget-secondary" />
                          <ErrorBoundary fallback={<div>{`Error retrieving ${widget.featureName}`}</div>}>
                            {widget.getComponent()}
                          </ErrorBoundary>
                        </DraggableContext.Provider>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Portal>
  );
}
