"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Menus from "./component/menus";
import logo from "@/assets/images/logo/logo_new.png";

const Header = () => {
  const router = useRouter();

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    // 1. Remove the token from localStorage
    localStorage.removeItem('token');
    
    // 2. Redirect to the homepage to refresh the session state
    // Using window.location.href ensures a full page reload to clear all states
    window.location.href = '/'; 
  };

  return (
    <>
      <header className={`theme-main-menu menu-overlay menu-style-one sticky-menu fixed`}>
        <div className="inner-content position-relative">
          <div className="top-header">
            <div className="d-flex align-items-center">
              {/* Logo on the left */}
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

              {/* Navigation */}
              <nav className="navbar navbar-expand-lg p0 ms-auto order-lg-2">
                <button
                  className="navbar-toggler d-block d-lg-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav align-items-lg-center">
                    <li className="d-block d-lg-none">
                      <div className="logo">
                        <Link href="/" className="d-block">
                          <Image src={logo} alt="logo" width={100} priority />
                        </Link>
                      </div>
                    </li>
                    
                    {/* --- DASHBOARD BUTTON (DESKTOP) --- */}
                    <li className="nav-item d-none d-lg-block">
                      <Link href="/dashboard/candidate-dashboard" className="btn btn-primary rounded-pill">
                        Dashboard
                      </Link>
                    </li>
                    
                    {/* --- DASHBOARD BUTTON (MOBILE) --- */}
                    <li className="nav-item d-block d-lg-none">
                      <Link href="/dashboard/candidate-dashboard" className="btn btn-primary w-100">
                        Dashboard
                      </Link>
                    </li>

                    <Menus />
                    
                    {/* --- LOGOUT BUTTONS --- */}
                    <li className="nav-item d-block d-lg-none">
                      {/* Mobile Logout Button */}
                      <button onClick={handleLogout} className="btn btn-danger w-100 mt-10">
                        Logout
                      </button>
                    </li>
                     <li className="nav-item d-none d-lg-block">
                      {/* Desktop Logout Button */}
                      <button onClick={handleLogout} className="btn btn-danger rounded-pill ms-3">
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;