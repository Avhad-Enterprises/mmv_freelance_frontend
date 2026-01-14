import Link from 'next/link';
import React from 'react';

export function WidgetOne({ cls, style_2 }: { cls: string; style_2?: boolean }) {
  return (
    <div className={`${cls} mb-20`}>
      <h5 className={`footer-title ${style_2 ? 'text-white' : ''}`}>For Clients</h5>
      <ul className="footer-nav-link style-none">
        <li><Link href="/how-to-hire">How to Hire</Link></li>
        <li><Link href="/post-video-project">Post a Video Project</Link></li>
        <li><Link href="/job-list">Find Video Editors</Link></li>
        <li><Link href="/job-list">Find Videographers</Link></li>
        <li><Link href="/clientfaq">Client FAQ</Link></li>
      </ul>
    </div>
  );
}

export function WidgetTwo({ cls, style_2 }: { cls: string; style_2?: boolean }) {
  return (
    <div className={`${cls} mb-20`}>
      <h5 className={`footer-title ${style_2 ? 'text-white' : ''}`}>For Freelancers</h5>
      <ul className="footer-nav-link style-none">
        <li><Link href="/how-to-find-work">How to Find Work</Link></li>
        <li><Link href="/job-list">Video Editing Projects</Link></li>
        <li><Link href="/job-list">Videography Projects</Link></li>
        <li><Link href="/freelancer-faq">Freelancer FAQ</Link></li>
        <li><Link href="/commission-explained">Commission Explained</Link></li>
      </ul>
    </div>
  );
}

export function WidgetThree({ cls, style_2 }: { cls: string; style_2?: boolean }) {
  return (
    <div className={`${cls} mb-20`}>
      <h5 className={`footer-title ${style_2 ? 'text-white' : ''}`}>Video Resources</h5>
      <ul className="footer-nav-link style-none">
        <li><Link href="/coming-soon">Blogs</Link></li>
        <li><Link href="/coming-soon">Video Resources</Link></li>
        <li><Link href="/coming-soon">Success Stories</Link></li>
        {/* <li><Link href="/coming-soon">Help & Support Center</Link></li>
        <li><Link href="/coming-soon">Community Forum</Link></li> */}
      </ul>
    </div>
  );
}

export function WidgetFour({ cls, style_2 }: { cls: string; style_2?: boolean }) {
  return (
    <div className={`${cls} mb-20`}>
      <h5 className={`footer-title ${style_2 ? 'text-white' : ''}`}>Company</h5>
      <ul className="footer-nav-link style-none">
        <li><Link href="/about-us">About Us</Link></li>
        <li><Link href="/coming-soon">Careers</Link></li>
        <li><Link href="/coming-soon">Press & Media</Link></li>
        <li><Link href="/privacy-policy">Privacy Policy</Link></li>
        <li><Link href="/terms-condition">Terms of Service</Link></li>
        <li><Link href="/contact">Contact Us</Link></li>
      </ul>
    </div>
  );
}
