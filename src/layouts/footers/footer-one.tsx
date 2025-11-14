import React from "react";
import Link from "next/link";
import { WidgetOne, WidgetTwo, WidgetThree, WidgetFour } from "./component/footer-widgets";
import SocialLinks from "./component/social-links";

const FooterOne = ({
  bottom_bg,
  style_2 = false,
  style_3 = false,
}: {
  bottom_bg?: string;
  style_2?: boolean;
  style_3?: boolean;
}) => {
  return (
    <div className={`footer-one ${style_2 ? "bg-two white-version" : ""}`}>
      <div className="container">
        <div className="inner-wrapper">
          <div className="row justify-content-between">
            {/* Widgets Section */}
            <WidgetOne style_2={style_2} cls="col-lg-2 col-md-3 col-sm-6" />
            <WidgetTwo style_2={style_2} cls="col-lg-2 col-md-3 col-sm-6" />
            <WidgetThree style_2={style_2} cls="col-lg-2 col-md-3 col-sm-6" />
            <WidgetFour style_2={style_2} cls="col-lg-2 col-md-3 col-sm-6" />

            {/* Newsletter Section (Updated) */}
            <div className="col-lg-4 mb-20 footer-newsletter">
              <h5 className={`footer-title ${style_2 ? "text-white" : ""}`}>
                Get Video Insights
              </h5>
              <p className={`${style_2 ? "text-white" : ""}`}>
                Join our newsletter for industry trends, platform updates, and tips for video success.
              </p>
              <form
                action="#"
                className={`d-flex ${style_3 ? "border-style" : ""}`}
              >
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
              </form>
              <p className="note">
                We only send interesting and relevant emails.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div
        className={`bottom-footer ${bottom_bg ? bottom_bg : ""} ${
          style_2 ? "mt-50 lg-mt-20" : ""
        }`}
      >
        <div className="container">
          <div className="row align-items-center">
            {/* Social Links */}
            <div className="col-lg-4 order-lg-3 mb-15">
              <ul className="style-none d-flex order-lg-last justify-content-center justify-content-lg-end social-icon">
                <SocialLinks />
              </ul>
            </div>

            {/* Bottom Navigation */}
            <div className="col-lg-4 order-lg-1 mb-15">
              <ul className="d-flex style-none bottom-nav justify-content-center justify-content-lg-start">
              </ul>
            </div>

            {/* Copyright */}
            <div className="col-lg-4 order-lg-2">
              <p className={`text-center mb-15 ${style_2 ? "text-white" : ""}`}>
                © {new Date().getFullYear()} Jobi Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterOne;
