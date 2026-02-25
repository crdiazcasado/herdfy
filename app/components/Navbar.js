'use client'
import { useState } from 'react'
import Link from 'next/link'
import UserMenu from './UserMenu'
import CreateCampaignButton from './CreateCampaignButton'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Herdfy Logo"
              className="w-32 h-12 object-contain"
              loading="eager"
              width={128}
              height={48}
            />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Campañas
            </Link>
            <CreateCampaignButton />
            <UserMenu />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menú"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <Link
              href="/"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={closeMobileMenu}
            >
              Campañas
            </Link>
            <div className="px-4 py-2">
              <CreateCampaignButton mobile onClose={closeMobileMenu} />
            </div>
            <div className="border-t border-gray-200 pt-3 px-4">
              <UserMenu mobile onClose={closeMobileMenu} />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}