import { type ReactNode } from 'react'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} />
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
} 