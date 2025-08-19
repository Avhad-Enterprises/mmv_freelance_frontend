import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DesktopHeader() {
    return (
        <div id="apus-header" className="apus-header d-none d-xl-block">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="logo">
                            <Link href="https://demoapus1.com/freeio/">
                                <Image width="133" height="40" src="/wp-content/uploads/2022/09/logo-white2.png" alt="Logo" />
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-6 text-end">
                        <div className="dropdown">
                            <button className="btn btn-outline-primary dropdown-toggle" type="button" id="categoriesDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="flaticon-menu"></i> Categories
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                                <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/service-category/design-creative/"><i className="flaticon-web-design-1"></i> Design &amp; Creative</Link></li>
                                <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/service-category/digital-marketing/"><i className="flaticon-digital-marketing"></i> Digital Marketing</Link></li>
                                <li className="dropdown-submenu">
                                    <Link className="dropdown-item dropdown-toggle" href="https://demoapus1.com/freeio/service-category/development-it/">Development &amp; IT</Link>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/job-category/developers/">Developers</Link></li>
                                        <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/job-category/digital-marketing/">Digital Marketing</Link></li>
                                        <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/job-category/graphics-design/">Graphics &amp; Design</Link></li>
                                        <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/job-category/lifestyle/">Lifestyle</Link></li>
                                        <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/job-category/music-audio/">Music &amp; Audio</Link></li>
                                        <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/job-category/writing-translation/">Writing &amp; Translation</Link></li>
                                    </ul>
                                </li>
                                <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/service-category/music-audio/"><i className="flaticon-microphone"></i> Music &amp; Audio</Link></li>
                                <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/service-category/finance-accounting/"><i className="flaticon-goal"></i> Finance &amp; Accounting</Link></li>
                                <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/service-category/programming-tech/"><i className="flaticon-ruler"></i> Programming &amp; Tech</Link></li>
                                <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/service-category/video-animation/"><i className="flaticon-video-file"></i> Video &amp; Animation</Link></li>
                                <li><Link className="dropdown-item" href="https://demoapus1.com/freeio/service-category/writing-translation/"><i className="flaticon-translator"></i> Writing &amp; Translation</Link></li>
                            </ul>
                        </div>
                        <div className="d-inline-block">
                            <button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#search-header-Rn3PF">
                                <i className="flaticon-loupe"></i> Search
                            </button>
                            <div className="modal fade" id="search-header-Rn3PF" tabIndex={-1} aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        <div className="widget-listing-search-form button horizontal">
                                            <form id="filter-listing-form-Rn3PF" action="https://demoapus1.com/freeio/service-layout-1/" className="form-search filter-listing-form button" method="GET">
                                                <div className="search-form-inner">
                                                    <div className="main-inner clearfix">
                                                        <div className="content-main-inner">
                                                            <div className="row align-items-center">
                                                                <div className="col-9">
                                                                    <div className="form-group">
                                                                        <input type="text" name="filter-title" className="form-control" id="Rn3PF_title" placeholder="What service are you looking for today?" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <button className="btn btn-primary w-100" type="submit">Search</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-inline-block">
                            <Link href="https://demoapus1.com/freeio/become-seller" className="btn btn-success">
                                Become a Seller
                            </Link>
                        </div>
                        <div className="d-inline-block">
                            <Link className="btn btn-outline-secondary" href="https://demoapus1.com/freeio/login/" title="Login">Login</Link>
                            <Link className="btn btn-outline-secondary" href="https://demoapus1.com/freeio/register/" title="Sign Up">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
