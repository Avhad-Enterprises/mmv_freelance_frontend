import Head from 'next/head';
import Script from 'next/script';

// import MobileMenu from './components/MobileMenu';
// import MobileHeader from './components/MobileHeader';
// import DesktopHeader from './components/DesktopHeader';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import PageHeader from './components/PageHeader';
import ProjectSearchForm from './components/ProjectSearchForm';
import ProjectFilterSidebar from './components/ProjectFilterSidebar';
import ProjectListing from './components/ProjectListing';
import Pagination from './components/Pagination';
// import BackToTopButton from './components/BackToTopButton';
import Header from "@/layouts/headers/header";

export default function ProjectsListPage() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="profile" href="http://gmpg.org/xfn/11" />
        <title>Projects List – Freeio</title>
        <meta name="robots" content="max-image-preview:large" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=DM+Sans:400,500,700&subset=latin,latin-ext"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:100,200,300,400,500,600,700,800,900|Roboto+Slab:100,200,300,400,500,600,700,800,900&display=auto"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="anonymous" />
      </Head>

      {/* Scripts */}
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/wp-includes/js/jquery/jquery-migrate.min5589.js" strategy="afterInteractive" />
      <Script src="/wp-content/plugins/woocommerce/assets/js/jquery-blockui/jquery.blockUI.minc854.js" strategy="lazyOnload" />
      <Script src="/wp-content/plugins/woocommerce/assets/js/frontend/add-to-cart.minc484.js" strategy="lazyOnload" />
      <Script src="/wp-content/plugins/woocommerce/assets/js/js-cookie/js.cookie.min8730.js" strategy="lazyOnload" />
      <Script src="/wp-content/plugins/woocommerce/assets/js/frontend/woocommerce.minc484.js" strategy="lazyOnload" />
      <Script src="/wp-content/themes/freeio/js/slick.minee8b.js" strategy="lazyOnload" />
      <Script src="/wp-content/themes/freeio/js/jquery.magnific-popup.minf488.js" strategy="lazyOnload" />
      <Script src="/wp-content/themes/freeio/js/jquery.unveilf488.js" strategy="lazyOnload" />
      <Script src="/wp-content/themes/freeio/js/perfect-scrollbar.jquery.min91ce.js" strategy="lazyOnload" />
      <Script src="/wp-content/themes/freeio/js/sliding-menu.min9d8e.js" strategy="lazyOnload" />
      <Script src="/wp-content/themes/freeio/js/functions8337.js" strategy="lazyOnload" />

      <div className="apus-page-loading">
        <div className="apus-loader-inner"></div>
      </div>

      <div id="wrapper-container" className="wrapper-container">
        <Header />

        {/* ✅ NO margin-top here now */}
        <div id="apus-main-content">
          <section id="main-container" className="inner">
            <div className="container">
              <Breadcrumbs />
              <PageHeader
                title="Projects List"
                description="All the Lorem Ipsum generators on the Internet tend to repeat."
              />
              <ProjectSearchForm />
              <div className="row">
                <div className="col-md-3">
                  <ProjectFilterSidebar />
                </div>
                <div className="col-md-9">
                  <ProjectListing />
                </div>
              </div>
              <Pagination />
            </div>
          </section>
        </div>

        <Footer />
        {/* <BackToTopButton /> */}
      </div>
    </>
  );
}
