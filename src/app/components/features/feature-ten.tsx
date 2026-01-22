import React from 'react';
import Link from 'next/link';
import AccordionItem from '../accordion/accordion-item';
import { FeatureImgData } from './feature-one';

const FeatureTen = () => {
  return (
    <section className="text-feature-one position-relative pt-150 lg-pt-100">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5 order-lg-last">
            <div className="wow fadeInRight">
              <div className="title-two">
                <div className="sub-title">Why choose us?</div>
                <h2 className="main-font">World of talent at your fingertips</h2>
              </div>
              <div className="accordion accordion-style-one color-two mt-40" id="accordionOne">
                <AccordionItem
                  id="one"
                  isShow={true}
                  title="Exclusively Video. Unmatched Expertise"
                  desc="Unlike general marketplaces, we're 100% focused on video. Find specialist video editors, freelance videographers, motion graphic artists, and more, all rigorously vetted for top-tier production. Your video creation project deserves dedicated expertise."
                  parent="accordionOne"
                />
                <AccordionItem
                  id="two"
                  title="Pay for Results, Not Subscriptions"
                  desc="Clients post video editing jobs and videography gigs for free. Your payment is kept in secured Account (Escrow Coming Soon) and only transferred to the creators when approved by you. No hidden fees, no monthly subscriptions; just transparent and project-based pricing."
                  parent="accordionOne"
                />
                <AccordionItem
                  id="three"
                  title="Global Reach, Local Impact"
                  desc="Access remote video editors worldwide for any genre, from YouTube video editing to corporate AVs. Plus, find on-ground videographers for local shoots and events. Get the best of both worlds, from outsourcing video editing to execute local video shoots."
                  parent="accordionOne"
                />
                <AccordionItem
                  id="four"
                  title="Smart Tools for Smarter Production"
                  desc="Beyond talent, we empower your workflow. Utilize CompVid for video compression to handle large files with ease. Also get a dedicated dashboard and chat system to manage and execute on going video projects."
                  parent="accordionOne"
                />
                <AccordionItem
                  id="five"
                  title="Vetted Creators. Proven Portfolios"
                  desc="Every video freelancer on MakeMyVid.io is carefully screened. Browse extensive portfolios, view past client reviews, and hire with confidence. We ensure you connect with reliable and high-quality video talent"
                  parent="accordionOne"
                />
              </div>
              {/* <Link href="/coming-soon" className="btn-five mt-45 md-mt-30">Learn More</Link> */}
            </div>
          </div>
          <div className="col-lg-7 col-md-11 m-auto order-lg-first">
            <FeatureImgData />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureTen;