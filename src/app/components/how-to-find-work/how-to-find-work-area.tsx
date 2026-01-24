import React from 'react';

const howToFindWorkData = [
    {
        id: 1,
        title: 'Build Your Profile',
        desc: 'Highlight specialization & upload a high-quality showreel.'
    },
    {
        id: 2,
        title: 'Browse Targeted Gigs',
        desc: 'Filter for Remote Editing or local On-Ground Videography.'
    },
    {
        id: 3,
        title: 'Send Technical Proposal',
        desc: 'Bid with your gear, software, and turnaround time.'
    },
    {
        id: 4,
        title: 'Secure & Create',
        desc: 'Wait for funding (Escrow Coming Soon), then start the work.'
    }
];

const HowToFindWorkArea = () => {
    return (
        <section className="how-it-works-two position-relative pt-100 lg-pt-80 pb-100 lg-pb-80">
            <div className="container">
                {/* <div className="title-one d-flex align-items-center justify-content-between text-center mb-45 lg-mb-20">
                    <span className="line"></span>
                    <h2 className="fw-600 ps-3 pe-3 wow fadeInUp" data-wow-delay="0.3s">How to Find Work in 4 Simple Steps</h2>
                    <span className="line"></span>
                </div> */}

                <div className="row justify-content-center">
                    {howToFindWorkData.map((item) => (
                        <div key={item.id} className="col-xl-3 col-lg-3 col-md-6 mb-35">
                            <div className="card-style-five text-center position-relative h-100 d-flex flex-column wow fadeInUp">
                                <div className="numb fw-500 d-flex align-items-center justify-content-center mx-auto">
                                    <span>0{item.id}</span>
                                </div>
                                <div className="title fw-500 text-lg text-dark mt-25 mb-10" style={{ minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.title}
                                </div>
                                <p className="mb-20">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowToFindWorkArea;
