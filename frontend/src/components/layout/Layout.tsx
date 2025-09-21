import { type ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <main className="flex-1 min-h-0">
        {children}
      </main>
    </div>
  )
} 