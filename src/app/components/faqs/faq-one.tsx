import React from "react";
import Link from "next/link";
import AccordionItem from "../accordion/accordion-item";

// faq data
const faq_data: {
  id: string;
  title: string;
  desc: string;
  isShow?: boolean;
  parent: string;
}[] = [
    {
      id: "One",
      title: "What are the costs involved for clients to hire video editors or videographers?",
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
      title: "How do freelance videographers and video editors get paid on MakeMyVid.io and what are the fees?",
      desc: "Freelance videographers on MakeMyVid.io benefit from 0% commission on projects. This means video creators get paid securely and retain 100% of their earnings. Videographers are paid directly by clients. Freelance Video Editors are charged flat 12.5% commission on each payout. Our secure payment system ensures timely and reliable transfers for all video editing gigs.",
      parent: "accordionTwo",
    },
    {
      id: "Four",
      title: "Can I find specialized talent for specific video types, like YouTube or corporate videos?",
      desc: "Absolutely! MakeMyVid.io specializes in all forms of video content. You can find YouTube video editors, corporate video production specialists, wedding videography editors, Reels & Shorts editors, documentary film editors, and experts in 2D & 3D animation. Our advanced search helps you filter for precise video production services.",
      parent: "accordionTwo",
    },
    {
      id: "Five",
      title: "Does MakeMyVid.io offer any tools to help with video production workflow?",
      desc: "Yes! We provide free integrated tools to enhance your video production workflow. Utilize CompVid for video compression. These tools are designed to support both clients and video freelancers in efficient video content creation.",
      parent: "accordionTwo",
    },
    {
      id: "Six",
      title: "Is it possible to find on-ground videographers in specific locations?",
      desc: "Yes, MakeMyVid.io offers a global network where you can find on-ground videographers for local shoots and events. Simply specify the location in your job post or search filters to connect with local video professionals for your event highlight videos, corporate shoots, or personal projects.",
      parent: "accordionTwo",
    },
  ];

export function FaqItems() {
  return (
    <div className="accordion accordion-style-two" id="accordionTwo">
      {faq_data.map((f) => (
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
  )
}
const FaqOne = () => {
  return (
    <>
      <section className="faq-section position-relative mt-180 xl-mt-150 lg-mt-100 mb-150 lg-mb-100">
        <div className="container">
          <div className="title-one text-center">
            <h2 className="text-dark wow fadeInUp" data-wow-delay="0.3s">Questions & Answers</h2>
          </div>
          <div className="bg-wrapper mt-60 lg-mt-40">
            <FaqItems/>
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
