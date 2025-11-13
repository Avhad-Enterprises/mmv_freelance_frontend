import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// internal
import logo from '@/assets/images/logo/carousal_1.png';
import shape from '@/assets/images/shape/shape_28.svg';
import { WidgetOne, WidgetTwo, WidgetThree, WidgetFour } from './component/footer-widgets';
import SocialLinks from './component/social-links';

const FooterTwo = () => {
  return (
    <div className="footer-one">
      <div className="container">
        <div className="inner-wrapper">
          <div className="row justify-content-between">
            {/* Left section (logo + email) */}
            <div className="col-xl-3 col-lg-3 footer-intro mb-15">
              <div className="logo mb-25">
                <Link href="/" className="d-flex align-items-center">
                  <Image src={logo} alt="logo" width={120} height={60} priority />
                </Link>
              </div>
              <a href="mailto:jobisupport@new.com" className="email fw-500">
                jobisupport@new.com
              </a>
              <Image
                src={shape}
                alt="shape"
                className="lazy-img mt-50 sm-mt-30 sm-mb-20"
              />
            </div>

            {/* Footer widgets */}
            <WidgetOne cls="col-lg-2 col-sm-6" />
            <WidgetTwo cls="col-lg-2 col-sm-6" />
            <WidgetThree cls="col-lg-2 col-sm-6" />
            <WidgetFour cls="col-lg-2 col-sm-6" />
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bottom-footer">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4 order-lg-3 mb-15">
              <ul className="style-none d-flex order-lg-last justify-content-center justify-content-lg-end social-icon">
                <SocialLinks />
              </ul>
            </div>

            <div className="col-lg-4 order-lg-1 mb-15">
              <ul className="d-flex style-none bottom-nav justify-content-center justify-content-lg-start">
                <li><Link href="/privacy">Privacy & Terms</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div className="col-lg-4 order-lg-2">
              <p className="text-center mb-15">
                © {new Date().getFullYear()} Jobi Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterTwo;
