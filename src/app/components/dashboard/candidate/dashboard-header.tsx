'use client'
import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import notifi from "@/assets/dashboard/images/icon/icon_11.svg";
import notify_icon_1 from "@/assets/dashboard/images/icon/icon_36.svg";
import notify_icon_2 from "@/assets/dashboard/images/icon/icon_37.svg";
import notify_icon_3 from "@/assets/dashboard/images/icon/icon_38.svg";
import search from "@/assets/dashboard/images/icon/icon_10.svg";

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
  setIsOpenSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ setIsOpenSidebar }) => {
  const handleOpenSidebar = () => {
    setIsOpenSidebar?.(true);
  };

  return (
    <header className="dashboard-header">
      <div className="d-flex align-items-center justify-content-end">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={handleOpenSidebar}
          className="dash-mobile-nav-toggler d-block d-md-none me-auto"
        >
          <span></span>
        </button>

        {/* Search Form */}
        <form action="#" className="search-form">
          <input type="text" placeholder="Search here.." />
          <button type="submit">
            <Image src={search} alt="search" className="lazy-img m-auto" />
          </button>
        </form>

        {/* Notifications */}
        <div className="profile-notification ms-2 ms-md-5 me-4">
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
        </div>

        {/* Post Job Button */}
        <div>
          <Link
            href="/dashboard/employ-dashboard/submit-job"
            className="job-post-btn tran3s"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
