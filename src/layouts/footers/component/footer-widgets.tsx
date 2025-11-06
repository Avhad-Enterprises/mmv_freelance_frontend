import Link from 'next/link';
import React from 'react';

export function WidgetOne({ cls,style_2 }: { cls: string;style_2?:boolean }) {
  return (
    <div className={`${cls} mb-20`}>
      <h5 className={`footer-title ${style_2?'text-white':''}`}>Services​</h5>
      <ul className="footer-nav-link style-none">
        <li><Link href="/coming-soon">Browse Jobs</Link></li>
        <li><Link href="/coming-soon">Companies</Link></li>
        <li><Link href="/coming-soon">Candidates</Link></li>
        <li><Link href="/coming-soon">Pricing</Link></li>
      </ul>
    </div>
  )
}

export function WidgetTwo({ cls,style_2 }: { cls: string;style_2?:boolean }) {
  return (
    <div className={`${cls} mb-20`}>
      <h5 className={`footer-title ${style_2?'text-white':''}`}>Company</h5>
      <ul className="footer-nav-link style-none">
        <li><Link href="/coming-soon">About us</Link></li>
        <li><Link href="/coming-soon">Blogs</Link></li>
        <li><Link href="/coming-soon">FAQ’s</Link></li>
        <li><Link href='/coming-soon'>Contact</Link></li>
      </ul>
    </div>
  )
}

export function WidgetThree({ cls,style_2 }: { cls: string;style_2?:boolean }) {
  return (
    <div className={`${cls} mb-20`}>
      <h5 className={`footer-title ${style_2?'text-white':''}`}>Support</h5>
      <ul className="footer-nav-link style-none">
        <li><Link href='/coming-soon'>Terms of use</Link></li>
        <li><Link href='/coming-soon'>Terms & conditions</Link></li>
        <li><Link href='/coming-soon'>Privacy</Link></li>
        <li><Link href='/coming-soon'>Cookie policy</Link></li>
      </ul>
    </div>
  )
}

