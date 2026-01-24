"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import InlineThreadView from "@/app/dashboard/client-dashboard/messages/InlineThreadView";
import DashboardHeader from "@/app/components/dashboard/candidate/dashboard-header";

export default function FreelancerThreadPage() {
  const params = useParams() as { id?: string };
  const router = useRouter();
  const conversationId = params?.id;

  if (!conversationId) return <div>Missing conversation id</div>;

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader />

        <div className="bg-white border-30" style={{ overflow: "hidden", height: "calc(100vh - 100px)" }}>
          <InlineThreadView
            conversationId={conversationId}
            onBack={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}
