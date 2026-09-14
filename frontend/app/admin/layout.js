import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Dashboard - OPC Genie',
  description: 'Administrative interface for OPC Genie platform',
}

// This would typically include authentication check
export default function AdminLayout({ children }) {
  return (
    <div className={inter.className}>
      {/* Admin-specific security checks would go here */}
      {children}
    </div>
  )
}