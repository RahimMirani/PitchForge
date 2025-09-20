import { type ReactNode } from 'react'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header title={title} />
      <main className="flex-1 min-h-0">
        {children}
      </main>
    </div>
  )
} 