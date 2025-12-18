"use client";
import React from 'react';
import { useUser } from '@/context/UserContext';

interface PermissionGuardProps {
    permission: string;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * PermissionGuard
 * 
 * A wrapper component that only renders its children if the authenticated user
 * has the specific permission required.
 * 
 * @param permission - The permission string to check (e.g., 'projects.create')
 * @param fallback - Optional content to render if permission is denied
 * @param children - The protected content
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
    permission,
    fallback = null,
    children
}) => {
    const { userPermissions, userRoles, isLoading } = useUser();

    // 1. Loading state (optional: could render nothing or a specialized loader)
    if (isLoading) {
        return null;
    }

    // 2. Super Admin Bypass
    // Super Admins technically have all permissions, but the backend handles that.
    // Frontend should also reflect this to avoid blank screens.
    if (userRoles.includes('SUPER_ADMIN')) {
        return <>{children}</>;
    }

    // 3. Permission Check
    if (userPermissions.includes(permission)) {
        return <>{children}</>;
    }

    // 4. Access Denied
    return <>{fallback}</>;
};

export default PermissionGuard;
