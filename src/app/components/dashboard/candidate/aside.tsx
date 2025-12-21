"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteAccountModal from "../../forms/DeleteAccountModal";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useUser } from "@/context/UserContext";
import ProfilePictureModal from "../../common/ProfilePictureModal";
import AuthenticatedImage from "../../common/AuthenticatedImage";
import toast from "react-hot-toast";
import { useConversations } from "@/hooks/useConversations";

import logo from "@/assets/dashboard/images/logo_01.png";
import profile_icon_1 from "@/assets/dashboard/images/icon/icon_23.svg";
import profile_icon_2 from "@/assets/dashboard/images/icon/icon_24.svg";
import logout from "@/assets/dashboard/images/icon/icon_9.svg";
import nav_1 from "@/assets/dashboard/images/icon/icon_1.svg";
import nav_1_active from "@/assets/dashboard/images/icon/icon_1_active.svg";
import nav_2 from "@/assets/dashboard/images/icon/icon_2.svg";
import nav_2_active from "@/assets/dashboard/images/icon/icon_2_active.svg";
import nav_3 from "@/assets/dashboard/images/icon/icon_2.svg";
import nav_3_active from "@/assets/dashboard/images/icon/icon_2_active.svg";
import nav_6 from "@/assets/dashboard/images/icon/icon_6.svg";
import nav_6_active from "@/assets/dashboard/images/icon/icon_6_active.svg";
import nav_7 from "@/assets/dashboard/images/icon/icon_7.svg";
import nav_7_active from "@/assets/dashboard/images/icon/icon_7_active.svg";
import nav_8 from "@/assets/dashboard/images/icon/icon_8.svg";
import nav_9 from "@/assets/dashboard/images/icon/icon_9.svg";

import LogoutModal from "../../common/popup/logout-modal";

const nav_data = [
    { id: 1, icon: nav_1, icon_active: nav_1_active, link: "/dashboard/freelancer-dashboard", title: "Dashboard" },
    { id: 2, icon: nav_2, icon_active: nav_2_active, link: "/dashboard/freelancer-dashboard/profile", title: "My Profile" },
    { id: 6, icon: nav_6, icon_active: nav_6_active, link: "/dashboard/freelancer-dashboard/saved-job", title: "Saved Job" },
    { id: 3, icon: nav_3, icon_active: nav_3_active, link: "/dashboard/freelancer-dashboard/browse-jobs", title: "Browse Projects" },
    { id: 8, icon: nav_9, icon_active: nav_9, link: "/dashboard/freelancer-dashboard/applied-jobs", title: "Applied Projects" },
    { id: 9, icon: nav_9, icon_active: nav_9, link: "/dashboard/freelancer-dashboard/ongoing-jobs", title: "Ongoing Projects" },
    { id: 11, icon: nav_8, icon_active: nav_8, link: "/dashboard/freelancer-dashboard/credits", title: "Keys to Abundance", videoEditorOnly: true },
    { id: 10, icon: nav_8, icon_active: nav_8, link: "/dashboard/freelancer-dashboard/chat", title: "Chat" },
    { id: 7, icon: nav_7, icon_active: nav_7_active, link: "/dashboard/freelancer-dashboard/setting", title: "Account Settings" },
] as const;

type IProps = {
    // No props needed, using context
};

