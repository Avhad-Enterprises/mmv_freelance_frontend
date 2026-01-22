import React from 'react';

const CommissionExplainedArea = () => {
    return (
        <section className="faq-section position-relative pt-100 lg-pt-80 pb-100 lg-pb-80">
            <div className="container">
                <div className="title-one mb-40 lg-mb-20 text-center">
                    {/* <h2 className="fw-normal">Commission Explained</h2> */}
                    <p className="fw-500 fs-5 text-dark">MakeMyVid.io uses a dual structure designed to ensure high-quality applications and maximize your earnings: &quot;Keys to Abundance&quot; for applying, and a success-based commission on won projects.</p>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="bg-white p-4 p-md-5 rounded-3 shadow-sm border mb-35 wow fadeInUp">
                            <h3 className="fw-bold mb-3" style={{ fontFamily: 'var(--gorditas-font)' }}>1. Our Core Philosophy: Quality Over Quantity</h3>
                            <p>Unlike general freelance platforms cluttered with spam proposals, MakeMyVid.io is a specialized ecosystem for professionals. We believe that every application should represent a serious intent to win the job.</p>
                            <p>To maintain a high-quality marketplace where your proposals are taken seriously by clients, we use a two-part system: an application mechanism (Keys) and a success fee (Commission).</p>
                        </div>

                        <div className="bg-white p-4 p-md-5 rounded-3 shadow-sm border mb-35 wow fadeInUp" data-wow-delay="0.1s">
                            <h3 className="fw-bold mb-3" style={{ fontFamily: 'var(--gorditas-font)' }}>2. Part One: &quot;Keys to Abundance&quot; (The Application Mechanism)</h3>
                            <p>To ensure that creators only apply for jobs they are truly qualified for and serious about landing, we utilize a token system called Keys to Abundance.</p>
                            <h5 className="fw-bold mt-4 mb-2" style={{ fontFamily: 'var(--gorditas-font)' }}>How Keys Work:</h5>
                            <ul className="style-none list-item">
                                <li><strong>The Golden Rule:</strong> 1 Application = 1 Key.</li>
                                <li>To submit a proposal to any project listed on the platform, you must use one Key from your balance.</li>
                                <li>This ensures that when a client receives your proposal, they know you have invested in the opportunity and are not just &quot;spray and praying&quot; applications.</li>
                            </ul>
                            <h5 className="fw-bold mt-4 mb-2" style={{ fontFamily: 'var(--gorditas-font)' }}>Getting Keys:</h5>
                            <ul className="style-none list-item">
                                <li>Freelancers must purchase Keys to Abundance packages via their creator dashboard to begin applying for jobs.</li>
                                <li><strong>Tip:</strong> Purchasing larger bundles typically offers a better per-key rate.</li>
                            </ul>
                        </div>

                        <div className="bg-white p-4 p-md-5 rounded-3 shadow-sm border mb-35 wow fadeInUp" data-wow-delay="0.2s">
                            <h3 className="fw-bold mb-3" style={{ fontFamily: 'var(--gorditas-font)' }}>3. Part Two: The Commission Structure (The Success Fee)</h3>
                            <p>While Keys get you to the table, our commission is charged only when you succeed. We charge a sliding service fee between 8% and 15% on successfully completed projects.</p>
                            <h5 className="fw-bold mt-4 mb-2" style={{ fontFamily: 'var(--gorditas-font)' }}>Key Takeaways:</h5>
                            <ul className="style-none list-item">
                                <li><strong>Deducted Upon Earnings:</strong> This fee is only deducted from the final project milestone amount after you have delivered the work and the client has released payment.</li>
                                <li><strong>Competitive Range:</strong> Our rates are geared toward specialized talent, ensuring you keep the majority of your earnings. The specific percentage (8%, 10%, 12%, or 15%) depends on factors such as project volume and the lifetime value of the client relationship.</li>
                            </ul>
                        </div>

                        <div className="bg-white p-4 p-md-5 rounded-3 shadow-sm border mb-35 wow fadeInUp" data-wow-delay="0.3s">
                            <h3 className="fw-bold mb-3" style={{ fontFamily: 'var(--gorditas-font)' }}>4. Where Do These Fees Go?</h3>
                            <p>We reinvest revenue from Key purchases and service fees back into running a secure, high-performance marketplace dedicated solely to video production. This covers:</p>
                            <ul className="style-none list-item">
                                <li><strong>Reducing Competition:</strong> By requiring Keys, we eliminate low-effort spam applications, meaning your proposal competes against fewer, higher-quality freelancers.</li>
                                <li><strong>Client Acquisition Marketing:</strong> Aggressive campaigns to ensure a constant flow of high-budget video job postings.</li>
                                <li><strong>Secure Payment Protection:</strong> Managing payments and holding client funds securely before you start work (Escrow Coming Soon).</li>
                            </ul>
                        </div>

                        <div className="bg-light p-4 p-md-5 rounded-3 border wow fadeInUp" data-wow-delay="0.4s">
                            <h3 className="fw-bold mb-3" style={{ fontFamily: 'var(--gorditas-font)' }}>5. Practical Example: The Full Journey</h3>
                            <p>Let’s say you spot a remote video editing project with a budget of $1,000, and the service fee for this project type is set at 10%.</p>
                            <ul className="style-none list-item">
                                <li><strong>The Application:</strong> You decide this is the perfect job for you. You use 1 Key to Abundance from your balance to send your proposal.</li>
                                <li><strong>The Hired Status:</strong> The client loves your proposal and hires you. They deposit $1,000 (Escrow Coming Soon).</li>
                                <li><strong>Work & Delivery:</strong> You complete the video edit and submit it for final approval.</li>
                                <li><strong>Payment Release:</strong> The client approves the work and releases funds.</li>
                            </ul>
                            <div className="bg-white p-3 rounded-3 mt-4 border">
                                <h5 className="fw-bold mb-2" style={{ fontFamily: 'var(--gorditas-font)' }}>The Calculation:</h5>
                                <ul className="style-none">
                                    <li className="d-flex justify-content-between mb-2"><span>Total Project Value:</span> <span className="fw-bold">$1,000</span></li>
                                    <li className="d-flex justify-content-between mb-2"><span>MakeMyVid.io Service Fee (10%):</span> <span className="text-danger fw-bold">-$100</span></li>
                                    <li className="d-flex justify-content-between border-top pt-2"><span>Your Net Earnings sent to your wallet:</span> <span className="text-success fw-bold text-lg">$900</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommissionExplainedArea;
