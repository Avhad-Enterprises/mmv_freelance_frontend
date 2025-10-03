"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Menus from "./component/menus";
import logo from "@/assets/images/logo/logo_new.png";
// LoginModal import is removed as it's no longer used

const Header = () => {
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

              {/* The right-widget containing login/post buttons has been completely removed. */}

              {/* CHANGE: Added ms-auto to push the nav to the right */}
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
                    
                    {/* Menus component is kept */}
                    <Menus />
                    
                    {/* CHANGE: Removed the mobile-only "Post Job" and "Hire Top Talents" buttons */}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* The login modal has been removed */}
    </>
  );
};

export default Header;
