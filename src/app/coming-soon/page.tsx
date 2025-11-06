import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import icon from '@/assets/images/icon/icon_61.svg';
import comingsoon_img from './coming_soon.png';
import Header from "@/layouts/headers/header";
import FooterOne from "@/layouts/footers/footer-one";
import Wrapper from "@/layouts/wrapper";

const ComingSoonPage = () => {
    return (
        <Wrapper>
            {/* header start */}
            <Header />
            {/* header end */}
            
            <div className="comingsoon-page d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
                {/* Image Section (Top) */}
                <Image
                    src={comingsoon_img}
                    alt="comingsoon-img"
                    width={400}
                    height={400}
                    className="img-fluid mx-auto d-block mb-4"
                />

                {/* Text Section (Below Image) */}
                <h2>Coming Soon 🚀</h2>
                <p className="text-md mb-4">
                    Your portal to abundance is coming soon
                </p>

                {/* Button */}
                <Link
                    href="/register"
                    className="btn-one d-flex align-items-center justify-content-between mt-3"
                    style={{ maxWidth: "250px", width: "100%" }}
                >
                    <span>REGISTER</span>
                    <Image src={icon} alt="icon" />
                </Link>
            </div>

            {/* footer start */}
            <FooterOne />
            {/* footer end */}
        </Wrapper>
    );
};

export default ComingSoonPage;
