'use client'
import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import notifi from "@/assets/dashboard/images/icon/icon_11.svg";
import notify_icon_1 from "@/assets/dashboard/images/icon/icon_36.svg";
import notify_icon_2 from "@/assets/dashboard/images/icon/icon_37.svg";
import notify_icon_3 from "@/assets/dashboard/images/icon/icon_38.svg";
import search from "@/assets/dashboard/images/icon/icon_10.svg";
import { useSidebar } from "@/context/SidebarContext";
import { useUser } from "@/context/UserContext";

// Notification item component
type NotificationItemProps = {
  icon: StaticImageData;
  main: string;
  time: string;
  isUnread: boolean;
};

const NotificationItem: React.FC<NotificationItemProps> = ({ icon, main, time, isUnread }) => (
  <li className={`d-flex align-items-center ${isUnread ? "unread" : ""}`}>
    <Image src={icon} alt="icon" className="lazy-img icon" />
    <div className="flex-fill ps-2">
      <h6>{main}</h6>
      <span className="time">{time} hours ago</span>
    </div>
  </li>
);

// Props type for DashboardHeader
type DashboardHeaderProps = {
    // No props needed, using context
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({}) => {
  const { setIsOpenSidebar } = useSidebar();
  const { currentRole } = useUser();

  const handleOpenSidebar = () => {
    setIsOpenSidebar(true);
  };

  return (
    <header className="dashboard-header">
      <div className="d-flex align-items-center justify-content-between">
        {/* Left side - User Role */}
        <div className="user-role" style={{
          fontSize: '14px',
          color: '#244034',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '8px 16px',
          backgroundColor: '#EFF6F3',
          borderRadius: '15px',
          border: '2px solid #31795A',
          whiteSpace: 'nowrap',
          minWidth: 'fit-content',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          {currentRole || 'Loading...'}
        </div>

        {/* Right side - Search, Notifications, Post Job */}
        <div className="d-flex align-items-center">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={handleOpenSidebar}
            className="dash-mobile-nav-toggler d-block d-md-none me-3"
          >
            <span></span>
          </button>

          {/* Search Form - Commented out as it's not working */}
          {/*
          <form action="#" className="search-form me-2 me-md-5">
            <input type="text" placeholder="Search here.." />
            <button type="submit">
              <Image src={search} alt="search" className="lazy-img m-auto" />
            </button>
          </form>
          */}

          {/* Notifications */}
          {/* <div className="profile-notification ms-2 ms-md-5 me-4">
            <button
              className="noti-btn dropdown-toggle"
              type="button"
              id="notification-dropdown"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
            >
              <Image src={notifi} alt="Notification" className="lazy-img" />
              <div className="badge-pill"></div>
            </button>

            <ul className="dropdown-menu" aria-labelledby="notification-dropdown">
              <li>
                <h4>Notifications</h4>
                <ul className="style-none notify-list">
                  <NotificationItem icon={notify_icon_1} main="You have 3 new messages" time="3" isUnread={true} />
                  <NotificationItem icon={notify_icon_2} main="You have 5 new tasks" time="6" isUnread={false} />
                  <NotificationItem icon={notify_icon_3} main="You have 7 new alerts" time="9" isUnread={true} />
                </ul>
              </li>
            </ul>
          </div> */}

          {/* Post Job Button */}
          <div>
            <Link
              href="/dashboard/employ-dashboard/jobs"
              className="job-post-btn tran3s"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
