import React from "react";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";
import JobCategorySelect from "../select/job-category";

const SearchForm = () => {
  const { handleSubmit, setCategoryVal } = useSearchFormSubmit();

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-9">
          <div className="input-box">
            <div className="label">Category</div>
            <JobCategorySelect setCategoryVal={setCategoryVal} />
          </div>
        </div>
        <div className="col-md-3">
          <button
            type="submit"
            className="fw-500 text-uppercase h-100 tran3s search-btn"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
