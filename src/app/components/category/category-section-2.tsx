import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import icon_1 from '@/assets/images/icon/icon_12.svg';
import icon_2 from '@/assets/images/icon/icon_13.svg';
import icon_3 from '@/assets/images/icon/icon_14.svg';
import icon_4 from '@/assets/images/icon/icon_15.svg';
import icon_5 from '@/assets/images/icon/icon_16.svg';
import icon_6 from '@/assets/images/icon/icon_17.svg';
import icon_7 from '@/assets/images/icon/icon_18.svg';
import icon_8 from '@/assets/images/icon/icon_19.svg';
import shape_1 from '@/assets/images/shape/shape_23.svg';
import shape_2 from '@/assets/images/shape/shape_22.svg';
import shape_3 from '@/assets/images/shape/shape_24.svg';
import bg_1 from '@/assets/images/assets/img_16.jpg';
import bg_2 from '@/assets/images/assets/img_17.jpg';
import bg_3 from '@/assets/images/assets/img_18.jpg';
import bg_4 from '@/assets/images/assets/img_19.jpg';
import { ICategoryTwo } from '@/types/category-type';

// category data 
export const category_data: ICategoryTwo[] = [
  {
    id: 1,
    icon: icon_1,
    title: <>Reels & <br /> Shorts Editing.</>,
    vacancy: 2340,
    bg_img: bg_1,
  },
  {
    id: 2,
    icon: icon_2,
    title: <>Podcast Video <br />& Editing.</>,
    vacancy: 1560,
    bg_img: bg_2,
  },
  {
    id: 3,
    icon: icon_3,
    title: <>Wedding <br />Video Editing.</>,
    vacancy: 2210,
    bg_img: bg_3,
  },
  {
    id: 4,
    icon: icon_4,
    title: <>AI Video <br />Generation.</>,
    vacancy: 980,
    bg_img: bg_4,
  },
  {
    id: 5,
    icon: icon_5,
    title: <>Corporate & <br />Production</>,
    vacancy: 1687,
    bg_img: bg_3,
  },
  {
    id: 6,
    icon: icon_6,
    title: <>Event Highlight<br />Videos</>,
    vacancy: 758,
    bg_img: bg_1,
  },
  {
    id: 7,
    icon: icon_7,
    title: <>Documentary <br />Film Editing</>,
    vacancy: 1452
  },
  {
    id: 8,
    icon: icon_8,
    title: <>13k+</>,
    sub_title: "Explore All video expertise",
    df: true, // ✅ keep df flag
  },
]

// CategoryCardWrapper
export function CategoryCardWrapper() {
  return (
    <div className="card-wrapper row mt-80 lg-mt-40">
      {category_data.map(item => (
        <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 d-flex">
          <div
            className={`card-style-four tran3s w-100 mt-30 wow fadeInUp ${item.df ? 'bg-white text-center p-4 shadow-sm rounded-4 border' : ''}`}
          >
            {/* Normal Cards */}
            {!item.df && (
              <Link href="/coming-soon" className="d-block">
                <div className="icon tran3s d-flex align-items-center justify-content-center">
                  <Image src={item.icon} alt="icon" className="lazy-img" style={{ filter: 'brightness(0) saturate(100%) invert(47%) sepia(95%) saturate(500%) hue-rotate(100deg) brightness(95%) contrast(90%)' }} />
                </div>
                <div className="title tran3s fw-500 text-lg">{item.title}</div>
                <div className="total-job">{item.vacancy} talents</div>
              </Link>
            )}

         
          
          
            {/* Explore All Card */}
            {item.df && (
              <>
                <div className="title tran3s fw-600 text-start mb-2" style={{ fontSize: '26px', lineHeight: '1.3' }}>{item.sub_title}</div>
                <p className="text-muted text-start mb-3" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                  Viel thest Foca post des am Expories
                </p>
                <Link href="/coming-soon">
                  <button className="btn fw-500 rounded-pill text-white px-4 py-2" style={{ backgroundColor: '#00bf63', fontSize: '16px' }}>
                    View All
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// CategorySectionTwo
const CategorySectionTwo = () => {
  return (
    <section className="category-section-two position-relative pt-150 lg-pt-100 pb-140 lg-pb-80">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-md-6 col-sm-8">
            <div
              className="title-one text-center text-sm-start wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <h2 className="fw-600">Most demanding job categories.</h2>
            </div>
          </div>
          <div className="col-md-5 col-sm-4">
            <div className="d-none d-sm-flex justify-content-sm-end mt-25">
              <Link href="/coming-soon" className="btn-six border-0">
                All Categories{" "}
                <Image
                  src={shape_1}
                  alt="shape"
                  className="lazy-img shapes"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* CategoryCardWrapper */}
        <CategoryCardWrapper />
        {/* CategoryCardWrapper */}

        <div className="text-center d-sm-none mt-50">
          <Link href="/coming-soon" className="btn-six border-0">
            All Categories{" "}
            <Image src={shape_1} alt="shape" className="lazy-img shapes" />
          </Link>
        </div>
      </div>
      <Image src={shape_3} alt="shape" className="lazy-img shapes shape_01" />
    </section>
  );
};

export default CategorySectionTwo;
