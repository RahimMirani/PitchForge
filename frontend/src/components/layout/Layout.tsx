import { type ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
  backgroundVariant?: 'default' | 'aurora';
}

export function Layout({ children, header, backgroundVariant = 'aurora' }: LayoutProps) {
  const backgroundClass = backgroundVariant === 'aurora'
    ? 'bg-transparent'
    : 'bg-slate-50';

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${backgroundClass}`}>
      {header ? (
        <header className="flex-shrink-0 z-20">
          {header}
        </header>
      ) : null}
      <main className="flex-1 min-h-0 relative">
        {children}
      </main>
    </div>
  )
}