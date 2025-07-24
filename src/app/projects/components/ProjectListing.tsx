import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectListing() {
  const projects = [
    {
      id: 5632,
      title: "Developer for ACG iOS apps and Website",
      employer: {
        name: "Apinter",
        logo: "/wp-content/uploads/2022/10/employer4.jpg",
        url: "https://demoapus1.com/freeio/employer/apinter/"
      },
      location: "Miami",
      posted: "3 years ago",
      proposals: 2,
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam ...",
      skills: [
        { name: "Artist", url: "https://demoapus1.com/freeio/project-skill/artist/" },
        { name: "Computer", url: "https://demoapus1.com/freeio/project-skill/computer/" },
        { name: "Front end Developer", url: "https://demoapus1.com/freeio/project-skill/front-end-developer/" }
      ],
      priceRange: "$79 - $89",
      priceSuffix: "Hourly rate",
      detailUrl: "https://demoapus1.com/freeio/project/developer-for-acg-ios-apps-and-website/#project-proposal-form-wrapper"
    },
    {
      id: 5630,
      title: "English Content Writer for College",
      employer: {
        name: "Mediaaz",
        logo: "/wp-content/uploads/2022/10/employer1.jpg",
        url: "https://demoapus1.com/freeio/employer/mediaaz/"
      },
      location: "Los Angeles",
      posted: "3 years ago",
      proposals: 3,
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam ...",
      skills: [
        { name: "Artist", url: "https://demoapus1.com/freeio/project-skill/artist/" },
        { name: "Computer", url: "https://demoapus1.com/freeio/project-skill/computer/" },
        { name: "Front end Developer", url: "https://demoapus1.com/freeio/project-skill/front-end-developer/" }
      ],
      priceRange: "$29 - $59",
      priceSuffix: "Fixed",
      detailUrl: "https://demoapus1.com/freeio/project/english-content-writer-for-college/#project-proposal-form-wrapper"
    },
    {
      id: 5628,
      title: "Developer to framework for web agency",
      employer: {
        name: "Redesign",
        logo: "/wp-content/uploads/2022/10/employer8.png",
        url: "https://demoapus1.com/freeio/employer/redesign/"
      },
      location: "New York",
      posted: "3 years ago",
      proposals: 1,
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam ...",
      skills: [
        { name: "Adobe Photoshop", url: "https://demoapus1.com/freeio/project-skill/adobe-photoshop/" },
        { name: "Adobe XD", url: "https://demoapus1.com/freeio/project-skill/adobe-xd/" },
        { name: "Android Developer", url: "https://demoapus1.com/freeio/project-skill/android-developer/" }
      ],
      priceRange: "$125 - $180",
      priceSuffix: "Hourly rate",
      detailUrl: "https://demoapus1.com/freeio/project/developer-to-framework-for-web-agency/#project-proposal-form-wrapper"
    },
    {
      id: 5625,
      title: "Create desktop applications with source PHP",
      employer: {
        name: "Dgsolution",
        logo: "/wp-content/uploads/2022/11/employer12.jpg",
        url: "https://demoapus1.com/freeio/employer/dgsolution/"
      },
      location: "New York",
      posted: "3 years ago",
      proposals: 1,
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam ...",
      skills: [
        { name: "Adobe Photoshop", url: "https://demoapus1.com/freeio/project-skill/adobe-photoshop/" },
        { name: "Adobe XD", url: "https://demoapus1.com/freeio/project-skill/adobe-xd/" },
        { name: "Android Developer", url: "https://demoapus1.com/freeio/project-skill/android-developer/" }
      ],
      priceRange: "$79 - $99",
      priceSuffix: "Fixed",
      detailUrl: "https://demoapus1.com/freeio/project/create-desktop-applications-with-source-php/#project-proposal-form-wrapper"
    },
    {
      id: 5624,
      title: "Manage my projects with Js, Css, Html",
      employer: {
        name: "Upwork",
        logo: "/wp-content/uploads/2022/10/employer2.jpg",
        url: "https://demoapus1.com/freeio/employer/upwork/",
        verified: true
      },
      location: "Los Angeles",
      posted: "3 years ago",
      proposals: 2,
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam ...",
      skills: [
        { name: "Adobe XD", url: "https://demoapus1.com/freeio/project-skill/adobe-xd/" },
        { name: "Artist", url: "https://demoapus1.com/freeio/project-skill/artist/" },
        { name: "Computer", url: "https://demoapus1.com/freeio/project-skill/computer/" }
      ],
      priceRange: "$180 - $200",
      priceSuffix: "Hourly rate",
      detailUrl: "https://demoapus1.com/freeio/project/manage-my-projects-with-js-css-html/#project-proposal-form-wrapper"
    },
    {
      id: 5620,
      title: "Website Designer Required For My Project",
      employer: {
        name: "Upwork",
        logo: "/wp-content/uploads/2022/10/about6-150x150.jpg",
        url: "https://demoapus1.com/freeio/employer/upwork/",
        verified: true
      },
      location: "Los Angeles",
      posted: "3 years ago",
      proposals: 1,
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam ...",
      skills: [
        { name: "Adobe XD", url: "https://demoapus1.com/freeio/project-skill/adobe-xd/" },
        { name: "Artist", url: "https://demoapus1.com/freeio/project-skill/artist/" },
        { name: "Computer", url: "https://demoapus1.com/freeio/project-skill/computer/" }
      ],
      priceRange: "$120 - $150",
      priceSuffix: "Fixed",
      detailUrl: "https://demoapus1.com/freeio/project/website-designer-required-for-my-project/#project-proposal-form-wrapper"
    }
  ];

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div className="results-count">
              Showing all {projects.length} results
            </div>
            <form className="projects-ordering" method="get" action="https://demoapus1.com/freeio/projects-list/">
              <select name="filter-orderby" className="form-select" defaultValue="menu_order">
                <option value="menu_order">Sort by (Default)</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-lowest">Lowest Price</option>
                <option value="price-highest">Highest Price</option>
                <option value="random">Random</option>
              </select>
              <input type="hidden" name="paged" value="1" />
            </form>
          </div>
        </div>
      </div>
      <div className="row">
        {projects.map(project => (
          <div key={project.id} className="col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex">
                  <Link href={project.employer.url} className="flex-shrink-0">
                    <Image src={project.employer.logo} alt={project.employer.name} width={50} height={50} className="rounded-circle" />
                  </Link>
                  <div className="flex-grow-1 ms-3">
                    <h5 className="card-title">
                      <Link href={project.detailUrl}>{project.title}</Link>
                    </h5>
                    <p className="card-text">
                      <i className="flaticon-place"></i> {project.location} | Posted {project.posted} | {project.proposals} Proposals
                    </p>
                    <p className="card-text">{project.excerpt}</p>
                    <div className="project-skills">
                      {project.skills.map((skill, index) => (
                        <Link key={index} href={skill.url} className="badge bg-secondary me-1">{skill.name}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-end">
                    <div className="project-price">
                      <span>{project.priceRange}</span> <span className="text-muted">{project.priceSuffix}</span>
                    </div>
                    <Link href={project.detailUrl} className="btn btn-primary mt-2">Send Proposal</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
