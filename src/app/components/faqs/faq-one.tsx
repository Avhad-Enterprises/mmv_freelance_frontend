import React from "react";
import Link from "next/link";
import AccordionItem from "../accordion/accordion-item";
import { LandingFaq } from "@/types/cms.types";

// Default faq data (fallback if no CMS data)
const default_faq_data: {
  id: string;
  title: string;
  desc: string;
  isShow?: boolean;
  parent: string;
}[] = [
  {
    id: "One",
    title:
      "What are the costs involved for clients to hire video editors or videographers?",
    desc: "Clients can post video editing projects for free and hire videographers online with no upfront costs. MakeMyVid.io operates on a transparent, project-based model. There are no hidden fees or platform charges for clients to outsource video editing or production.",
    parent: "accordionTwo",
  },
  {
    id: "Two",
    title: "How does MakeMyVid.io ensure quality video talent?",
    desc: "MakeMyVid.io features vetted video editors, professional videographers, and expert motion graphic artists. Every video freelancer undergoes a rigorous screening process, and client reviews are transparent. We are dedicated to connecting you with high-quality video talent for all your video creation needs, ensuring professional video production services.",
    isShow: true,
    parent: "accordionTwo",
  },
  {
    id: "Three",
    title:
      "How do freelance videographers and video editors get paid on MakeMyVid.io and what are the fees?",
    desc: "Freelance videographers on MakeMyVid.io benefit from 0% commission on projects. This means video creators get paid securely and retain 100% of their earnings. Videographers are paid directly by clients. Freelance Video Editors are charged flat 12.5% commission on each payout. Our secure payment system ensures timely and reliable transfers for all video editing gigs.",
    parent: "accordionTwo",
  },
];

interface FaqItemsProps {
  faqs?: LandingFaq[];
}

export function FaqItems({ faqs = [] }: FaqItemsProps) {
  // Use CMS data if available, otherwise use default data
  const displayData =
    faqs.length > 0
      ? faqs.map((faq, index) => ({
          id: `faq-${faq.id}`,
          title: faq.question,
          desc: faq.answer,
          isShow: index === 0,
          parent: "accordionTwo",
        }))
      : default_faq_data;

  return (
    <div className="accordion accordion-style-two" id="accordionTwo">
      {displayData.map((f) => (
        <AccordionItem
          key={f.id}
          id={f.id}
          isShow={f.isShow}
          title={f.title}
          desc={f.desc}
          parent={f.parent}
        />
      ))}
    </div>
  );
}
const FaqOne = () => {
  return (
    <>
      <section className="faq-section position-relative mt-180 xl-mt-150 lg-mt-100 mb-150 lg-mb-100">
        <div className="container">
          <div className="title-one text-center">
            <h2 className="text-dark wow fadeInUp" data-wow-delay="0.3s">
              Questions & Answers
            </h2>
          </div>
          <div className="bg-wrapper mt-60 lg-mt-40">
            <FaqItems />
          </div>
          <div className="text-center mt-50 sm-mt-40 wow fadeInUp">
            <div className="btn-eight style-two fw-500">
              Don’t find the answer? We can help.{" "}
              <Link href="/faq">Click here</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FaqOne;
