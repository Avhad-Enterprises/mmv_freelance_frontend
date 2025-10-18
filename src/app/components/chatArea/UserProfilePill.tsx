'use client'
import React from 'react';
import { getAuth } from "firebase/auth";

const UserProfilePill = ({ userId }) => {
    // In a real app, you would fetch user details (name, avatar) from another collection
    // based on the userId. For this example, we'll just show the ID.
    const isCurrentUser = getAuth().currentUser?.uid === userId;
    return (
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
            {isCurrentUser ? "You" : `User: ${userId.substring(0, 6)}...`}
        </span>
    );
};

export default UserProfilePill;
