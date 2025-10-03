"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteAccountModal from "../../forms/DeleteAccountModal";
import { usePathname } from "next/navigation";

// ... (your imports remain the same)
import logo from "@/assets/dashboard/images/logo_01.png";
import avatar from "@/assets/dashboard/images/avatar_01.jpg";
import profile_icon_1 from "@/assets/dashboard/images/icon/icon_23.svg";
import profile_icon_2 from "@/assets/dashboard/images/icon/icon_24.svg";
import profile_icon_3 from "@/assets/dashboard/images/icon/icon_25.svg";
import logout from "@/assets/dashboard/images/icon/icon_9.svg";
import nav_1 from "@/assets/dashboard/images/icon/icon_1.svg";
import nav_1_active from "@/assets/dashboard/images/icon/icon_1_active.svg";
import nav_2 from "@/assets/dashboard/images/icon/icon_2.svg";
import nav_2_active from "@/assets/dashboard/images/icon/icon_2_active.svg";
import nav_6 from "@/assets/dashboard/images/icon/icon_6.svg";
import nav_6_active from "@/assets/dashboard/images/icon/icon_6_active.svg";
import nav_7 from "@/assets/dashboard/images/icon/icon_7.svg";
import nav_7_active from "@/assets/dashboard/images/icon/icon_7_active.svg";
import nav_8 from "@/assets/dashboard/images/icon/icon_8.svg"; // Delete icon
import nav_9 from "@/assets/dashboard/images/icon/icon_9.svg"; // New icon for "Applied Projects"

import LogoutModal from "../../common/popup/logout-modal";
import useDecodedToken from "@/hooks/useDecodedToken";
import { makePostRequest } from "@/utils/api";

const nav_data = [
    // ... (your nav_data remains the same)
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
    const decodedToken = useDecodedToken();
    const [fullName, setFullName] = useState("Loading...");

    useEffect(() => {
        // ... (your useEffect logic remains the same)
        const fetchUserData = async () => {
            if (decodedToken?.user_id) {
                try {
                    const res = await makePostRequest("users/get_user_by_id", { user_id: decodedToken.user_id });
                    const user = res.data?.data;
                    if (user?.first_name || user?.last_name) {
                        setFullName(`${user.first_name} ${user.last_name}`);
                    } else {
                        setFullName("Unknown User");
                    }
                } catch (err) {
                    console.error("Failed to fetch user:", err);
                    setFullName("Error loading");
                }
            }
        };
        fetchUserData();
    }, [decodedToken]);

    return (
        <>
            <aside className={`dash-aside-navbar ${isOpenSidebar ? "show" : ""}`} style={{ top: 'var(--header-height, 80px)', height: 'calc(100vh - var(--header-height, 80px))', overflowY: 'auto' }}>
                <div className="position-relative" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* User Info */}
                    <div className="user-data">
                        {/* ... (user data JSX remains the same) ... */}
                        <div className="user-avatar online position-relative rounded-circle">
                            <Image src={avatar} alt="avatar" className="lazy-img" />
                        </div>
                        <div className="user-name-data">
                            <button className="user-name dropdown-toggle" type="button" id="profile-dropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                {fullName}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="profile-dropdown">
                                <li><Link className="dropdown-item d-flex align-items-center" href="/dashboard/candidate-dashboard/profile"><Image src={profile_icon_1} alt="icon" className="lazy-img" /><span className="ms-2 ps-1">Profile</span></Link></li>
                                <li><Link className="dropdown-item d-flex align-items-center" href="/dashboard/candidate-dashboard/setting"><Image src={profile_icon_2} alt="icon" className="lazy-img" /><span className="ms-2 ps-1">Account Settings</span></Link></li>
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
                            {/* CHANGE 1: Logout button moved here as a list item */}
                            <li>
                                <a href="#" className="d-flex w-100 align-items-center" data-bs-toggle="modal" data-bs-target="#logoutModal">
                                    <Image src={logout} alt="icon" className="lazy-img" />
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    {/* CHANGE 2: The entire bottom section has been removed */}
                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                        {/* Profile Completion */}
                        <div className="profile-complete-status">
                            <div className="progress-value fw-500">87%</div>
                            <div className="progress-line position-relative">
                                <div className="inner-line" style={{ width: "80%" }}></div>
                            </div>
                            <p>Profile Complete</p>
                        </div>

                        {/* The logout button was originally here */}
                    </div>

                </div>
            </aside>
            <DeleteAccountModal />
            <LogoutModal />
        </>
    );
};

export default CandidateAside;