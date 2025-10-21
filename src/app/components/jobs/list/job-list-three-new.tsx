"use client";
import React, { useState, useEffect } from "react";
import FilterArea from "../filter/filter-area-new";
import ListItemTwo from "./list-item-2";
import JobGridItem from "../grid/job-grid-item";
import Pagination from "@/ui/pagination";
import NiceSelect from "@/ui/nice-select";
import { useAppSelector } from "@/redux/hook";
import { IJobType } from "@/types/job-data-type";
import { makeGetRequest, makePostRequest, makeDeleteRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";
import SaveJobLoginModal from "@/app/components/common/popup/save-job-login-modal";

// Currency conversion rates (hardcoded, base currency: USD)
const EXCHANGE_RATES: { [key: string]: number } = {
  'USD': 1,
  'INR': 83.12,
  'EUR': 0.92,
  'GBP': 0.79,
  'JPY': 149.50,
  'AUD': 1.52,
  'CAD': 1.36,
  'CHF': 0.88,
  'CNY': 7.24,
  'NZD': 1.67,
  'SGD': 1.34,
  'HKD': 7.83,
  'KRW': 1338.50,
  'SEK': 10.87,
  'NOK': 10.93,
  'DKK': 6.88,
  'MXN': 17.12,
  'BRL': 4.98,
  'ZAR': 18.65,
  'RUB': 92.50,
  'TRY': 34.15,
  'AED': 3.67,
  'SAR': 3.75,
  'MYR': 4.48,
  'THB': 34.82,
  'IDR': 15680.00,
  'PHP': 56.45,
  'PLN': 3.98,
  'CZK': 23.15,
  'ILS': 3.68,
};

const convertToUserCurrency = (amountInUSD: number, userCurrency: string): number => {
  const rate = EXCHANGE_RATES[userCurrency] || 1;
  return amountInUSD * rate;
};

const JobListThree = ({
  itemsPerPage,
  grid_style = false,
}: {
  itemsPerPage: number;
  grid_style?: boolean;
}) => {
  // Component State
  const [all_jobs, setAllJobs] = useState<IJobType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentItems, setCurrentItems] = useState<IJobType[] | null>(null);
  const [filterItems, setFilterItems] = useState<IJobType[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [priceValue, setPriceValue] = useState<[number, number]>([0, 10000]);
  const [shortValue, setShortValue] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set<number>());
  const [userCurrency, setUserCurrency] = useState<string>('USD');

  // Available options from jobs
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  // Redux
  const decoded = useDecodedToken();
  const { projects_type, search_key } = useAppSelector((state) => state.filter);

  // Data Fetching Effect
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [jobsRes, userRes] = await Promise.all([
          makeGetRequest("api/v1/projects-tasks/listings"),
          makeGetRequest("api/v1/users/me"),
        ]);

        const jobsData = jobsRes.data.data || [];
        setAllJobs(jobsData);

        // Get user currency
        const userData = userRes.data?.data;
        const currency = userData?.profile?.currency || 'USD';
        setUserCurrency(currency);

        // Extract unique skills from all jobs
        const skillsSet = new Set<string>();
        jobsData.forEach((job: IJobType) => {
          if (job.skills_required && Array.isArray(job.skills_required)) {
            job.skills_required.forEach(skill => {
              if (skill) skillsSet.add(skill);
            });
          }
        });
        setAvailableSkills(Array.from(skillsSet).sort());

        // Extract unique project types from all jobs
        const typesSet = new Set<string>();
        jobsData.forEach((job: IJobType) => {
          if (job.projects_type) {
            typesSet.add(job.projects_type);
          }
        });
        setAvailableTypes(Array.from(typesSet).sort());

        // Calculate max budget in user's currency
        const maxBudgetUSD = Math.max(...jobsData.map((j: any) => j.budget || 0), 0);
        setPriceValue([0, maxBudgetUSD || 10000]);

        if (decoded && decoded.user_id) {
          try {
            const savedProjectsRes = await makeGetRequest("api/v1/saved/my-saved-projects");
            const savedProjectsData = savedProjectsRes.data.data || [];
            
            const initialSavedIds = new Set<number>(
              savedProjectsData.map((item: any) => item.projects_task_id)
            );
            
            setSavedJobIds(initialSavedIds);
          } catch (error) {
            console.error("Error fetching saved projects:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [decoded]);

  // Filtering and Sorting Effect
  useEffect(() => {
    let filteredData = all_jobs;

    if (selectedSkills.length > 0) {
      filteredData = filteredData.filter((item) =>
        item.skills_required?.some(jobSkill => 
          jobSkill && selectedSkills.includes(jobSkill)
        )
      );
    }

    if (selectedTypes.length > 0) {
      filteredData = filteredData.filter((item) =>
        item.projects_type && selectedTypes.includes(item.projects_type)
      );
    }

    if (projects_type) {
      filteredData = filteredData.filter(
        (item) => item.projects_type?.toLowerCase() === projects_type.toLowerCase()
      );
    }

    // Filter by budget range (convert job budget to user currency for comparison)
    filteredData = filteredData.filter((item) => {
      const budgetInUserCurrency = convertToUserCurrency(item.budget ?? 0, userCurrency);
      return budgetInUserCurrency >= convertToUserCurrency(priceValue[0], userCurrency) && 
             budgetInUserCurrency <= convertToUserCurrency(priceValue[1], userCurrency);
    });

    if (search_key) {
      filteredData = filteredData.filter((item) =>
        item.project_title?.toLowerCase().includes(search_key.toLowerCase()) ||
        item.project_description?.toLowerCase().includes(search_key.toLowerCase())
      );
    }

    if (shortValue === "price-low-to-high") {
      filteredData = filteredData.slice().sort((a, b) => (a.budget ?? 0) - (b.budget ?? 0));
    } else if (shortValue === "price-high-to-low") {
      filteredData = filteredData.slice().sort((a, b) => (b.budget ?? 0) - (a.budget ?? 0));
    }

    const endOffset = itemOffset + itemsPerPage;
    setFilterItems(filteredData);
    setCurrentItems(filteredData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredData.length / itemsPerPage));
  }, [
    itemOffset, itemsPerPage, selectedSkills, selectedTypes, projects_type,
    all_jobs, priceValue, shortValue, search_key, userCurrency,
  ]);

  // Event Handlers
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % (filterItems.length || 1);
    setItemOffset(newOffset);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShort = (item: { value: string; label: string }) => {
    setShortValue(item.value);
  };

  const handleToggleSave = async (job: IJobType) => {
    if (!decoded || !decoded.user_id) {
      const modalElement = document.getElementById('saveJobLoginModal');
      if (modalElement) {
        const bootstrap = (window as any).bootstrap;
        if (bootstrap && bootstrap.Modal) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      }
      return;
    }

    const isActive = job.projects_task_id !== undefined && savedJobIds.has(job.projects_task_id);

    try {
      if (job.projects_task_id === undefined) return;

      const payload = {
        projects_task_id: job.projects_task_id,
      };

      if (isActive) {
        await makeDeleteRequest("api/v1/saved/unsave-project", payload);
        setSavedJobIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.delete(job.projects_task_id!);
          return newIds;
        });
      } else {
        await makePostRequest("api/v1/saved/save-project", payload);
        setSavedJobIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.add(job.projects_task_id!);
          return newIds;
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const handleLoginSuccess = () => {
    // Modal will be hidden automatically
  };

  // Loading state
  if (loading) {
    return (
      <section className="job-listing-three pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="job-listing-three pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4">
              <button
                type="button"
                className="filter-btn w-100 pt-2 pb-2 h-auto fw-500 tran3s d-lg-none mb-40"
                data-bs-toggle="offcanvas"
                data-bs-target="#filteroffcanvas"
              >
                <i className="bi bi-funnel"></i>
                Filter
              </button>
              <FilterArea
                priceValue={priceValue}
                setPriceValue={setPriceValue}
                maxPrice={priceValue[1]}
                availableSkills={availableSkills}
                availableTypes={availableTypes}
                onSkillChange={setSelectedSkills}
                onTypeChange={setSelectedTypes}
                selectedSkills={selectedSkills}
                selectedTypes={selectedTypes}
              />
            </div>

            <div className="col-xl-9 col-lg-8">
              <div className="job-post-item-wrapper ms-xxl-5 ms-xl-3">
                <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
                  <div className="total-job-found">
                    All <span className="text-dark fw-500">{filterItems.length}</span> jobs found
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="short-filter d-flex align-items-center">
                      <div className="text-dark fw-500 me-2">Sort:</div>
                      <NiceSelect
                        options={[
                          { value: "", label: "Price Sort" },
                          { value: "price-low-to-high", label: "Low to High" },
                          { value: "price-high-to-low", label: "High to Low" },
                        ]}
                        defaultCurrent={0}
                        onChange={handleShort}
                        name="Price Sort"
                      />
                    </div>
                  </div>
                </div>

                <div className={`accordion-box list-style ${!grid_style ? "show" : ""}`}>
                  {currentItems && currentItems.map((job) => (
                    <ListItemTwo 
                      key={job.projects_task_id} 
                      item={job} 
                      onToggleSave={handleToggleSave} 
                      isActive={job.projects_task_id !== undefined && savedJobIds.has(job.projects_task_id)}
                    />
                  ))}
                </div>

                <div className={`accordion-box grid-style ${grid_style ? "show" : ""}`}>
                  <div className="row">
                    {currentItems &&
                      currentItems.map((job) => (
                        <div key={job.projects_task_id} className="col-sm-6 mb-30">
                          <JobGridItem 
                            item={job} 
                            onToggleSave={handleToggleSave} 
                            isActive={job.projects_task_id !== undefined && savedJobIds.has(job.projects_task_id)}
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {currentItems && currentItems.length === 0 && (
                  <div className="text-center mt-5">
                    <h3>No jobs found</h3>
                    <p>Try adjusting your filters to find what you're looking for.</p>
                  </div>
                )}

                {currentItems && currentItems.length > 0 && (
                  <div className="pt-30 lg-pt-20 d-sm-flex align-items-center justify-content-between">
                    <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                      Showing <span className="text-dark fw-500">{itemOffset + 1}</span> to{" "}
                      <span className="text-dark fw-500">
                        {Math.min(itemOffset + itemsPerPage, filterItems.length)}
                      </span> of <span className="text-dark fw-500">{filterItems.length}</span>
                    </p>
                    {filterItems.length > itemsPerPage && (
                      <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <SaveJobLoginModal onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default JobListThree;