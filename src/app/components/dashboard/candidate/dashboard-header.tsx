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
import { usePathname, useRouter } from "next/navigation";

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
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Detect if we're in client dashboard
  const isClientDashboard = pathname?.includes('/client-dashboard');
  const dashboardBase = isClientDashboard ? '/dashboard/client-dashboard' : '/dashboard/freelancer-dashboard';

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

  // Get redirect URL based on notification type
  const getNotificationRedirectUrl = (notification: Notification): string | null => {
    const { type, related_type, related_id } = notification;

    if (isClientDashboard) {
      switch (type) {
        case 'proposal':
          return `${dashboardBase}/jobs`;
        case 'application_withdrawn':
          return `${dashboardBase}/jobs`;
        case 'submission':
          return `${dashboardBase}/ongoing-projects`;
        case 'message':
          return `${dashboardBase}/messages`;
        default:
          return null;
      }
    } else {
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
          font-weight: 600;
        }
        
        /* Mobile responsive header */
        @media (max-width: 991px) {
          .dashboard-header {
            padding: 12px 15px !important;
          }
          
          .dashboard-header .d-flex.justify-content-between {
            gap: 8px;
          }
          
          .header-job-post-btn {
            font-size: 13px !important;
            padding: 12px 18px !important;
            min-width: auto !important;
            height: 44px !important;
            line-height: 1.2 !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            background: #2F3E35 !important;
            color: #fff !important;
            box-shadow: none !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          .profile-notification {
            margin-left: 8px !important;
            margin-right: 8px !important;
          }
          
          .profile-notification .noti-btn {
            padding: 8px !important;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .profile-notification .noti-btn img {
            width: 20px !important;
            height: 20px !important;
          }
        }
        
        @media (max-width: 767px) {
          .dashboard-header {
            padding: 10px 12px !important;
          }
          
          .header-job-post-btn {
            font-size: 14px !important;
            padding: 12px 20px !important;
            min-width: 140px !important;
            height: 44px !important;
            line-height: 1.2 !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            background: #2F3E35 !important;
            color: #fff !important;
            letter-spacing: 0 !important;
            box-shadow: none !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          .profile-notification {
            margin-left: 6px !important;
            margin-right: 6px !important;
          }
          
          .profile-notification .noti-btn {
            padding: 6px !important;
            width: 38px;
            height: 38px;
          }
          
          .profile-notification .noti-btn img {
            width: 18px !important;
            height: 18px !important;
          }
          
          .dash-mobile-nav-toggler {
            margin-right: 10px !important;
            width: 32px;
            height: 32px;
          }
        }
        
        @media (max-width: 575px) {
          .header-job-post-btn {
            font-size: 13px !important;
            padding: 11px 18px !important;
            min-width: 130px !important;
            height: 42px !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            background: #2F3E35 !important;
            color: #fff !important;
            letter-spacing: 0 !important;
            box-shadow: none !important;
          }
          
          .profile-notification {
            margin-left: 4px !important;
            margin-right: 4px !important;
          }
        }
        
        @media (max-width: 400px) {
          .header-job-post-btn {
            font-size: 12px !important;
            padding: 10px 16px !important;
            min-width: 120px !important;
            height: 40px !important;
            border-radius: 11px !important;
          }
        }
        
        @media (max-width: 360px) {
          .header-job-post-btn {
            font-size: 11px !important;
            padding: 9px 14px !important;
            min-width: 110px !important;
            height: 38px !important;
            border-radius: 10px !important;
          }
        }
      `}</style>
      <div className="d-flex align-items-center justify-content-between w-100">
        {/* Left side - Hamburger + User Role */}
        <div className="d-flex align-items-center flex-shrink-1" style={{ minWidth: 0 }}>
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={handleOpenSidebar}
            className="dash-mobile-nav-toggler d-block d-md-none me-2"
            style={{ flexShrink: 0 }}
          >
            <span></span>
          </button>

          {/* User Role (Hidden on mobile) */}
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

        {/* Right side - Notifications + Post Job */}
        <div className="d-flex align-items-center flex-shrink-0" style={{ gap: '4px' }}>
          {/* Notifications */}
          <div className="profile-notification">
            <button
              className="noti-btn dropdown-toggle"
              type="button"
              id="notification-dropdown"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
              style={{ position: 'relative', background: 'transparent', border: 'none', padding: '8px' }}
            >
              <Image src={notifi} alt="Notification" className="lazy-img" style={{ width: '22px', height: '22px' }} />
              {unreadCount > 0 && (
                <div
                  className="badge-pill"
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: '#FF3B30',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    border: '2px solid #fff'
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </button>

            <ul className="dropdown-menu" aria-labelledby="notification-dropdown">
              <li>
                <div className="d-flex justify-content-between align-items-center mb-2 px-3 pt-2 gap-3">
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
                    notifications.filter(item => !item.is_read).slice(0, 5).map((item) => (
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
                    href={isClientDashboard ? "/dashboard/client-dashboard/notifications" : "/dashboard/freelancer-dashboard/notifications"}
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

          {/* Dynamic Button based on Dashboard Type */}
          <div>
            <Link
              href={isClientDashboard ? "/dashboard/client-dashboard/submit-job" : "/dashboard/freelancer-dashboard/browse-jobs"}
              className="job-post-btn tran3s header-job-post-btn"
            >
              {isClientDashboard ? "Post a Project" : "Browse Project"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
