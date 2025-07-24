'use client';
import { useState } from 'react';

export default function ProjectFilterSidebar() {
  const [projectType, setProjectType] = useState('');
  const [englishLevel, setEnglishLevel] = useState('');

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ projectType, englishLevel });
  };

  const categories = [
    "Business", "Design & Creative", "Development & IT", "Digital Marketing",
    "Lifestyle", "Music & Audio", "Programming & Tech", "Trending",
    "Video & Animation", "Writing & Translation"
  ];

  const skills = [
    "Adobe Photoshop", "Adobe XD", "Android Developer", "Artist", "Computer",
    "Developer", "Front end Developer", "IOS Developer", "Support Agent", "Writter"
  ];

  const cities = ["Boston", "Florida", "Los Angeles", "Miami", "New York"];

  const languages = ["English", "French", "Italian", "Japanese", "Spanish", "Turkish"];

  return (
    <div className="container">
      <div className="sidebar sidebar-left">
        <div className="widget-listing-search-form vertical">
          <form className="form-search filter-listing-form" onSubmit={handleSubmit}>
            <div className="search-form-inner">
              <div className="main-inner clearfix">
                <div className="content-main-inner">
                  <div className="row">

                    {/* Category Filter */}
                    <div className="col-12 mb-3">
                      <div className="form-group">
                        <label className="heading-label">Category</label>
                        <div className="form-group-inner">
                          <ul className="list-unstyled">
                            {categories
                              .filter((_, i) => showAllCategories || i < 5)
                              .map((name, index) => (
                                <li key={index} className="list-item">
                                  <div className="list-item-inner">
                                    <input
                                      id={`filter-category-${index}`}
                                      type="checkbox"
                                      name="filter-category[]"
                                      value={96 + index}
                                    />
                                    <label htmlFor={`filter-category-${index}`}>{name}</label>
                                  </div>
                                </li>
                              ))}
                          </ul>
                          <a href="#" onClick={(e) => { e.preventDefault(); setShowAllCategories(!showAllCategories); }} className="toggle-filter-viewmore">
                            <span className="icon-more"><i className="ti-plus"></i></span>{" "}
                            <span className="text">{showAllCategories ? "Show Less" : "Show More"}</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Project Type */}
                    <div className="col-12 mb-3">
                      <div className="form-group">
                        <label htmlFor="project_type" className="heading-label">Project type</label>
                        <div className="form-group-inner">
                          <select
                            name="filter-project_type"
                            className="form-control"
                            id="project_type"
                            value={projectType}
                            onChange={(e) => setProjectType(e.target.value)}
                          >
                            <option value="">Select Project Type</option>
                            <option value="fixed">Fixed project</option>
                            <option value="hourly">Hourly Based Project</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="col-12 mb-3">
                      <div className="form-group">
                        <label className="heading-label">Price</label>
                        <div className="form-group-inner">
                          <div className="from-to-wrapper">
                            <span className="inner">
                              <span className="from-text">$<span className="price-text">0</span></span>
                              <span className="space">-</span>
                              <span className="to-text">$<span className="price-text">200</span></span>
                            </span>
                          </div>
                          <input type="hidden" name="filter-price-from" value="0" />
                          <input type="hidden" name="filter-price-to" value="200" />
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="col-12 mb-3">
                      <div className="form-group">
                        <label className="heading-label">Skills</label>
                        <div className="form-group-inner">
                          <ul className="terms-list circle-check level-0">
                            {skills
                              .filter((_, i) => showAllSkills || i < 5)
                              .map((skill, i) => (
                                <li key={i} className="list-item level-0">
                                  <div className="list-item-inner">
                                    <input
                                      id={`skill-${i}`}
                                      type="checkbox"
                                      name="filter-project_skill[]"
                                      value={100 + i}
                                    />
                                    <label htmlFor={`skill-${i}`}>{skill}</label>
                                  </div>
                                </li>
                              ))}
                          </ul>
                          <a href="#" onClick={(e) => { e.preventDefault(); setShowAllSkills(!showAllSkills); }} className="toggle-filter-viewmore">
                            <span className="icon-more"><i className="ti-plus"></i></span>{" "}
                            <span className="text">{showAllSkills ? "Show Less" : "Show More"}</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* City Filter */}
                    <div className="col-12 mb-3">
                      <div className="form-group">
                        <label className="heading-label">City</label>
                        <div className="form-group-inner">
                          <ul className="terms-list circle-check level-0">
                            {cities
                              .filter((_, i) => showAllCities || i < 3)
                              .map((city, i) => (
                                <li key={i} className="list-item level-0">
                                  <div className="list-item-inner">
                                    <input
                                      id={`city-${i}`}
                                      type="checkbox"
                                      name="filter-location[]"
                                      value={170 + i}
                                    />
                                    <label htmlFor={`city-${i}`}>{city}</label>
                                  </div>
                                </li>
                              ))}
                          </ul>
                          <a href="#" onClick={(e) => { e.preventDefault(); setShowAllCities(!showAllCities); }} className="toggle-filter-viewmore">
                            <span className="icon-more"><i className="ti-plus"></i></span>{" "}
                            <span className="text">{showAllCities ? "Show Less" : "Show More"}</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="col-12 mb-3">
                      <div className="form-group">
                        <label className="heading-label">Languages</label>
                        <div className="form-group-inner">
                          <ul className="terms-list circle-check level-0">
                            {languages
                              .filter((_, i) => showAllLanguages || i < 3)
                              .map((lang, i) => (
                                <li key={i} className="list-item level-0">
                                  <div className="list-item-inner">
                                    <input
                                      id={`language-${i}`}
                                      type="checkbox"
                                      name="filter-project_language[]"
                                      value={90 + i}
                                    />
                                    <label htmlFor={`language-${i}`}>{lang}</label>
                                  </div>
                                </li>
                              ))}
                          </ul>
                          <a href="#" onClick={(e) => { e.preventDefault(); setShowAllLanguages(!showAllLanguages); }} className="toggle-filter-viewmore">
                            <span className="icon-more"><i className="ti-plus"></i></span>{" "}
                            <span className="text">{showAllLanguages ? "Show Less" : "Show More"}</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* English Level */}
                    <div className="col-12 mb-3">
                      <div className="form-group">
                        <label htmlFor="english_level" className="heading-label">English Level</label>
                        <div className="form-group-inner">
                          <select
                            name="filter-english_level"
                            className="form-control"
                            id="english_level"
                            value={englishLevel}
                            onChange={(e) => setEnglishLevel(e.target.value)}
                          >
                            <option value="">Select Level</option>
                            <option value="Basic">Basic</option>
                            <option value="Conversational">Conversational</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Native Or Bilingual">Native Or Bilingual</option>
                            <option value="Professional">Professional</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 form-group-search">
                      <button
                        type="submit"
                        className="btn-submit w-100 btn btn-theme btn-inverse"
                        style={{ backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold' }}
                      >
                        Search <i className="flaticon-right-up next"></i>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
