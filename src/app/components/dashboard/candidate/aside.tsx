"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteAccountModal from "../../forms/DeleteAccountModal";
import { usePathname } from "next/navigation";

import logo from "@/assets/dashboard/images/logo_01.png";
import profile_icon_1 from "@/assets/dashboard/images/icon/icon_23.svg";
import profile_icon_2 from "@/assets/dashboard/images/icon/icon_24.svg";
import logout from "@/assets/dashboard/images/icon/icon_9.svg";
import nav_1 from "@/assets/dashboard/images/icon/icon_1.svg";
import nav_1_active from "@/assets/dashboard/images/icon/icon_1_active.svg";
import nav_2 from "@/assets/dashboard/images/icon/icon_2.svg";
import nav_2_active from "@/assets/dashboard/images/icon/icon_2_active.svg";
import nav_6 from "@/assets/dashboard/images/icon/icon_6.svg";
import nav_6_active from "@/assets/dashboard/images/icon/icon_6_active.svg";
import nav_7 from "@/assets/dashboard/images/icon/icon_7.svg";
import nav_7_active from "@/assets/dashboard/images/icon/icon_7_active.svg";
import nav_8 from "@/assets/dashboard/images/icon/icon_8.svg";
import nav_9 from "@/assets/dashboard/images/icon/icon_9.svg";

import LogoutModal from "../../common/popup/logout-modal";

const nav_data = [
    { id: 1, icon: nav_1, icon_active: nav_1_active, link: "/dashboard/candidate-dashboard", title: "Dashboard" },
    { id: 2, icon: nav_2, icon_active: nav_2_active, link: "/dashboard/candidate-dashboard/profile", title: "My Profile" },
    { id: 6, icon: nav_6, icon_active: nav_6_active, link: "/dashboard/candidate-dashboard/saved-job", title: "Saved Job" },
    { id: 7, icon: nav_7, icon_active: nav_7_active, link: "/dashboard/candidate-dashboard/setting", title: "Account Settings" },
    { id: 8, icon: nav_9, icon_active: nav_9, link: "/dashboard/candidate-dashboard/applied-jobs", title: "Applied Projects" },
];

type IProps = {
    isOpenSidebar: boolean;
    setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const CandidateAside = ({ isOpenSidebar, setIsOpenSidebar }: IProps) => {
    const pathname = usePathname();
    const [fullName, setFullName] = useState("Loading...");
    // 1. Add state to store the profile picture URL
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await fetch(`https://api.makemyvid.io/api/v1/users/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const response = await res.json();
                
                if (response.success && response.data) {
                    const { user } = response.data;
                    
                    // Set full name
                    if (user?.first_name || user?.last_name) {
                        setFullName(`${user.first_name || ''} ${user.last_name || ''}`.trim());
                    } else {
                        setFullName("User");
                    }

                    // 2. Set the profile picture URL from the API response
                    if (user?.profile_picture) {
                        setProfilePictureUrl(user.profile_picture);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
                setFullName("User");
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <>
            <aside className={`dash-aside-navbar ${isOpenSidebar ? "show" : ""}`} style={{ top: 'var(--header-height, 80px)', height: 'calc(100vh - var(--header-height, 80px))', overflowY: 'auto' }}>
                <div className="position-relative" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* User Info */}
                    <div className="user-data">
                        <div className="user-avatar online position-relative rounded-circle" style={{
                            width: '50px',
                            height: '50px',
                            // Apply background only if there is no picture
                            background: profilePictureUrl ? 'none' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white',
                            overflow: 'hidden' // Ensures the image corners are clipped
                        }}>
                            {/* 3. Conditionally render the Image or the initial */}
                            {profilePictureUrl ? (
                                <Image
                                    src={profilePictureUrl}
                                    alt="Profile Picture"
                                    width={50}
                                    height={50}
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                fullName.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="user-name-data">
                            <button className="user-name dropdown-toggle" type="button" id="profile-dropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                {fullName}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="profile-dropdown">
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" href="/dashboard/candidate-dashboard/profile">
                                        <Image src={profile_icon_1} alt="icon" className="lazy-img" />
                                        <span className="ms-2 ps-1">Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" href="/dashboard/candidate-dashboard/setting">
                                        <Image src={profile_icon_2} alt="icon" className="lazy-img" />
                                        <span className="ms-2 ps-1">Account Settings</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="dasboard-main-nav">
                        <ul className="style-none">
                            {nav_data.map((m) => {
                                const isActive = pathname === m.link;
                                return (
                                    <li key={m.id} onClick={() => setIsOpenSidebar(false)}>
                                        <Link href={m.link} className={`d-flex w-100 align-items-center ${isActive ? "active" : ""}`}>
                                            <Image src={isActive ? m.icon_active : m.icon} alt="icon" className="lazy-img" />
                                            <span>{m.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                            <li>
                                <a href="#" className="d-flex w-100 align-items-center" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                    <Image src={nav_8} alt="Delete Account" className="lazy-img" />
                                    <span>Delete Account</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="d-flex w-100 align-items-center" data-bs-toggle="modal" data-bs-target="#logoutModal">
                                    <Image src={logout} alt="icon" className="lazy-img" />
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                        {/* Profile Completion */}
                        <div className="profile-complete-status">
                            <div className="progress-value fw-500">87%</div>
                            <div className="progress-line position-relative">
                                <div className="inner-line" style={{ width: "80%" }}></div>
                            </div>
                            <p>Profile Complete</p>
                        </div>
                    </div>

                </div>
            </aside>
            <DeleteAccountModal />
            <LogoutModal />
        </>
    );
};

export default CandidateAside;