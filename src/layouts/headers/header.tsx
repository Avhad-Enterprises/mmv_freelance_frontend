"use client"
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Menus from "./component/menus";
import logo from "@/assets/images/logo/white-mmv.png";
import CategoryDropdown from "./component/category-dropdown";
import LoginModal from "@/app/components/common/popup/login-modal";
import { useUser } from "@/context/UserContext";

const Header = () => {
  const { userData, userRoles, isLoading } = useUser();
  const isAuthenticated = !!userData && !isLoading;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine dashboard route based on user role
  const getDashboardRoute = () => {
    if (!userData || !userRoles.length) return '/dashboard/freelancer-dashboard';
    const normalizedRoles = userRoles.map(r => r.toUpperCase());
    if (normalizedRoles.includes('CLIENT')) return '/dashboard/client-dashboard';
    return '/dashboard/freelancer-dashboard';
  };

  // Handle menu toggle with proper event handling
  const handleMenuToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  }, []);

  // Close menu when clicking outside or on a link
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navbar = document.getElementById('navbarNav');
      const toggler = document.querySelector('.navbar-toggler');

      if (isMenuOpen && navbar && !navbar.contains(target) && !toggler?.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    // Close menu when window is resized to desktop
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  // Close menu when a nav link is clicked
  const handleNavClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      <header className={`theme-main-menu menu-overlay menu-style-one sticky-menu fixed`}>
        <div className="inner-content position-relative">
          <div className="top-header">
            <div className="d-flex align-items-center">
              <div className="logo order-lg-0">
                <Link href="/" className="d-flex align-items-center">
                  <Image
                    src={logo}
                    alt="Logo"
                    width={120}
                    height={0}
                    priority
                    className="img-fluid"
                  />
                </Link>
              </div>
              <div className="right-widget ms-auto order-lg-3">
                <ul className="d-flex align-items-center style-none">
                  <li>
                    {isAuthenticated ? (
                      <Link href={getDashboardRoute()} className="login-btn-one">
                        Dashboard
                      </Link>
                    ) : (
                      <a
                        href="#"
                        className="login-btn-one"
                        data-bs-toggle="modal"
                        data-bs-target="#loginModal"
                      >
                        Login
                      </a>
                    )}
                  </li>
                  <li className="d-none d-md-block ms-4">
                    <Link href="/freelancers" className="btn-one hire-top-talents-btn">
                      Hire Top Talents
                    </Link>
                  </li>
                </ul>
              </div>
              <nav className="navbar navbar-expand-lg p0 ms-lg-5 ms-3 order-lg-2">
                <button
                  className="navbar-toggler d-block d-lg-none"
                  type="button"
                  onClick={handleMenuToggle}
                  aria-controls="navbarNav"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle navigation"
                >
                  <span></span>
                </button>
                <div className={`navbar-collapse ${isMenuOpen ? 'show' : 'collapse'}`} id="navbarNav" onClick={handleNavClick}>
                  <ul className="navbar-nav align-items-lg-center">
                    <li className="d-block d-lg-none">
                      <div className="logo">
                        <Link href="/" className="d-block">
                          <Image src={logo} alt="logo" width={100} priority />
                        </Link>
                      </div>
                    </li>
                    {/* Commented out category dropdown
                    <li className="nav-item dropdown category-btn mega-dropdown-sm">
                      <a
                        className="nav-link dropdown-toggle"
                        href="/coming-soon"
                        role="button"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="outside"
                        aria-expanded="false"
                      >
                        <i className="bi bi-grid-fill"></i> Category
                      </a>
                    </li> 
                    */}
                    {/* menus start */}
                    <Menus />
                    {/* menus end */}
                    <li className="d-md-none">
                      <Link href="/job-list" className="btn-one w-100 hire-top-talents-btn">
                        Hire Top Talents
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* login modal start */}
      <LoginModal />
      {/* login modal end */}
    </>
  );
};

export default Header;
