import CandidateAside from "@/app/components/dashboard/candidate/aside";
import CompletedProjectsArea from "@/app/components/dashboard/candidate/completed-projects-area";

export const metadata = {

};

const CompletedProjectsPage = () => {
  return (
    <>
      <CandidateAside />
      <CompletedProjectsArea />
    </>
  );
};

export default CompletedProjectsPage;
