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
import { useNotification, Notification } from "@/context/NotificationContext";

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
      <h6 style={{ whiteSpace: 'normal', lineHeight: '1.4', fontSize: '13px' }}>{main}</h6>
      <span className="time">{time}</span>
    </div>
  </li>
);

// Props type for DashboardHeader
type DashboardHeaderProps = {
  // No props needed, using context
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ }) => {
  const { setIsOpenSidebar } = useSidebar();
  const { currentRole } = useUser();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotification();

  // Helper function to format notification time
  const formatNotificationTime = (createdAt: string | undefined): string => {
    if (!createdAt) return "Just now";

    const now = new Date().getTime();
    const created = new Date(createdAt).getTime();
    const diffInSeconds = Math.floor((now - created) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  };

  const handleOpenSidebar = () => {
    setIsOpenSidebar(true);
  };

  return (
    <header className="dashboard-header">
      <div className="d-flex align-items-center justify-content-between">
        {/* Left side - User Role */}
        <div className="d-flex align-items-center">
          {/* Mobile Sidebar Toggle - Moved to Left */}
          <button
            onClick={handleOpenSidebar}
            className="dash-mobile-nav-toggler d-block d-md-none me-3"
          >
            <span></span>
          </button>

          {/* Left side - User Role (Hidden on mobile) */}
          <div className="user-role d-none d-md-block" style={{
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
        </div>

        {/* Right side - Search, Notifications, Post Job */}
        <div className="d-flex align-items-center">
          {/* Mobile Sidebar Toggle */}


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
          <div className="profile-notification ms-2 ms-md-5 me-4">
            <button
              className="noti-btn dropdown-toggle"
              type="button"
              id="notification-dropdown"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
              style={{ position: 'relative' }}
            >
              <Image src={notifi} alt="Notification" className="lazy-img" />
              {unreadCount > 0 && (
                <div
                  className="badge-pill"
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-2px',
                    backgroundColor: '#FF3B30',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    border: '1px solid #fff'
                  }}
                >
                  {unreadCount}
                </div>
              )}
            </button>

            <ul className="dropdown-menu" aria-labelledby="notification-dropdown">
              <li>
                <div className="d-flex justify-content-between align-items-center mb-2 px-3 pt-2">
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead()}
                      style={{
                        fontSize: '12px',
                        color: '#fff',
                        background: '#31795A',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontWeight: '500',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#244034'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#31795A'}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <ul className="style-none notify-list">
                  {notifications.length === 0 ? (
                    <li className="d-flex align-items-center justify-content-center py-3">
                      <span style={{ fontSize: '14px', color: '#666' }}>No notifications</span>
                    </li>
                  ) : (
                    notifications.slice(0, 5).map((item) => (
                      <div key={item.id} onClick={() => !item.is_read && markAsRead(item.id)} style={{ cursor: 'pointer' }}>
                        <NotificationItem
                          icon={notify_icon_1} // Use default icon or determine based on item.type
                          main={item.message}
                          time={formatNotificationTime(item.created_at)}
                          isUnread={!item.is_read}
                        />
                      </div>
                    ))
                  )}
                </ul>
              </li>
            </ul>
          </div>

          {/* Post Job Button */}
          <div>
            <Link
              href="/dashboard/client-dashboard/submit-job"
              className="job-post-btn tran3s"
            >
              Post a Project
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
