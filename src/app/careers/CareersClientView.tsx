'use client';
import React from 'react';
import Header from '@/layouts/headers/header';
import Wrapper from '@/layouts/wrapper';
import FooterOne from '@/layouts/footers/footer-one';
import CandidateProfileBreadcrumb from '../components/candidate-details/profile-bredcrumb';
import CareersList from '../components/careers/CareersList';

const CareersClientView = () => {
    return (
        <Wrapper>
            <div className="main-page-wrapper">
                <Header />

                <CandidateProfileBreadcrumb
                    title="Careers"
                    subtitle="Join our team"
                />

                <CareersList />

                <FooterOne />
            </div>
        </Wrapper>
    );
};

export default CareersClientView;
