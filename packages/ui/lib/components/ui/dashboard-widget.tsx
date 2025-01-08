import { useDraggableContext } from '@/lib/hooks';
import DragDots from './drag-dots';
import { Spinner } from './spinner';
import { Suspense } from 'react';

interface DashboardWidgetProps {
  id: string;
  title: string;
  description?: string;
  link: string;
  useSuspense: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const DragHandle = () => {
  const { dragHandleProps } = useDraggableContext();
  return (
    <div
      role="button"
      className="absolute left-0 opacity-0 group-hover/root:opacity-100 hover:cursor-grab active:cursor-grabbing">
      <DragDots {...dragHandleProps} />
    </div>
  );
};

export function DashboardWidget({
  id,
  title,
  description,
  link,
  useSuspense = true,
  loading,
  children,
}: DashboardWidgetProps) {
  //pb-4 pl-6 pr-5 pt-5
  return (
    <div id={id} className="relative group/root flex flex-col place-content-stretch rounded-lg text-widget-foreground">
      <div className="group flex flex-row">
        <a href={link} className="flex flex-row items-center px-6 py-3 text-inherit">
          <DragHandle />
          <div className="bottom-3 flex flex-row items-center gap-2 text-lg font-semibold group-hover:text-lightBlue">
            <div className="flex flex-row items-center gap-2 align-bottom">
              <span className="group-hover:text-lightBlue">{title}</span>
              {!!description && <span className="text-base text-widget-foreground-secondary">{description}</span>}
            </div>
          </div>
        </a>
      </div>
      {useSuspense ? (
        <Suspense
          fallback={
            <div className="m-6 flex flex-row justify-center">
              <Spinner />
            </div>
          }>
          {children}
        </Suspense>
      ) : (
        <>
          {loading ? (
            <div className="m-6 flex flex-row justify-center">
              <Spinner />
            </div>
          ) : (
            children
          )}
        </>
      )}
    </div>
  );
}
