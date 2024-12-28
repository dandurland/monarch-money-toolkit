//"use client"

import { cn, buttonVariants } from '@extension/ui';
import { Link, useLocation } from '@tanstack/react-router';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  const { pathname } = location;
  console.log(pathname);

  return (
    <nav className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)} {...props}>
      {items.map(item => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent hover:underline',
            'justify-start',
          )}>
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
