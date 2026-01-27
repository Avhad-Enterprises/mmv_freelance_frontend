import { Metadata } from "next";
import CareerDetailsClientView from "./CareerDetailsClientView";

export const metadata: Metadata = {
    title: "Job Details - Make My Vid",
    description: "View detailed information about this job opportunity",
};

export default function CareerDetailsPage() {
    return <CareerDetailsClientView />;
}
