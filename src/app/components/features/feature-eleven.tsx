"use client"
import React, { useState } from 'react';
import AccordionItem from '../accordion/accordion-item';
import VideoPopup from '../common/video-popup';
import CounterOne from '../counter/counter-one';

const FeatureEleven = () => {
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  return (
    <>
      <section className="text-feature-three position-relative pt-100 lg-pt-80 md-pt-50">
        <div className="container">
          <div className="row">
            <div className="col-xxl-11 m-auto">
              <div className="row">
                <div className="col-lg-5">
                  <div className="title-one mt-30 md-mb-40">
                    <h2 className="fw-500">We’ve been helping customer globally.</h2>
                    <p style={{ marginTop: "20px" }}>From the first storyboard sketch to final frame render—we’re the home for video visionaries and the clients who need them.</p>
                  </div>
                </div>
                <div className="col-lg-6 ms-auto">
                  <div className="wow fadeInRight">
                    <div className="accordion accordion-style-one color-two ps-xxl-5 ms-xxl-4" id="accordionOne">
                      <AccordionItem
                        id="one"
                        isShow={true}
                        title="Who are we?"
                        parent="accordionOne"
                        desc={
                          <>
                            We’re the world’s first <strong>dedicated marketplace for pre-production and post-production services.</strong>
                            A space where <strong>videographers, editors, animators, and storytellers</strong> meet brands, startups, and creators who want to make an impact.
                            Born out of the struggle to find <strong>reliable, specialized talent</strong> in the video industry, we set out to build a platform that makes collaboration seamless, creative, and global.
                          </>
                        }
                      />

                      <AccordionItem
                        id="two"
                        title="What’s our goal"
                        parent="accordionOne"
                        desc={
                          <>
                            <p><strong>Our goal is simple:</strong></p>
                            <ul style={{ paddingLeft: '1rem', marginTop: '10px' }}>
                              <li>
                                Empower <strong>freelancers and creators</strong> to turn their craft into thriving careers.
                              </li>
                              <li>
                                Help <strong>clients and brands</strong> find the perfect talent without the noise of generic marketplaces.
                              </li>
                              <li>
                                Build a community where creativity meets opportunity—and everyone wins.
                              </li>
                            </ul>
                          </>
                        }
                      />

                      <AccordionItem
                        id="three"
                        title="Our vision"
                        parent="accordionOne"
                        desc={
                          <>
                            <p>To become the <strong>global hub for video services.</strong></p>
                            <p>
                              Not just a job portal, but a <strong>creative ecosystem</strong> where stories are born, polished, and shared with the world.
                            </p>
                          </>
                        }
                      />

                    </div>
                  </div>
                </div>
              </div>

              <div className="video-post d-flex align-items-center justify-content-center mt-100 lg-mt-50 mb-50 lg-mb-30">
                <a onClick={() => setIsVideoOpen(true)} className="fancybox rounded-circle video-icon tran3s text-center cursor-pointer">
                  <i className="bi bi-play"></i>
                </a>
              </div>
              <div className="border-bottom pb-50 lg-pb-10">
                <div className="row">
                  {/* counter */}
                  <CounterOne style_3={true} />
                  {/* counter */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* video modal start */}
      <VideoPopup isVideoOpen={isVideoOpen} setIsVideoOpen={setIsVideoOpen} videoId={'-6ZbrfSRWKc'} />
      {/* video modal end */}
    </>
  );
};

export default FeatureEleven;