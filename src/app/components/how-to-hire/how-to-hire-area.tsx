import React from 'react';

const howToHireData = [
    {
        id: 1,
        title: 'Post Your Project for Free',
        desc: 'Click "Post a Job" and describe your video needs. Whether you need a 30-second TikTok ad, a corporate documentary, or a local wedding videographer, our platform guides you through the technical specs (resolution, duration, and style).',
        highlight: 'USP Highlight',
        highlightText: '$0 Platform Fees. It costs nothing to post a job and receive quotes.'
    },
    {
        id: 2,
        title: 'Review Vetted Portfolios',
        desc: 'Don’t sift through generic resumes. View dedicated video showreels and portfolios. Our system highlights "Top Rated" creators who have been vetted for quality and reliability.',
        highlight: 'Key Filter',
        highlightText: 'Sort by "On-Ground Videographer" (for local shoots) or "Remote Editor" (for post-production).'
    },
    {
        id: 3,
        title: 'Secure Milestone Payments',
        desc: 'Once you choose a creator, you fund the project. Your payment is held securely in our system (Escrow Coming Soon). Funds are only released to the freelancer once you approve the final video.',
        highlight: 'The Benefit',
        highlightText: 'Total financial peace of mind.'
    },
    {
        id: 4,
        title: 'Review, Edit, and Download',
        desc: 'Use our built-in tools to review drafts. Once satisfied, release the final payment and download your high-resolution files.',
        highlight: 'Pro Tip',
        highlightText: 'Use our free CompVid tool if you need to compress large files for quick social media sharing without losing quality.'
    }
];

const HowToHireArea = () => {
    return (
        <section className="how-it-works-two position-relative pt-100 lg-pt-80 pb-100 lg-pb-80">
            <div className="container">
                {/* <div className="title-one d-flex align-items-center justify-content-between text-center mb-45 lg-mb-20">
                    <span className="line"></span>
                    <h2 className="fw-600 ps-3 pe-3 wow fadeInUp" data-wow-delay="0.3s">How to Hire</h2>
                    <span className="line"></span>
                </div> */}

                <div className="row justify-content-center">
                    {howToHireData.map((item) => (
                        <div key={item.id} className="col-xl-3 col-lg-3 col-md-6 mb-35">
                            <div className="card-style-five text-center position-relative h-100 d-flex flex-column wow fadeInUp">
                                <div className="numb fw-500 d-flex align-items-center justify-content-center mx-auto">
                                    <span>0{item.id}</span>
                                </div>
                                <div className="title fw-500 text-lg text-dark mt-25 mb-10" style={{ minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.title}
                                </div>
                                <p className="mb-20">{item.desc}</p>
                                <div className="highlight-box bg-light p-3 rounded-3 mt-auto d-flex flex-column justify-content-center" style={{ minHeight: '150px' }}>
                                    <span className="fw-bold text-dark d-block mb-1">{item.highlight}:</span>
                                    <span className="fs-6 text-secondary">{item.highlightText}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowToHireArea;
