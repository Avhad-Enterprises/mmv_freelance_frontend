import React from 'react';
import Link from 'next/link';
import AccordionItem from '../accordion/accordion-item';

import { faq_content } from '@/data/faq-data/index';

const FaqArea = () => {
  return (
    <section className="faq-section position-relative pt-100 lg-pt-80">
      <div className="container">
        <ul className="nav nav-tabs border-0 justify-content-center" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#fc1_tab" role="tab">All</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc2_tab" role="tab">Clients</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc3_tab" role="tab">Freelancers</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc4_tab" role="tab">Account</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc5_tab" role="tab">Payments</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc6_tab" role="tab">Projects & Workflow</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc7_tab" role="tab">Platform Tools</button>
          </li>
        </ul>
        <div className="bg-wrapper mt-60 lg-mt-40">
          <div className="tab-content" id="myTabContent">
            {/* All FAQs */}
            {/* <div className="tab-pane fade show active" role="tabpanel" id="fc1_tab">
              <div className="accordion accordion-style-two" id="accordionAll">
                {faq_content.gettingStarted.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                    isShow={index === 0} // Show the first item by default
                  />
                ))}
                {faq_content.forClients.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
                 {faq_content.forFreelancers.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
                 {faq_content.accountManagement.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
                 {faq_content.paymentsFeesSecurity.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
                 {faq_content.projectsWorkflow.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
                 {faq_content.platformToolsFeatures.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
              </div>
            </div> */}

            {/* getting started FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc1_tab">
              <div className="accordion accordion-style-two" id="accordionClients">
                {faq_content.gettingStarted.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionClients'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>


            {/* Clients FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc2_tab">
              <div className="accordion accordion-style-two" id="accordionClients">
                {faq_content.forClients.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionClients'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Freelancers FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc3_tab">
              <div className="accordion accordion-style-two" id="accordionFreelancers">
                {faq_content.forFreelancers.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionFreelancers'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Account FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc4_tab">
              <div className="accordion accordion-style-two" id="accordionAccount">
                {faq_content.accountManagement.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAccount'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Payments FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc5_tab">
              <div className="accordion accordion-style-two" id="accordionPayments">
                {faq_content.paymentsFeesSecurity.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionPayments'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Projects & Workflow FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc6_tab">
              <div className="accordion accordion-style-two" id="accordionProjectsWorkflow">
                {faq_content.projectsWorkflow.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionProjectsWorkflow'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Platform Tools FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc7_tab">
              <div className="accordion accordion-style-two" id="accordionPlatformTools">
                {faq_content.platformToolsFeatures.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionPlatformTools'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="text-center border-bottom pb-150 lg-pb-50 mt-60 lg-mt-40 wow fadeInUp">
          <div className="title-three mb-30">
            <h2 className="fw-normal">Don’t get your answer?</h2>
          </div>
          <Link href='/contact' className="btn-one">Contact Us</Link>
        </div>
      </div>
    </section>
  );
};

export default FaqArea;