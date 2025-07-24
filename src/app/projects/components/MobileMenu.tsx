import React from 'react';
import Link from 'next/link';

export default function MobileMenu() {
  return (
    <div id="apus-mobile-menu" className="fixed top-0 left-0 w-full h-full bg-white z-50 d-block d-xl-none">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="text-lg font-semibold">Menu</div>
        <button className="text-gray-600 text-xl" aria-label="Close">
          ✕
        </button>
      </div>

      <div className="p-4">
        <nav className="space-y-4">
          <ul className="space-y-2">
            <li>
              <Link href="/browse-jobs" className="block text-base font-medium text-gray-800">
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link href="/projects" className="block text-base font-medium text-gray-800">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/jobs" className="block text-base font-medium text-gray-800">
                Jobs
              </Link>
            </li>
            <li>
              <Link href="/users" className="block text-base font-medium text-gray-800">
                Users
              </Link>
            </li>
            <li>
              <Link href="/blog" className="block text-base font-medium text-gray-800">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block text-base font-medium text-gray-800">
                Contact
              </Link>
            </li>
          </ul>

          <div className="border-t pt-4 mt-4 space-y-2">
            <Link href="/login" className="block text-blue-600 font-semibold">Login</Link>
            <Link href="/register" className="block text-blue-600 font-semibold">Register</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
