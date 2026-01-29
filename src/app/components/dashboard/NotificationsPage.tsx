'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import DashboardHeader from './candidate/dashboard-header';
import { useNotification, Notification } from '@/context/NotificationContext';

const NotificationsPage: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { notifications, markAsRead, markAllAsRead, unreadCount, isLoading } = useNotification();
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    // Detect if we're in client or freelancer dashboard
    const isClientDashboard = pathname?.includes('/client-dashboard');
    const dashboardBase = isClientDashboard ? '/dashboard/client-dashboard' : '/dashboard/freelancer-dashboard';

    // Format notification time
    const formatNotificationTime = (createdAt: string | undefined): string => {
        if (!createdAt) return "Just now";

        const now = new Date().getTime();
        const created = new Date(createdAt).getTime();
        const diffInSeconds = Math.floor((now - created) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;

        // For older notifications, show the date
        const date = new Date(createdAt);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
    };

    // Filter notifications based on selected filter
    const filteredNotifications = notifications.filter((notification) => {
        if (filter === 'unread') return !notification.is_read;
        if (filter === 'read') return notification.is_read;
        return true;
    });

    // Pagination State
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 8; // Adjust as needed

    // Reset pagination when filter changes
    React.useEffect(() => {
        setItemOffset(0);
    }, [filter]);

    // Calculate current items for pagination
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = filteredNotifications.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(filteredNotifications.length / itemsPerPage);

    const handlePageClick = (event: { selected: number }) => {
        const newOffset = (event.selected * itemsPerPage) % (filteredNotifications.length || 1);
        setItemOffset(newOffset);
    };

    // Get redirect URL based on notification type and related data
    const getNotificationRedirectUrl = (notification: Notification): string | null => {
        const { type, related_type, related_id } = notification;

        // For clients
        if (isClientDashboard) {
            switch (type) {
                case 'proposal':
                    // A freelancer applied to a project - go to view submissions for that project
                    if (related_type === 'applied_projects' && related_id) {
                        return `${dashboardBase}/jobs`;
                    }
                    return `${dashboardBase}/jobs`;
                case 'application_withdrawn':
                    // Freelancer withdrew application
                    if (related_id) {
                        return `${dashboardBase}/jobs`;
                    }
                    return `${dashboardBase}/jobs`;
                case 'submission':
                    // Freelancer submitted work
                    return `${dashboardBase}/ongoing-projects`;
                case 'message':
                    return `${dashboardBase}/messages`;
                default:
                    return null;
            }
        }
        // For freelancers
        else {
            switch (type) {
                case 'hired':
                    // Got hired for a project - go to ongoing jobs
                    if (related_type === 'projects_task' && related_id) {
                        return `${dashboardBase}/ongoing-jobs`;
                    }
                    return `${dashboardBase}/ongoing-jobs`;
                case 'rejected':
                    // Proposal was rejected - go to applied jobs
                    return `${dashboardBase}/applied-jobs`;
                case 'project_completed':
                    // Project was completed
                    return `${dashboardBase}/completed-projects`;
                case 'submission_approved':
                case 'submission_rejected':
                    // Submission status update
                    return `${dashboardBase}/ongoing-jobs`;
                case 'message':
                    return `${dashboardBase}/chat`;
                default:
                    return null;
            }
        }
    };

    // Handle notification click
    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read if unread
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }

        // Get redirect URL and navigate
        const redirectUrl = getNotificationRedirectUrl(notification);
        if (redirectUrl) {
            router.push(redirectUrl);
        }
    };

    // Get notification icon based on type
    const getNotificationIcon = (type: string | undefined) => {
        switch (type) {
            case 'proposal':
            case 'submission':
            case 'application_withdrawn':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#31795A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="#31795A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 8V14" stroke="#31795A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M23 11H17" stroke="#31795A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'hired':
            case 'project_completed':
            case 'submission_approved':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#31795A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 4L12 14.01L9 11.01" stroke="#31795A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'rejected':
            case 'submission_rejected':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15 9L9 15" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 9L15 15" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'message':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#31795A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            default:
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#31795A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#31795A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
        }
    };

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeader />

                {/* Page Title */}
                <h2 className="main-title">Notifications</h2>

                {/* Main Card Container - Matching the screenshot layout */}
                <div className="bg-white card-box border-20">
                    {/* Header with Filter Tabs and Mark All Read */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <button
                                onClick={() => setFilter('all')}
                                style={{
                                    padding: '8px 16px',
                                    border: filter === 'all' ? '2px solid #3F634D' : '2px solid rgb(232, 236, 242)',
                                    borderRadius: '8px',
                                    backgroundColor: filter === 'all' ? '#3F634D' : 'rgb(255, 255, 255)',
                                    color: filter === 'all' ? '#fff' : 'rgb(36, 64, 52)',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                All
                                <span style={{
                                    background: filter === 'all' ? 'rgba(255,255,255,0.2)' : '#F0F5F3',
                                    color: filter === 'all' ? '#fff' : '#3F634D',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '12px'
                                }}>
                                    {notifications.length}
                                </span>
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                style={{
                                    padding: '8px 16px',
                                    border: filter === 'unread' ? '2px solid #3F634D' : '2px solid rgb(232, 236, 242)',
                                    borderRadius: '8px',
                                    backgroundColor: filter === 'unread' ? '#3F634D' : 'rgb(255, 255, 255)',
                                    color: filter === 'unread' ? '#fff' : 'rgb(36, 64, 52)',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                Unread
                                <span style={{
                                    background: filter === 'unread' ? 'rgba(255,255,255,0.2)' : '#F0F5F3',
                                    color: filter === 'unread' ? '#fff' : '#3F634D',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '12px'
                                }}>
                                    {notifications.filter(n => !n.is_read).length}
                                </span>
                            </button>
                            <button
                                onClick={() => setFilter('read')}
                                style={{
                                    padding: '8px 16px',
                                    border: filter === 'read' ? '2px solid #3F634D' : '2px solid rgb(232, 236, 242)',
                                    borderRadius: '8px',
                                    backgroundColor: filter === 'read' ? '#3F634D' : 'rgb(255, 255, 255)',
                                    color: filter === 'read' ? '#fff' : 'rgb(36, 64, 52)',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                Read
                                <span style={{
                                    background: filter === 'read' ? 'rgba(255,255,255,0.2)' : '#F0F5F3',
                                    color: filter === 'read' ? '#fff' : '#3F634D',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '12px'
                                }}>
                                    {notifications.filter(n => n.is_read).length}
                                </span>
                            </button>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                className="dash-btn-two"
                                onClick={() => markAllAsRead()}
                            >
                                <i className="bi bi-check-all me-2"></i>
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Subtitle */}
                    <p style={{ color: '#6c757d', marginBottom: '25px', fontSize: '14px' }}>
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                            : 'All caught up! No new notifications.'}
                    </p>

                    {/* Notifications List */}
                    {isLoading ? (
                        <div className="d-flex flex-column align-items-center justify-content-center py-5">
                            <div className="spinner-border" style={{ color: '#31795A' }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p style={{ color: '#6c757d', marginTop: '15px' }}>Loading notifications...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="d-flex flex-column align-items-center justify-content-center py-5">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: '#EFF6F3',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px'
                            }}>
                                <i className="bi bi-bell-slash" style={{ fontSize: '32px', color: '#31795A' }}></i>
                            </div>
                            <h5 style={{ color: '#244034', fontWeight: '600', marginBottom: '8px' }}>No notifications</h5>
                            <p style={{ color: '#6c757d', marginBottom: 0 }}>
                                {filter === 'all'
                                    ? "You don't have any notifications yet"
                                    : filter === 'unread'
                                        ? "You don't have any unread notifications"
                                        : "You don't have any read notifications"}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table job-alert-table">
                                    <thead>
                                        <tr>
                                            <th scope="col" style={{ width: '60px' }}></th>
                                            <th scope="col">Notification</th>
                                            <th scope="col" className="text-end" style={{ width: '150px', paddingRight: '20px' }}>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((notification) => {
                                            const redirectUrl = getNotificationRedirectUrl(notification);
                                            return (
                                                <tr
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    style={{
                                                        cursor: redirectUrl ? 'pointer' : 'default',
                                                        background: !notification.is_read ? 'rgba(49, 121, 90, 0.03)' : 'transparent',
                                                        transition: 'background 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!notification.is_read) e.currentTarget.style.background = 'rgba(49, 121, 90, 0.08)';
                                                        else e.currentTarget.style.background = '#f8f9fa';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!notification.is_read) e.currentTarget.style.background = 'rgba(49, 121, 90, 0.03)';
                                                        else e.currentTarget.style.background = 'transparent';
                                                    }}
                                                >
                                                    <td>
                                                        <div style={{
                                                            width: '45px',
                                                            height: '45px',
                                                            background: '#EFF6F3',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            {getNotificationIcon(notification.type)}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column">
                                                            <p style={{
                                                                margin: 0,
                                                                fontWeight: !notification.is_read ? '600' : '500',
                                                                color: '#244034',
                                                                fontSize: '15px'
                                                            }}>
                                                                {notification.message}
                                                            </p>
                                                            {!notification.is_read && (
                                                                <span style={{ fontSize: '11px', color: '#FF3B30', fontWeight: 'bold', marginTop: '4px' }}>New</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-end" style={{ paddingRight: '20px' }}>
                                                        <span style={{ fontSize: '13px', color: '#6c757d' }}>
                                                            {formatNotificationTime(notification.created_at)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredNotifications.length > itemsPerPage && (
                                <div className="pt-30 lg-pt-20 d-sm-flex align-items-center justify-content-between">
                                    <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                                        Showing <span className="text-dark fw-500">{itemOffset + 1}</span> to{" "}
                                        <span className="text-dark fw-500">
                                            {Math.min(itemOffset + itemsPerPage, filteredNotifications.length)}
                                        </span> of <span className="text-dark fw-500">{filteredNotifications.length}</span>
                                    </p>
                                    {pageCount > 1 && (
                                        <ul className="pagination-one d-flex align-items-center style-none">
                                            {/* Prev */}
                                            <li className={itemOffset === 0 ? "d-none" : ""} style={{ marginRight: '20px' }}>
                                                <a
                                                    onClick={() => handlePageClick({ selected: Math.floor(itemOffset / itemsPerPage) - 1 })}
                                                    style={{
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        color: '#31795A',
                                                        width: 'auto',
                                                        border: 'none',
                                                        background: 'transparent',
                                                        height: 'auto',
                                                        padding: 0
                                                    }}
                                                >
                                                    <i className="bi bi-arrow-left"></i> Prev
                                                </a>
                                            </li>

                                            {/* Page Numbers */}
                                            {Array.from({ length: pageCount }, (_, i) => (
                                                <li key={i} className={Math.floor(itemOffset / itemsPerPage) === i ? "active" : ""}>
                                                    <a
                                                        onClick={() => handlePageClick({ selected: i })}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {i + 1}
                                                    </a>
                                                </li>
                                            ))}

                                            {/* Next */}
                                            <li className={itemOffset + itemsPerPage >= filteredNotifications.length ? "d-none" : ""} style={{ marginLeft: '20px' }}>
                                                <a
                                                    onClick={() => handlePageClick({ selected: Math.floor(itemOffset / itemsPerPage) + 1 })}
                                                    style={{
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        color: '#31795A',
                                                        width: 'auto',
                                                        border: 'none',
                                                        background: 'transparent',
                                                        height: 'auto',
                                                        padding: 0
                                                    }}
                                                >
                                                    Next <i className="bi bi-arrow-right"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
