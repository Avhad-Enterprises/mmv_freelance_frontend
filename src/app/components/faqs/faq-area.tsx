import React from 'react';
import Link from 'next/link';
import AccordionItem from '../accordion/accordion-item';

const faqContent = {
  gettingStarted: [
    { id: 'gs1', title: 'What is MakeMyVid.io?', desc: 'MakeMyVid.io is the world\'s first and only global freelance marketplace exclusively for video creators. We connect businesses and individuals with elite, vetted video editors, freelance videographers, animators, and other post-production talent from around the world for any video creation project.' },
    { id: 'gs2', title: 'How is MakeMyVid.io different from general freelance platforms like Upwork or Fiverr?', desc: 'Our exclusive focus on video sets us apart. Unlike general platforms, we provide deep specialization. Every tool, feature, and talent profile is tailored for video production. This means you find expert video talent faster, without sifting through irrelevant freelancers.' },
    { id: 'gs3', title: 'Who is this platform for?', desc: 'MakeMyVid.io is designed for two main groups: Clients (agencies, CMOs, founders, marketing teams, YouTubers) looking to hire video editors or outsource video production, and Freelancers (professional video editors, videographers, animators) seeking high-quality, remote video editing jobs and videography gigs.' },
    { id: 'gs4', title: 'Is MakeMyVid.io a global marketplace?', desc: 'Yes, we are a fully global platform. You can hire remote video editors from any country and find on-ground freelance videographers in a growing number of cities worldwide, starting with major hubs in India and expanding rapidly.' },
    { id: 'gs5', title: 'What are the main benefits of using MakeMyVid.io?', desc: 'For clients, the key benefits are access to vetted video talent, the ability to post jobs for free, and a seamless hiring process. For freelancers, the benefits include a 0% commission structure for videographers, a low 12.5% fee for editors, and access to a global stream of video production projects.' },
    { id: 'gs6', title: 'How do I get started as a client?', desc: 'Getting started is simple and free. Click the "Post a Job" button, fill out a brief form detailing your video project needs (e.g., "looking for a YouTube video editor"), and you\'ll start receiving proposals from qualified creators in hours.' },
    { id: 'gs7', title: 'How do I start as a freelancer?', desc: 'To find freelance video work, click "Join as Freelancer," create your profile, showcase your skills, and upload your portfolio. Once approved, you can immediately start bidding on video editing and videography jobs.' },
    { id: 'gs8', title: 'What types of video services can I find on the platform?', desc: 'You can find a comprehensive range of video production services, including Reels & Shorts editing, wedding video editing, corporate video production, 2D & 3D animation, drone videography, podcast video editing, and much more.' },
    { id: 'gs9', title: 'Is there a mobile app for MakeMyVid.io?', desc: 'While our website is fully mobile-responsive for easy access on any device, a dedicated mobile app is currently in development to further streamline your video production workflow on the go.' },
    { id: 'gs10', title: 'Do you offer services for both large agencies and small businesses?', desc: 'Absolutely. Our platform is built to scale. Whether you are a large agency looking to outsource video editing for multiple clients or a small business needing a single promotional video, you\'ll find the right talent and tools here.' },
    { id: 'gs11', title: 'What is the vision behind MakeMyVid.io?', desc: 'Our vision is to be the world\'s top-of-mind destination for video creation. We aim to empower every creator and business to produce high-quality video content seamlessly, regardless of geographic location.' },
  ],
  forClients: [
    { id: 'fc1', title: 'How do I post a video project on MakeMyVid.io?', desc: 'Simply click "Post a Job," and our intuitive form will guide you. Be sure to describe your project clearly, including the type of video (e.g., corporate video, YouTube content), required skills, budget, and timeline to attract the best freelance video talent.' },
    { id: 'fc2', title: 'Is it really free to post a job?', desc: 'Yes, it is 100% free for clients to post a job. You will only pay for the work you commission once you hire a freelancer and approve the project milestones or final delivery. There are no hidden fees to find a video editor.' },
    { id: 'fc3', title: 'How do I find the right freelance videographer or video editor?', desc: 'You can either post a job and receive proposals, or you can browse our directory of vetted video creators. Use filters to search by skill (e.g., "After Effects," "Final Cut Pro"), specialty ("wedding film editor," "Reels editor"), location, and budget.' },
    { id: 'fc4', title: 'Can I see a freelancer\'s portfolio before hiring?', desc: 'Yes. Every freelancer profile includes a detailed portfolio showcasing their best work. We strongly encourage you to review portfolios to ensure their style matches your vision before you hire a video freelancer.' },
    { id: 'fc5', title: 'How fast can I hire someone for my project?', desc: 'The timeline can be very fast. For urgent projects, you can start receiving proposals from qualified video editors and videographers within a few hours of posting your job.' },
    { id: 'fc6', title: 'How do I find a local videographer in my city?', desc: 'Our platform allows you to hire on-ground videographers for local shoots. Simply use the location filter in your search or specify the city (e.g., "videographer in Bengaluru") in your job post to connect with local professionals.' },
    { id: 'fc7', title: 'Can I hire talent for a very small project, like editing one Instagram Reel?', desc: 'Yes. MakeMyVid.io is perfect for projects of all sizes. Many of our top creators specialize in short-form video editing and are available for small, one-time gigs.' },
    { id: 'fc8', title: 'What if I\'m not sure what my budget should be?', desc: 'You can either set a fixed price or an hourly rate. If you\'re unsure, you can review the profiles of similar video editors to get an idea of their rates, or you can state in your job post that the budget is open to discussion.' },
    { id: 'fc9', title: 'How does the vetting process for freelancers work?', desc: 'We have a multi-step vetting process that includes a review of each freelancer\'s portfolio, experience, and professional background. This ensures that when you hire video talent on our platform, you\'re choosing from a pool of qualified experts.' },
    { id: 'fc10', title: 'Can I interview a freelancer before making a hiring decision?', desc: 'Absolutely. Our built-in chat feature allows you to communicate directly with potential candidates. You can ask questions, clarify project details, and ensure they are the perfect fit before extending an offer.' },
    { id: 'fc11', title: 'What if I need a full team, like a videographer and an editor?', desc: 'You can easily hire multiple freelancers for a single project. You can post a job for a video production team or hire individual specialists for shooting and post-production separately through our platform.' },
  ],
  forFreelancers: [
    { id: 'ff1', title: 'How does the 0% commission for videographers work?', desc: 'It\'s simple: for any on-ground videography gigs you secure through MakeMyVid.io, you keep 100% of what you earn. We charge zero commission to help you maximize your income from local shoots.' },
    { id: 'ff2', title: 'What are the commission fees for video editors?', desc: 'We offer a highly competitive flat commission of just 12.5% for remote video editors. This fee is only charged after you have been successfully paid by the client for a completed project.' },
    { id: 'ff3', title: 'What kind of video editing jobs can I find?', desc: 'You\'ll find a wide variety of freelance video editing jobs, including opportunities in YouTube content creation, corporate video production, wedding film editing, social media ads, documentary post-production, and much more.' },
    { id: 'ff4', title: 'How can I make my profile stand out to clients?', desc: 'A great profile has a professional headshot, a clear and concise bio highlighting your expertise, and a stunning portfolio. Be specific about your skills (e.g., "expert in Adobe Premiere Pro," "DaVinci Resolve colorist").' },
    { id: 'ff5', title: 'How do I bid on a project?', desc: 'When you find a job you\'re interested in, you\'ll submit a proposal. Tailor each proposal to the client\'s specific needs, explain how your skills are a perfect match, and provide relevant examples from your portfolio.' },
    { id: 'ff6', title: 'Are there opportunities for new freelancers with less experience?', desc: 'Yes. While many clients seek experienced professionals, there are also numerous entry-level video editing jobs and opportunities for talented newcomers to build their portfolios and gain experience.' },
    { id: 'ff7', title: 'Can I set my own rates?', desc: 'Yes. You have complete control over your pricing. You can set an hourly rate or bid with a fixed price on a per-project basis.' },
    { id: 'ff8', title: 'How can I get more invitations to jobs?', desc: 'Maintaining a high rating, completing projects on time, and having a specialized, keyword-rich profile will increase your visibility. Clients can search for and invite top-rated video freelancers directly to their projects.' },
    { id: 'ff9', title: 'What is the "Rising Talent" badge?', desc: 'The "Rising Talent" badge is awarded to new freelancers who show great potential through strong portfolios and positive early feedback. It helps you stand out to clients looking for fresh talent.' },
    { id: 'ff10', title: 'Do I need my own editing software?', desc: 'Yes. As a freelance professional, you are expected to have your own licensed software (e.g., Adobe Creative Suite, Final Cut Pro, DaVinci Resolve) and hardware to complete your work.' },
    { id: 'ff11', title: 'Can I find long-term or recurring work?', desc: 'Many clients on MakeMyVid.io are looking for long-term partners for ongoing needs, such as a YouTube channel editor or a regular corporate video producer. Delivering excellent work on your first project is the best way to secure recurring gigs.' },
  ],
  accountManagement: [
    { id: 'am1', title: 'How do I sign up for a MakeMyVid.io account?', desc: 'Signing up is fast and easy. Simply click the "Login/Sign up" button, and you can register using your email address or by linking your Google or LinkedIn account. You\'ll then choose whether you\'re primarily here to hire video talent or find video work.' },
    { id: 'am2', title: 'Can I have both a client and a freelancer account?', desc: 'Yes, you can. Your MakeMyVid.io account allows you to seamlessly switch between a client profile (for hiring) and a freelancer profile (for working) from a single login, giving you the flexibility to both outsource video editing and take on video editing gigs.' },
    { id: 'am3', title: 'What are the key elements of a compelling freelance profile?', desc: 'A top-tier profile includes a professional profile picture, a strong headline that summarizes your expertise (e.g., "Corporate Video Editor & Motion Graphics Artist"), a detailed bio, a list of your technical skills, and a high-quality portfolio that showcases your best video production work.' },
    { id: 'am4', title: 'What are the guidelines for uploading to my portfolio?', desc: 'We recommend uploading high-resolution video clips or links to full projects (e.g., via YouTube or Vimeo). Be sure to include a brief description for each project, outlining your role, the tools you used, and the project\'s objective. A diverse portfolio showing different styles is highly effective.' },
    { id: 'am5', title: 'How do I verify my account?', desc: 'To ensure a secure marketplace, we have an identity verification process. This typically involves providing a government-issued ID. A verified badge on your profile increases trust and can lead to more opportunities to hire or be hired for video projects.' },
    { id: 'am6', title: 'I forgot my password. How can I reset it?', desc: 'If you\'ve forgotten your password, simply click the "Forgot Password" link on the login page. You\'ll receive an email with instructions on how to securely reset your password and regain access to your account.' },
    { id: 'am7', title: 'How can I manage my email notifications?', desc: 'You have full control over your notifications. In your account settings, you can choose to be notified about new job matches, messages from clients, payment updates, and platform news. You can customize these settings at any time.' },
    { id: 'am8', title: 'How do I close my MakeMyVid.io account?', desc: 'If you wish to close your account, you can do so from your account settings page. Please ensure all active projects are completed and all payments have been settled before you proceed with account deactivation.' },
    { id: 'am9', title: 'Why is my freelancer profile pending approval?', desc: 'All new freelancer profiles are reviewed by our team to ensure they meet our quality standards. This vetting process helps maintain a high-quality pool of video talent. The review is typically completed within 24-48 hours.' },
    { id: 'am10', title: 'How do I update my skills or services?', desc: 'You can update your profile at any time. Simply navigate to your profile page and click "Edit." We recommend keeping your skills (e.g., "4K Video Editing," "Drone Videography") and portfolio updated to attract the most relevant video production jobs.' },
    { id: 'am11', title: 'Is my personal information safe on MakeMyVid.io?', desc: 'Yes. We take data privacy very seriously. Your personal information is protected with industry-standard security measures and is never shared with third parties. Please refer to our Privacy Policy for more details.' },
  ],
  paymentsFeesSecurity: [
    { id: 'pfs1', title: 'How does the payment system work for clients?', desc: 'When you hire a video freelancer, you\'ll fund the project or milestone into our secure escrow system. The funds are held safely and are only released to the freelancer once you have reviewed and approved the delivered work. This ensures you only pay for results you are happy with.' },
    { id: 'pfs2', title: 'What payment methods do you accept?', desc: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for funding your video editing and videography projects. We are continuously working on adding more local payment options for our global users.' },
    { id: 'pfs3', title: 'What are the withdrawal options for freelancers?', desc: 'Freelancers can withdraw their earnings through several methods, including direct bank transfer, PayPal, and Payoneer. You can choose the most convenient withdrawal method in your payment settings.' },
    { id: 'pfs4', title: 'How quickly do I get paid as a freelancer?', desc: 'Once a client approves a project or milestone, the funds are immediately released to your MakeMyVid.io account. The time it takes for the funds to arrive in your bank account depends on your chosen withdrawal method, but it is typically within 1-5 business days.' },
    { id: 'pfs5', title: 'How are disputes over payments or work quality handled?', desc: 'In the rare event of a dispute, MakeMyVid.io offers mediation services. Our support team will review the project communications and deliverables to help facilitate a fair resolution for both the client and the video creator. The funds in escrow provide security for both parties throughout this process.' },
    { id: 'pfs6', title: 'Are there any fees for clients?', desc: 'No, there are no fees for clients to post a job or hire talent. Clients only pay the agreed-upon price for the project, plus a standard payment processing fee.' },
    { id: 'pfs7', title: 'Can you clarify the 0% commission for videographers?', desc: 'The 0% commission for videographers applies specifically to on-ground shooting gigs. For these projects, you keep 100% of the project price. For remote video editing work, our standard 12.5% fee applies.' },
    { id: 'pfs8', title: 'Can I get an invoice for my payment?', desc: 'Yes, all transactions on MakeMyVid.io are recorded. Clients can download detailed invoices for their accounting purposes directly from their transaction history page.' },
    { id: 'pfs9', title: 'Is it safe to enter my payment details on the platform?', desc: 'Absolutely. Our platform uses PCI-compliant payment gateways and SSL encryption to ensure that all your financial data is processed securely and kept confidential.' },
    { id: 'pfs10', title: 'Do you support fixed-price and hourly projects?', desc: 'Yes, we support both. You can hire a video editor on a fixed-price basis for projects with a clearly defined scope, or on an hourly basis for more flexible, ongoing work.' },
    { id: 'pfs11', title: 'How are taxes handled for freelancers?', desc: 'As a freelancer, you are responsible for your own tax obligations according to the laws of your country. MakeMyVid.io provides you with a detailed earnings history to make tax reporting easier.' },
  ],
  projectsWorkflow: [
    { id: 'pw1', title: 'How do I communicate with the freelancer or client?', desc: 'Our platform has a built-in messaging system that allows for real-time communication. You can share messages, attach files, and discuss all aspects of your video project in one secure place.' },
    { id: 'pw2', title: 'How can I securely share large video files for editing?', desc: 'You can share files directly through our messaging system for smaller files. For larger raw footage, we recommend using secure, shareable links from services like Google Drive, Dropbox, or WeTransfer. Additionally, our CompVid tool helps with video compression to make sharing easier.' },
    { id: 'pw3', title: 'What is the process for requesting revisions?', desc: 'When a freelancer delivers a draft, you can review it and request revisions if needed. Clear communication about the required changes is key. Most freelancers include a certain number of revisions in their project scope, which should be discussed before starting the video editing process.' },
    { id: 'pw4', title: 'How do I mark a project as complete?', desc: 'Once you have received the final deliverables and are 100% satisfied with the work, you can mark the project or milestone as complete. This action authorizes the release of the payment from escrow to the freelancer.' },
    { id: 'pw5', title: 'How does the feedback and rating system work?', desc: 'After a project is completed, both the client and the freelancer can leave a rating and feedback for each other. This public feedback is crucial for building a strong reputation on the platform and helps others make informed decisions when they hire video talent.' },
    { id: 'pw6', title: 'Can I set milestones for a large project?', desc: 'Yes, for larger video production projects, we highly recommend setting up milestones. This allows you to break down the project into smaller, manageable parts. You fund and approve each milestone one by one, providing better control over the workflow and payments.' },
    { id: 'pw7', title: 'What happens if a freelancer misses a deadline?', desc: 'We encourage clear communication. If a deadline is approaching, check in with your freelancer. If there is a persistent issue, you can reach out to our support team for assistance. The escrow system ensures you do not pay for uncompleted work.' },
    { id: 'pw8', title: 'How can I track the progress of my project?', desc: 'Regular communication with your freelancer is the best way to track progress. You can request regular updates, and for hourly projects, freelancers can log their time through our platform\'s work diary.' },
    { id: 'pw9', title: 'What are the standard file formats for video delivery?', desc: 'This should be agreed upon at the start of the project. Common delivery formats include MP4 (H.264) for web use, and higher-quality formats like ProRes for professional applications. Always discuss your specific needs with your video editor.' },
    { id: 'pw10', title: 'Who owns the rights to the final video?', desc: 'Unless otherwise agreed upon in a separate contract, once the project is completed and the freelancer is paid in full, the client typically owns the full rights to the final video.' },
    { id: 'pw11', title: 'Can I re-hire a freelancer I enjoyed working with?', desc: 'Yes! We make it easy to build long-term relationships. You can directly offer a new contract to any freelancer you have previously worked with, bypassing the job posting process for a faster hiring experience.' },
  ],
  platformToolsFeatures: [
    { id: 'ptf1', title: 'What is CompVid and how does it help with video compression?', desc: 'CompVid is our powerful, built-in video compression tool. It allows you to significantly reduce the file size of large video files (e.g., 10GB+) in minutes without a noticeable loss in quality. This makes it faster and cheaper to share and store your video footage.' },
    { id: 'ptf2', title: 'Are the platform tools like CompVid free to use?', desc: 'Yes, many of our integrated tools, including a basic tier of CompVid and our YouTube short video browser, are offered for free to all registered MakeMyVid.io users to enhance their video production workflow.' },
    { id: 'ptf3', title: 'How does the YouTube short video browser work?', desc: 'This free tool allows you to browse and discover trending YouTube Shorts without the distraction of the main YouTube interface. It’s an excellent resource for market research and finding inspiration for your short-form video content.' },
    { id: 'ptf4', title: 'What is the video summarizer tool?', desc: 'Our AI-powered video summarizer tool can analyze a long video and provide a concise text summary. This is useful for quickly understanding the content of a video before you decide to outsource the editing or use it for reference.' },
    { id: 'ptf5', title: 'How can I access these tools?', desc: 'You can find all our supplementary tools under the "Tools" section in the main navigation menu of the MakeMyVid.io website.' },
    { id: 'ptf6', title: 'Does CompVid integrate with cloud storage?', desc: 'Yes, CompVid is designed for a modern workflow. You can directly connect your Google Drive or Dropbox account to automatically save your compressed files, saving you time and local storage space.' },
    { id: 'ptf7', title: 'Will you be adding more tools in the future?', desc: 'Absolutely. We are constantly working on developing new features and tools to support the global video creator community. Our goal is to be a comprehensive resource for the entire video creation lifecycle.' },
    { id: 'ptf8', title: 'Can I use the tools without hiring a freelancer?', desc: 'Yes, you can create a free MakeMyVid.io account and use our free tools without any obligation to post a job or hire talent. We aim to provide value to the entire video community.' },
    { id: 'ptf9', title: 'Is there a limit on how many videos I can compress with CompVid?', desc: 'Our free tier of CompVid comes with a generous monthly limit. For users with heavy video compression needs, we will be offering affordable premium plans with higher limits and advanced features.' },
    { id: 'ptf10', title: 'How does the search and filter system work?', desc: 'Our advanced search feature allows you to find the perfect video freelancer quickly. You can filter by specific skills (e.g., "Color Grading"), software expertise ("Adobe Premiere Pro"), language, location, budget, and ratings.' },
    { id: 'ptf11', title: 'What is the "Featured Creators" section?', desc: 'The "Featured Creators" section highlights top-performing and rising talent on our platform. Being featured is a great way for video editors and videographers to gain visibility and for clients to quickly find proven professionals.' },
  ],
};

const FaqArea = () => {
  return (
    <section className="faq-section position-relative pt-100 lg-pt-80">
      <div className="container">
        <ul className="nav nav-tabs border-0 justify-content-center" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#fc1_tab" role="tab">All</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc2_tab" role="tab">Clients</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc3_tab" role="tab">Freelancers</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc4_tab" role="tab">Account</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc5_tab" role="tab">Payments</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc6_tab" role="tab">Projects & Workflow</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#fc7_tab" role="tab">Platform Tools</button>
          </li>
        </ul>
        <div className="bg-wrapper mt-60 lg-mt-40">
          <div className="tab-content" id="myTabContent">
            {/* All FAQs */}
            {/* <div className="tab-pane fade show active" role="tabpanel" id="fc1_tab">
              <div className="accordion accordion-style-two" id="accordionAll">
                {faqContent.gettingStarted.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                    isShow={index === 0} // Show the first item by default
                  />
                ))}
                {faqContent.forClients.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
                 {faqContent.forFreelancers.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
                 {faqContent.accountManagement.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
                 {faqContent.paymentsFeesSecurity.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
                 {faqContent.projectsWorkflow.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
                 {faqContent.platformToolsFeatures.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAll'
                  />
                ))}
              </div>
            </div> */}

            {/* getting started FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc1_tab">
              <div className="accordion accordion-style-two" id="accordionClients">
                {faqContent.gettingStarted.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionClients'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>


            {/* Clients FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc2_tab">
              <div className="accordion accordion-style-two" id="accordionClients">
                {faqContent.forClients.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionClients'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Freelancers FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc3_tab">
              <div className="accordion accordion-style-two" id="accordionFreelancers">
                {faqContent.forFreelancers.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionFreelancers'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Account FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc4_tab">
              <div className="accordion accordion-style-two" id="accordionAccount">
                {faqContent.accountManagement.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionAccount'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Payments FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc5_tab">
              <div className="accordion accordion-style-two" id="accordionPayments">
                {faqContent.paymentsFeesSecurity.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionPayments'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Projects & Workflow FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc6_tab">
              <div className="accordion accordion-style-two" id="accordionProjectsWorkflow">
                {faqContent.projectsWorkflow.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionProjectsWorkflow'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Platform Tools FAQs */}
            <div className="tab-pane fade" role="tabpanel" id="fc7_tab">
              <div className="accordion accordion-style-two" id="accordionPlatformTools">
                {faqContent.platformToolsFeatures.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={faq.title}
                    desc={faq.desc}
                    parent='accordionPlatformTools'
                    isShow={index === 0}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="text-center border-bottom pb-150 lg-pb-50 mt-60 lg-mt-40 wow fadeInUp">
          <div className="title-three mb-30">
            <h2 className="fw-normal">Don’t get your answer?</h2>
          </div>
          <Link href='/contact' className="btn-one">Contact Us</Link>
        </div>
      </div>
    </section>
  );
};

export default FaqArea;