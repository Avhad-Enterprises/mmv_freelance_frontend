import React from 'react';

export default function ProjectSearchForm() {
  return (
    <div className="container">
      <div className="widget-listing-search-form horizontal">
        <form id="filter-listing-form-TWOYa" action="https://demoapus1.com/freeio/projects-list/" className="form-search filter-listing-form" method="GET">
          <div className="search-form-inner">
            <div className="main-inner clearfix">
              <div className="content-main-inner">
                <div className="row align-items-center">
                  <div className="col-12 col-md-10 mb-3">
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="flaticon-loupe"></i>
                        </span>
                        <input
                          type="text"
                          name="filter-title"
                          className="form-control"
                          id="TWOYa_title"
                          placeholder="Project title, keywords"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-2">
                    <div className="d-flex justify-content-end">
                      <button className="btn btn-primary w-100" type="submit">Search</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
