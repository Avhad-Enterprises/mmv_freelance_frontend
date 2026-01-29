'use client'
import React, { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Dashboard base URL for freelancer
  const dashboardBase = '/dashboard/freelancer-dashboard';

  // Detect scroll to add background color to header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Get redirect URL based on notification type for freelancer
  const getNotificationRedirectUrl = (notification: Notification): string | null => {
    const { type } = notification;

    switch (type) {
      case 'hired':
        return `${dashboardBase}/ongoing-jobs`;
      case 'rejected':
        return `${dashboardBase}/applied-jobs`;
      case 'project_completed':
        return `${dashboardBase}/completed-projects`;
      case 'submission_approved':
      case 'submission_rejected':
        return `${dashboardBase}/ongoing-jobs`;
      case 'message':
        return `${dashboardBase}/chat`;
      default:
        return null;
    }
  };

  // Handle notification click with redirect
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    const redirectUrl = getNotificationRedirectUrl(notification);
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  // Determine icon based on type
  const getNotificationIcon = (type: string | undefined): StaticImageData => {
    switch (type) {
      case 'proposal':
      case 'submission':
      case 'application_withdrawn':
        return notify_icon_1;
      case 'hired':
      case 'project_completed':
      case 'submission_approved':
        return notify_icon_2;
      case 'rejected':
      case 'submission_rejected':
        return notify_icon_3;
      case 'message':
        return notify_icon_1;
      default:
        return notify_icon_1;
    }
  };

  const handleOpenSidebar = () => {
    setIsOpenSidebar(true);
  };

  return (
    <header className={`dashboard-header ${isScrolled ? 'scrolled' : ''}`}>
      <style jsx global>{`
        .header-job-post-btn {
          white-space: nowrap;
        }
        @media (max-width: 767px) {
          .header-job-post-btn {
            font-size: 12px !important;
            padding: 5px 8px !important;
            min-width: auto !important;
            height: 35px !important;
            line-height: 25px !important;
          }
        }
      `}</style>
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
                <div className="d-flex justify-content-between align-items-center mb-6 px-6 pt-6 gap-11">
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
                      Clear all
                    </button>
                  )}
                </div>
                <ul className="style-none notify-list">
                  {unreadCount === 0 ? (
                    <li className="d-flex align-items-center justify-content-center py-3">
                      <span style={{ fontSize: '14px', color: '#666' }}>No new notifications</span>
                    </li>
                  ) : (
                    notifications.filter(item => !item.is_read).slice(0, 5).map((item: Notification) => (
                      <div key={item.id} onClick={() => handleNotificationClick(item)} style={{ cursor: 'pointer' }}>
                        <NotificationItem
                          icon={getNotificationIcon(item.type)}
                          main={item.message}
                          time={formatNotificationTime(item.created_at)}
                          isUnread={!item.is_read}
                        />
                      </div>
                    ))
                  )}
                </ul>
                {/* View All Button */}
                <div style={{
                  borderTop: '1px solid #E3F0EB',
                  padding: '12px 15px 8px',
                  marginTop: '10px'
                }}>
                  <Link
                    href="/dashboard/freelancer-dashboard/notifications"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '10px 20px',
                      background: '#EFF6F3',
                      color: '#31795A',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#31795A';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#EFF6F3';
                      e.currentTarget.style.color = '#31795A';
                    }}
                  >
                    View All Notifications
                  </Link>
                </div>
              </li>
            </ul>
          </div>

          {/* Browse Project Button */}
          <div>
            <Link
              href="/dashboard/freelancer-dashboard/browse-jobs"
              className="job-post-btn tran3s header-job-post-btn"
            >
              Browse Project
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
