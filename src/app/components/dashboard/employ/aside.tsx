"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutModal from "../../common/popup/logout-modal";
import DeleteAccountModal from "../../forms/DeleteAccountModal";
import { useSidebar } from "@/context/SidebarContext";
import { useUser } from "@/context/UserContext";

import logo from "@/assets/dashboard/images/logo_01.png";
import profile_icon_1 from "@/assets/dashboard/images/icon/icon_23.svg";
import profile_icon_2 from "@/assets/dashboard/images/icon/icon_24.svg";
import profile_icon_3 from "@/assets/dashboard/images/icon/icon_25.svg";
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
    { id: 1, icon: nav_1, icon_active: nav_1_active, link: "/dashboard/employ-dashboard", title: "Dashboard" },
    { id: 2, icon: nav_2, icon_active: nav_2_active, link: "/dashboard/employ-dashboard/profile", title: "My Profile" },
    { id: 3, icon: nav_3, icon_active: nav_3_active, link: "/dashboard/employ-dashboard/jobs", title: "My Jobs" },
    { id: 5, icon: nav_5, icon_active: nav_5_active, link: "/dashboard/employ-dashboard/submit-job", title: "Chat" },
    { id: 6, icon: nav_6, icon_active: nav_6_active, link: "/dashboard/employ-dashboard/saved-candidate", title: "Saved Candidate" },
    // { id: 8, icon: nav_7, icon_active: nav_7_active, link: "/dashboard/employ-dashboard/setting", title: "Account Settings" },
];

type IProps = {
    // No props needed, using context
};

const EmployAside = ({}: IProps) => {
    const pathname = usePathname();
    const { isOpenSidebar, setIsOpenSidebar } = useSidebar();
    const { userData } = useUser();
    
    const fullName = userData 
        ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || "User"
        : "Loading...";
    
    const profilePictureUrl = userData?.profile_picture || null;

    return (
        <>
            <aside className={`dash-aside-navbar ${isOpenSidebar ? "show" : ""}`}>
                <div className="position-relative">
                    {/* Logo + Close Button */}
                    <div className="logo text-md-center d-md-block d-flex align-items-center justify-content-between">
                        <Link href="/dashboard/employ-dashboard">
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
                        <div className="user-avatar online position-relative rounded-circle" style={{
                            width: '50px',
                            height: '50px',
                            background: profilePictureUrl ? 'none' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white',
                            overflow: 'hidden'
                        }}>
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
                                    <Link className="dropdown-item d-flex align-items-center" href="/dashboard/employ-dashboard/profile">
                                        <Image src={profile_icon_1} alt="icon" className="lazy-img" />
                                        <span className="ms-2 ps-1">Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" href="/dashboard/employ-dashboard/setting">
                                        <Image src={profile_icon_2} alt="icon" className="lazy-img" />
                                        <span className="ms-2 ps-1">Account Settings</span>
                                    </Link>
                                </li>
                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <Image src={profile_icon_3} alt="icon" className="lazy-img" />
                                        <span className="ms-2 ps-1">Notification</span>
                                    </a>
                                </li>
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
        </>
    );
};

export default EmployAside;