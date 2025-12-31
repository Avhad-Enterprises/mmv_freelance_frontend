import CandidateAside from "@/app/components/dashboard/candidate/aside";
import CompletedProjectsArea from "@/app/components/dashboard/candidate/completed-projects-area";

export const metadata = {
  title: "Completed Projects - Freelancer Dashboard",
};

const CompletedProjectsPage = () => {
  return (
    <div className="main-page-wrapper">
      <CandidateAside />
      <CompletedProjectsArea />
    </div>
  );
};

export default CompletedProjectsPage;
