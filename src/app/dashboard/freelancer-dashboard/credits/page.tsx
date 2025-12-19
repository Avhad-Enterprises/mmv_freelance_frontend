"use client";

import React from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { CreditsArea } from "@/app/components/credits";

/**
 * Freelancer Credits Dashboard Page
 * Protected by credits.view_own permission
 */
const CreditsPage = () => {
  return (
    <PermissionGuard
      permission="credits.view_own"
      fallback={
        <div className="dashboard-body">
          <div className="position-relative">
            <div className="bg-white card-box border-20 text-center py-5">
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
              <h4>Access Denied</h4>
              <p className="text-muted">
                Credits are only available for freelancers (Videographers and Video Editors).
              </p>
            </div>
          </div>
        </div>
      }
    >
      <CreditsArea />
    </PermissionGuard>
  );
};

export default CreditsPage;