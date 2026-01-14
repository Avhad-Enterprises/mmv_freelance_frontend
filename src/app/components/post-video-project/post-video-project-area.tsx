import React from 'react';

const postProjectData = [
    {
        id: 1,
        title: 'Tell us what you need',
        desc: 'Give your project a clear name (e.g., "Need a 30-second TikTok ad"). Choose between a Remote Video Editor or an On-Ground Videographer.',
        highlight: 'The Brief',
        highlightText: 'Describe your video goals. What is the story? Who is the audience?'
    },
    {
        id: 2,
        title: 'Define the technical details',
        desc: 'Specify duration (e.g., Under 60s), Resolution (4K, 9:16/16:9), and optionally software preference (Premiere Pro, DaVinci Resolve).',
        highlight: 'Raw Footage',
        highlightText: 'Tell your creator how much source footage you already have (e.g., 10GB or 100GB).'
    },
    {
        id: 3,
        title: 'Set your schedule and pay',
        desc: 'Set your deadline (ASAP, 1 week) and choose between Fixed Price or Hourly Rate.',
        highlight: 'Secure Payment',
        highlightText: 'Set your budget. Remember, MakeMyVid.io charges clients $0 platform fees to post and hire.'
    }
];

const PostVideoProjectArea = () => {
    return (
        <section className="how-it-works-two position-relative pt-100 lg-pt-80 pb-100 lg-pb-80">
            <div className="container">
                <div className="row justify-content-center">
                    {postProjectData.map((item) => (
                        <div key={item.id} className="col-xl-4 col-lg-4 col-md-6 mb-35">
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

export default PostVideoProjectArea;
