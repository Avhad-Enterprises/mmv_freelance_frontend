import React from 'react';
import { Metadata } from 'next';
import CareersClientView from './CareersClientView';

export const metadata: Metadata = {
    title: 'Careers | Make My Vid',
    description: 'Join our team and help shape the future of video creation.',
};

const CareersPage = () => {
    return <CareersClientView />;
};

export default CareersPage;
