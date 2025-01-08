import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  dotSpacing?: number;
  dotSize?: number;
  rows?: number;
  columns?: number;
  className?: string;
};

const DragDots = ({ dotSpacing = 2, dotSize = 2, rows = 4, columns = 2, className, ...props }: Props) => (
  <div className={cn('', className)} {...props}>
    {[...Array(rows).keys()].map(row => (
      <div className={`flex [&:not(:first-child)]:mt-[2px]`} key={row}>
        {[...Array(columns).keys()].map(column => (
          <div
            className={`bg-darkGray h-[${dotSize}px] w-[2px] rounded-full [&:not(:first-child)]:ml-[2px]`}
            key={column}
          />
        ))}
      </div>
    ))}
  </div>
);

export default DragDots;
