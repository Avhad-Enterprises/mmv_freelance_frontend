import React from "react";
import Link from "next/link";
import AccordionItem from "../accordion/accordion-item";

import { home_faq_data } from "@/data/faq-data/index";

export function FaqItems() {
  return (
    <div className="accordion accordion-style-two" id="accordionTwo">
      {home_faq_data.map((f) => (
        <AccordionItem
          key={f.id}
          id={f.id}
          isShow={f.isShow}
          title={f.title}
          desc={f.desc}
          parent={"accordionTwo"}
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
