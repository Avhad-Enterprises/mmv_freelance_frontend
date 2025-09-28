import React from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import JobPortalIntro from "../components/job-portal-intro/job-portal-intro";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import BlogDetailsArea from "../components/blogs/blog-details";
import blog_data from "@/data/blog-data";

export const metadata: Metadata = {
  title: "Blog Details",
};

const BlogDetailsPage = () => {
  // pehle blog ko pick kar rahe hain
  const blog = blog_data[0];

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <Header />
        {/* header end */}

        {/* breadcrumb start */}
        <CompanyBreadcrumb
          title="Blog"
          subtitle="Read our blog from top talents"
        />
        {/* breadcrumb end */}

        {/* blog details start */}
        {/* Agar BlogDetailsArea ko blogId chahiye */}
        <BlogDetailsArea blogId={blog?. blog_id ?? 1} />

        {/* Agar BlogDetailsArea ko pura item chahiye hota
            to yeh hota: <BlogDetailsArea item={blog} /> */}
        {/* blog details end */}

        {/* job portal intro start */}
        <JobPortalIntro top_border={true} />
        {/* job portal intro end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default BlogDetailsPage;
