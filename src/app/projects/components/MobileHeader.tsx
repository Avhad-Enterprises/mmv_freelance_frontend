import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MobileHeader() {
  return (
    <div id="apus-header-mobile" className="header-mobile d-block d-xl-none clearfix">
      <div className="container">
        <div className="row d-flex align-items-center">
          <div className="col-5">
            <div className="logo logo-theme">
              <Link href="https://demoapus1.com/freeio/">
                <Image src="/wp-content/themes/freeio/images/logo.svg" alt="Freeio" width={100} height={30} />
              </Link>
            </div>
          </div>
          <div className="col-7 d-flex align-items-center justify-content-end">
            <div className="top-wrapper-menu">
              <Link className="btn btn-outline-primary" href="https://demoapus1.com/freeio/login/" title="Login">
                Login
              </Link>
            </div>
            <button className="btn btn-outline-secondary" data-bs-toggle="offcanvas" data-bs-target="#navbar-offcanvas" aria-controls="navbar-offcanvas">
              <i className="mobile-menu-icon"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