const CandidateAside = ({ }: IProps) => {
    const pathname = usePathname();
    const { isOpenSidebar, setIsOpenSidebar } = useSidebar();
    const { userData, userRoles, currentRole, setCurrentRole, refreshUserData } = useUser();
    const currentUserId = userData?.user_id ? String(userData.user_id) : null;
    const { conversations } = useConversations(currentUserId);

    const [showProfilePicModal, setShowProfilePicModal] = useState(false);
    const [profilePicKey, setProfilePicKey] = useState(Date.now()); // For cache busting

    const fullName = userData
        ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || "User"
        : "Loading...";

    const profilePictureUrl = userData?.profile_picture || null;

    // Check for unread messages
    const hasUnreadMessages = conversations.some(convo =>
        convo.lastSenderId !== currentUserId && !convo.lastMessageRead
    );

    const handleRoleSwitch = (role: string) => {
        setCurrentRole(role);
        // Redirect based on role
        if (role.toLowerCase().includes('client')) {
            window.location.href = '/dashboard/client-dashboard';
        } else if (role.toLowerCase().includes('videographer') || role.toLowerCase().includes('video editor') || role.toLowerCase().includes('freelancer')) {
            window.location.href = '/dashboard/freelancer-dashboard';
        }
    };

    const openProfilePicModal = () => {
        setShowProfilePicModal(true);
    };

    const handleProfilePicUpdate = () => {
        // Update the cache-busting key to force image refresh
        setProfilePicKey(Date.now());
        // Add a small delay to ensure the API has processed the upload
        setTimeout(() => {
            refreshUserData();
        }, 1500); // Increased delay
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const initDropdowns = async () => {
                const bootstrap = await import('bootstrap');
                const dropdownElements = document.querySelectorAll('.dropdown-toggle');
                dropdownElements.forEach((element) => {
                    new bootstrap.Dropdown(element);
                });
            };
            initDropdowns();
        }
    }, []);

    return (
        <>
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
                }
            `}</style>
            <aside className={`dash-aside-navbar ${isOpenSidebar ? "show" : ""}`} style={{ zIndex: 9999 }}>
                <div className="position-relative" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Logo + Close Button */}
                    <div className="logo text-md-center d-md-block d-flex align-items-center justify-content-between">
                        <Link href="/">
                            <Image src={logo} alt="logo" width={140} priority />
                        </Link>
                        <button
                            onClick={() => setIsOpenSidebar(false)}
                            className="close-btn d-block d-md-none"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="user-data">
                        <div className="user-avatar position-relative d-block text-center">
                            <div className="online position-relative rounded-circle d-inline-block" style={{
                                width: '75px',
                                height: '75px',
                                background: profilePictureUrl && profilePictureUrl.trim() !== '' ? 'none' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '30px',
                                fontWeight: 'bold',
                                color: 'white',
                                cursor: 'pointer'
                            }} onClick={openProfilePicModal}>
                                {profilePictureUrl && profilePictureUrl.trim() !== '' ? (
                                    <AuthenticatedImage
                                        src={`${profilePictureUrl}?t=${profilePicKey}`}
                                        alt="Profile Picture"
                                        width={75}
                                        height={75}
                                        style={{ objectFit: 'cover', borderRadius: '50%' }}
                                        unoptimized
                                        fallbackSrc="/images/default-avatar.png"
                                    />
                                ) : (
                                    fullName.charAt(0).toUpperCase()
                                )}
                            </div>
                            {/* Edit overlay */}
                            <div className="position-absolute top-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    backgroundColor: '#D2F34C',
                                    cursor: 'pointer',
                                    border: '3px solid white',
                                    zIndex: 10,
                                    fontSize: '14px',
                                    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                                    transform: 'translate(25%, -25%)'
                                }}
                                onClick={openProfilePicModal}>
                                <i className="bi bi-pencil-fill" style={{ color: '#244034', fontSize: '12px', fontWeight: 'bold' }}></i>
                            </div>
                        </div>
                        <div className="user-name-data">
                            <button className="user-name dropdown-toggle" type="button" id="profile-dropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                {fullName}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="profile-dropdown">
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" href="/dashboard/freelancer-dashboard/profile">
                                        <Image src={profile_icon_1} alt="icon" className="lazy-img" />
                                        <span className="ms-2 ps-1">Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" href="/dashboard/freelancer-dashboard/setting">
                                        <Image src={profile_icon_2} alt="icon" className="lazy-img" />
                                        <span className="ms-2 ps-1">Account Settings</span>
                                    </Link>
                                </li>
                                {userRoles.length > 1 && (
                                    <>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><h6 className="dropdown-header">Switch Role</h6></li>
                                        {userRoles.map((role, index) => (
                                            <li key={index}>
                                                <button
                                                    className={`dropdown-item ${role === currentRole ? 'active' : ''}`}
                                                    onClick={() => handleRoleSwitch(role)}
                                                >
                                                    {role}
                                                </button>
                                            </li>
                                        ))}
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="dasboard-main-nav">
                        <ul className="style-none">
                            {nav_data
                                .filter(m => {
                                    // Hide Keys to Abundance for videographers (only show for Video Editors)
                                    if ('videoEditorOnly' in m && m.videoEditorOnly) {
                                        // Check if user has Video Editor role
                                        return userRoles.some(role => role.toLowerCase().includes('video editor'));
                                    }
                                    return true;
                                })
                                .map((m) => {
                                    const isActive = pathname === m.link;
                                    const isChatItem = m.id === 10; // Chat item
                                    const showNotification = isChatItem && hasUnreadMessages;

                                    return (
                                        <li key={m.id} onClick={() => setIsOpenSidebar(false)} className="position-relative">
                                            <Link href={m.link} className={`d-flex w-100 align-items-center ${isActive ? "active" : ""}`}>
                                                <Image src={isActive ? m.icon_active : m.icon} alt="icon" className="lazy-img" />
                                                <span>{m.title}</span>
                                            </Link>
                                            {showNotification && (
                                                <div
                                                    className="position-absolute"
                                                    style={{
                                                        top: '12px',
                                                        right: '20px',
                                                        width: '12px',
                                                        height: '12px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#1a5f3d',
                                                        border: '2px solid white',
                                                        boxShadow: '0 2px 6px rgba(26, 95, 61, 0.4)',
                                                        zIndex: 10,
                                                        animation: 'pulse 2s infinite'
                                                    }}
                                                />
                                            )}
                                        </li>
                                    );
                                })}
                            <li>
                                <a href="#" className="d-flex w-100 align-items-center" data-bs-toggle="modal" data-bs-target="#logoutModal">
                                    <Image src={logout} alt="icon" className="lazy-img" />
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </nav>



                </div>
            </aside>
            {/* <DeleteAccountModal /> */}
            <LogoutModal />

            {/* Profile Picture Update Modal */}
            <ProfilePictureModal
                isOpen={showProfilePicModal}
                onClose={() => setShowProfilePicModal(false)}
                currentPictureUrl={profilePictureUrl}
                onUpdate={handleProfilePicUpdate}
            />
        </>
    );
};

export default CandidateAside;