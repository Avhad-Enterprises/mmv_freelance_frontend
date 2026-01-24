import React from 'react';
import Link from 'next/link';
import AccordionItem from '../accordion/accordion-item';

import { freelancer_faq_data } from '@/data/faq-data/index';

const FreelancerFaqArea = () => {
    return (
        <section className="faq-section position-relative pt-100 lg-pt-80">
            <div className="container">
                <div className="title-one mb-40 lg-mb-20 text-center">
                    {/* <h2 className="fw-normal">Freelancer FAQs</h2> */}
                </div>
                <div className="bg-wrapper mt-60 lg-mt-40">
                    <div className="accordion accordion-style-two" id="accordionFreelancerFaq">
                        {freelancer_faq_data.map((faq, index) => (
                            <AccordionItem
                                key={faq.id}
                                id={faq.id}
                                title={faq.title}
                                desc={faq.desc}
                                parent='accordionFreelancerFaq'
                                isShow={index === 0}
                            />
                        ))}
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

export default FreelancerFaqArea;
