'use client';
import React, { useState, useEffect } from 'react';
import { IJobType } from '@/types/job-data-type';
import { useRouter } from 'next/navigation';
import ApplyFormModal from '../forms/ApplyFormModal';


const JobDetailsV1Area = ({ job }: { job: IJobType }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (you can replace this with real auth logic)
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleApplyClick = () => {
    if (isLoggedIn) {
      setShowModal(true);
    } else {
      router.push('/');
    }
  };

  return (
    <section className="job-details pt-100 lg-pt-80 pb-130 lg-pb-80">
      <div className="container">
        <div className="row">
          {/* Left Side: Details */}
          <div className="col-xxl-9 col-xl-8">
            <div className="details-post-data me-xxl-5 pe-xxl-4">
              <div className="post-date">
                {job.created_at?.slice(0, 10)} by{" "}
                <span className="fw-500 text-dark">{job.project_title}</span>
              </div>

              <h3 className="post-title">{job.project_title}</h3>

              {/* <ul className="share-buttons d-flex flex-wrap style-none">
                <li><a href="#"><i className="bi bi-facebook"></i><span>Facebook</span></a></li>
                <li><a href="#"><i className="bi bi-twitter"></i><span>Twitter</span></a></li>
                <li><a href="#"><i className="bi bi-link-45deg"></i><span>Copy</span></a></li>
              </ul> */}

              {/* Job Description */}
              <div className="post-block border-style mt-50 lg-mt-30">
                <div className="d-flex align-items-center">
                  <div className="block-numb text-center fw-500 text-white rounded-circle me-2">1</div>
                  <h4 className="block-title">Job Description</h4>
                </div>

                <ul className="list-type-two style-none mb-15">
                  <li>{<a>{job.project_description}</a>}</li>
                  <li>{<a>{job.additional_notes}</a>}</li>
                </ul>
              </div>

              {/* Additional Information */}
              <div className="post-block border-style mt-50 lg-mt-30">
                <div className="d-flex align-items-center">
                  <div className="block-numb text-center fw-500 text-white rounded-circle me-2">2</div>
                  <h4 className="block-title">Additional Information</h4>
                </div>
                <ul className="list-type-two style-none mb-15">
                  <li>Project Type: {job.projects_type} </li>
                  <li>Project Format: {job.project_format}</li>
                  <li>Audio Voiceover: {job.audio_voiceover} </li>
                  <li>Seconds: {job.video_length} </li>
                  <li>Video Style: {job.preferred_video_style}</li>
                </ul>
              </div>

              {/* Skills Required */}
              <div className="post-block border-style mt-40 lg-mt-30">
                <div className="d-flex align-items-center">
                  <div className="block-numb text-center fw-500 text-white rounded-circle me-2">3</div>
                  <h4 className="block-title">Required Skills</h4>
                </div>
                <ul className="list-type-two style-none mb-15">
                  {job.skills_required?.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              </div>

              {/* Reference Links */}
              {job.reference_links?.length && (
                <div className="post-block border-style mt-40 lg-mt-30">
                  <div className="d-flex align-items-center">
                    <div className="block-numb text-center fw-500 text-white rounded-circle me-2">4</div>
                    <h4 className="block-title">Reference Links</h4>
                  </div>
                  <ul className="list-type-two style-none mb-15">
                    {job.reference_links.map((link, i) => (
                      <li key={i}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Currently not in use */}
              {/* Files */}
              {/* {job.project_files?.length > 0 && (
                <div className="post-block border-style mt-40 lg-mt-30">
                  <div className="d-flex align-items-center">
                    <div className="block-numb text-center fw-500 text-white rounded-circle me-2">5</div>
                    <h4 className="block-title">Project Files</h4>
                  </div>
                  <ul className="list-type-two style-none mb-15">
                    {job.project_files.map((file, idx) => (
                      <li key={idx}>{file}</li>
                    ))}
                  </ul>
                </div>
              )} */}
            </div>
          </div>

          {/* Right Side: Metadata */}
          <div className="col-xxl-3 col-xl-4">
            <div className="job-company-info ms-xl-5 ms-xxl-0 lg-mt-50">
              <div className="text-md text-dark text-center mt-15 mb-20 text-capitalize">
                {job.project_title}
              </div>
              {/* <a href="#" className="website-btn tran3s">Visit website</a> */}

              <div className="border-top mt-40 pt-40">
                <ul className="job-meta-data row style-none">
                  <li className="col-6">
                    <span>Budget</span>
                    <div>${job.budget}</div>
                  </li>
                  <li className="col-6">
                    <span>Deadline</span>
                    <div>{job.deadline?.slice(0, 10)}</div>
                  </li>
                  <li className="col-6">
                    <span>Duration</span>
                    <div>{job.video_length} sec</div>
                  </li>
                  <li className="col-6">
                    <span>Posted</span>
                    <div>{job.created_at?.slice(0, 10)}</div>
                  </li>
                </ul>

                <div className="job-tags d-flex flex-wrap pt-15">
                  {job.tags?.map((tag, idx) => (
                    <a key={idx} href="#">{tag}</a>
                  ))}
                </div>

                <button className="btn-one w-100 mt-25" onClick={handleApplyClick}>
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyFormModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        projectId={job.projects_task_id || 0}
        // userId={job.client_id}
      />
    </section>
  );
};

export default JobDetailsV1Area;
