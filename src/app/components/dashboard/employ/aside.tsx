"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutModal from "../../common/popup/logout-modal";
import DeleteAccountModal from "../../forms/DeleteAccountModal";
import ProfilePictureModal from "../../common/ProfilePictureModal";
import { useSidebar } from "@/context/SidebarContext";
import { useUser } from "@/context/UserContext";
import AuthenticatedImage from "../../common/AuthenticatedImage";
import toast from "react-hot-toast";
import { authCookies } from "@/utils/cookies";

import logo from "@/assets/dashboard/images/logo_01.png";
import profile_icon_1 from "@/assets/dashboard/images/icon/icon_23.svg";
import profile_icon_2 from "@/assets/dashboard/images/icon/icon_24.svg";
import logout from "@/assets/dashboard/images/icon/icon_9.svg";
import nav_1 from "@/assets/dashboard/images/icon/icon_1.svg";
import nav_1_active from "@/assets/dashboard/images/icon/icon_1_active.svg";
import nav_2 from "@/assets/dashboard/images/icon/icon_2.svg";
import nav_2_active from "@/assets/dashboard/images/icon/icon_2_active.svg";
import nav_3 from "@/assets/dashboard/images/icon/icon_3.svg";
import nav_3_active from "@/assets/dashboard/images/icon/icon_3_active.svg";
import nav_5 from "@/assets/dashboard/images/icon/icon_39.svg";
import nav_5_active from "@/assets/dashboard/images/icon/icon_39_active.svg";
import nav_6 from "@/assets/dashboard/images/icon/icon_6.svg";
import nav_6_active from "@/assets/dashboard/images/icon/icon_6_active.svg";
import nav_7 from "@/assets/dashboard/images/icon/icon_7.svg";
import nav_7_active from "@/assets/dashboard/images/icon/icon_7_active.svg";
import nav_8 from "@/assets/dashboard/images/icon/icon_8.svg";


const nav_data = [
    { id: 1, icon: nav_1, icon_active: nav_1_active, link: "/dashboard/client-dashboard", title: "Dashboard" },
    { id: 2, icon: nav_2, icon_active: nav_2_active, link: "/dashboard/client-dashboard/profile", title: "My Profile" },
    // Temporarily hidden for live deployment
    // { id: 3, icon: nav_3, icon_active: nav_3_active, link: "/dashboard/client-dashboard/jobs", title: "My Jobs" },
    // { id: 5, icon: nav_5, icon_active: nav_5_active, link: "/dashboard/client-dashboard/submit-job", title: "Chat" },
    // { id: 6, icon: nav_6, icon_active: nav_6_active, link: "/dashboard/client-dashboard/saved-candidate", title: "Saved Candidate" },
    // { id: 7,icons: nav_2, icon_active: nav_2_active ,link: "/dashboard/client-dashboard/Candidates", title: "Candidates"},
    // {id: 9 , icons: nav_3 , icon_active: nav_3_active , link: "/dashboard/client-dashboard/ongoing-projects" , title : "Ongoing Projects"},
    { id: 8, icon: nav_7, icon_active: nav_7_active, link: "/dashboard/client-dashboard/setting", title: "Account Settings" },
];

type IProps = {
    // No props needed, using context
};

const EmployAside = ({}: IProps) => {
    const pathname = usePathname();
    const { isOpenSidebar, setIsOpenSidebar } = useSidebar();
    const { userData, userRoles, currentRole, setCurrentRole, refreshUserData } = useUser();
    
    const [showProfilePicModal, setShowProfilePicModal] = useState(false);
    const [profilePicKey, setProfilePicKey] = useState(Date.now()); // For cache busting
    
    const fullName = userData 
        ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || "User"
        : "Loading...";
    
    const profilePictureUrl = userData?.profile_picture || null;
    console.log('Current profile picture URL in employ aside:', profilePictureUrl);

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
        console.log('Profile picture update triggered');
        console.log('Current profile picture URL before update:', profilePictureUrl);
        // Update the cache-busting key to force image refresh
        setProfilePicKey(Date.now());
        console.log('New cache busting key:', Date.now());
        // Add a small delay to ensure the API has processed the upload
        setTimeout(() => {
            console.log('Refreshing user data after profile picture update');
            refreshUserData().then(() => {
                console.log('User data refreshed, new profile picture URL:', userData?.profile_picture);
            });
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
            <aside className={`dash-aside-navbar ${isOpenSidebar ? "show" : ""}`}>
                <div className="position-relative">
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
                            <button
                                className="user-name dropdown-toggle"
                                type="button"
                                id="profile-dropdown"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                                aria-expanded="false"
                            >
                                {fullName}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="profile-dropdown">
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" href="/dashboard/client-dashboard/profile">
                                        <Image src={profile_icon_1} alt="icon" className="lazy-img" />
                                        <span className="ms-2 ps-1">Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" href="/dashboard/client-dashboard/setting">
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

                    <nav className="dasboard-main-nav">
                        <ul className="style-none">
                            {nav_data.map((item) => {
                                const isActive = pathname === item.link;
                                return (
                                    <li key={item.id} onClick={() => setIsOpenSidebar(false)}>
                                        <Link
                                            href={item.link}
                                            className={`d-flex w-100 align-items-center ${isActive ? "active" : ""}`}
                                        >
                                            <Image src={isActive ? item.icon_active : item.icon} alt="icon" className="lazy-img" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                            {/* <li>
                                <a
                                    href="#"
                                    className="d-flex w-100 align-items-center"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteModal"
                                >
                                    <Image src={nav_8} alt="Delete Account" className="lazy-img" />
                                    <span>Delete Account</span>
                                </a>
                            </li> */}
                            {/* Logout */}
                            <li>
                                <a
                                    href="#"
                                    className="d-flex w-100 align-items-center"
                                    data-bs-toggle="modal"
                                    data-bs-target="#logoutModal"
                                >
                                    <Image src={logout} alt="Logout" className="lazy-img" />
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

export default EmployAside;