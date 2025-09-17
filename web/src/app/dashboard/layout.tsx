import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pb-16 sm:pb-0">{children}</main>
        <MobileNav />
      </div>
    </ProtectedRoute>
  )
}