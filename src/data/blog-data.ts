import { IBlogDataType } from '@/types/blog-type';
import blog_1 from '@/assets/images/blog/blog_img_01.jpg';
import blog_2 from '@/assets/images/blog/blog_img_02.jpg';
import blog_3 from '@/assets/images/blog/blog_img_03.jpg';
import blog_4 from '@/assets/images/blog/blog_img_04.jpg';
import blog_5 from '@/assets/images/blog/blog_img_05.jpg';
import blog_6 from '@/assets/images/blog/blog_img_06.jpg';
import blog_7 from '@/assets/images/blog/blog_img_07.jpg';
import blog_8 from '@/assets/images/blog/blog_img_08.jpg';
import blog_9 from '@/assets/images/blog/blog_img_09.jpg';
import blog_10 from '@/assets/images/blog/blog_img_10.jpg';
import blog_11 from '@/assets/images/blog/blog_img_11.jpg';
import blog_12 from '@/assets/images/blog/blog_img_12.jpg';
import blog_13 from '@/assets/images/blog/blog_img_13.jpg';
import blog_14 from '@/assets/images/blog/blog_img_14.jpg';
import blog_15 from '@/assets/images/blog/blog_img_15.jpg';
import blog_16 from '@/assets/images/blog/blog_img_16.jpg';
import blog_17 from '@/assets/images/blog/blog_img_17.jpg';
import blog_grid_1 from '@/assets/images/blog/blog_img_18.jpg';
import blog_grid_2 from '@/assets/images/blog/blog_img_19.jpg';
import blog_grid_3 from '@/assets/images/blog/blog_img_20.jpg';
import blog_grid_4 from '@/assets/images/blog/blog_img_21.jpg';
import blog_grid_5 from '@/assets/images/blog/blog_img_22.jpg';
import blog_grid_6 from '@/assets/images/blog/blog_img_23.jpg';
import blog_full_1 from '@/assets/images/blog/blog_img_24.jpg';
import blog_full_2 from '@/assets/images/blog/blog_img_25.jpg';
import blog_full_3 from '@/assets/images/blog/blog_img_26.jpg';
import blog_full_4 from '@/assets/images/blog/blog_img_27.jpg';
import blog_full_5 from '@/assets/images/blog/blog_img_28.jpg';
import blog_full_6 from '@/assets/images/blog/blog_img_29.jpg';
import blog_full_7 from '@/assets/images/blog/blog_img_30.jpg';
import blog_full_8 from '@/assets/images/blog/blog_img_31.jpg';

const blog_data: IBlogDataType[] = [
  // blog one
  {
    blog_id: 1,
    img: blog_1,
    tags: ['Developer', 'Code'],
    title1: 'Print, publishing qui visual layout mockups.',
    author_name: 'James Brower',
    date: '23 APR, 2023',
    short_description:
      'Tomfoolery crikey bits and bobs brilliant bamboozled down the pub amongst brolly hanky panky, cack bonnet arse over tit burke bugger all mate bodge. cillum dolore eu fugiat pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Suspendisse interdum consectetur libero id faucibu nisl. Lacus vel facilisis volutpat est velit egestas.Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum. Sit amet ris nullam eget felis. Enim praesent elementum facilisis leo. Ultricies leo integer.',
    title: 'blog-one',
  },
  // blog two
  {
    blog_id: 4,
    img: blog_4,
    tags: ['Design', 'Work'],
    title1: 'Print, publishing qui visual layout mockups.',
    author_name: 'Martin Cooley',
    date: '27 APR, 2023',
    short_description:
      'This response is important for our ability to learn from mistakes, but words',
    title: 'blog-two',
  },
  // blog three
  {
    blog_id: 7,
    img: blog_7,
    tags: ['Solution'],
    title1: 'Print, publishing qui visual ux quis layout mockups.',
    author_name: 'Martin Cooley',
    date: '30 MAY, 2023',
    featured: true,
    short_description:
      'Tomfoolery crikey bits and bobs brilliant bamboozled down the pub amongst brolly hanky panky, cack bonnet arse over tit burke bugger all mate bodge. cillum dolore eu fugiat pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Suspendisse interdum consectetur libero id faucibu nisl. Lacus vel facilisis volutpat est velit egestas.Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum. Sit amet ris nullam eget felis. Enim praesent elementum facilisis leo. Ultricies leo integer.',
    title: 'blog-three',
  },
  // blog four
  {
    blog_id: 9,
    img: blog_9,
    tags: ['Solution'],
    title1: 'Print, publishing qui visual ux quis layout mockups.',
    author_name: 'John Smith',
    date: '2 MAY, 2023',
    featured: true,
    short_description:
      'Tomfoolery crikey bits and bobs brilliant bamboozled down the pub amongst brolly hanky panky, cack bonnet arse over tit burke bugger all mate bodge. cillum dolore eu fugiat pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Suspendisse interdum consectetur libero id faucibu nisl. Lacus vel facilisis volutpat est velit egestas.Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum. Sit amet ris nullam eget felis. Enim praesent elementum facilisis leo. Ultricies leo integer.',
    title: 'blog-four',
  },
  // blog five
  {
    blog_id: 2,
    img: blog_2,
    tags: ['Technology', 'Innovation'],
    title1: 'The Future of Remote Work: Trends and Best Practices',
    author_name: 'Sarah Johnson',
    date: '15 JUN, 2023',
    short_description:
      'Remote work has become the new normal for many professionals. This comprehensive guide explores the latest trends in remote collaboration tools, productivity hacks, and strategies for maintaining work-life balance in a distributed team environment. Learn how to build a successful remote work culture and leverage technology to enhance team performance.',
    title: 'blog-five',
  },
  // blog six
  {
    blog_id: 3,
    img: blog_3,
    tags: ['Career', 'Development'],
    title1: 'Building a Strong Personal Brand as a Developer',
    author_name: 'Mike Chen',
    date: '18 JUN, 2023',
    short_description:
      'In today\'s competitive job market, having a strong personal brand can make all the difference. Discover how to showcase your technical skills, contribute to open-source projects, build a professional online presence, and network effectively within the developer community. This guide provides actionable steps to establish yourself as a thought leader in your field.',
    title: 'blog-six',
  },
  // blog seven
  {
    blog_id: 5,
    img: blog_5,
    tags: ['Design', 'UX'],
    title1: 'Mastering User Experience Design Principles',
    author_name: 'Emma Davis',
    date: '22 JUN, 2023',
    featured: true,
    short_description:
      'User experience design is at the heart of creating successful digital products. This in-depth article covers fundamental UX principles, user research methodologies, prototyping techniques, and usability testing strategies. Learn how to create intuitive interfaces that delight users and drive business results through thoughtful design decisions.',
    title: 'blog-seven',
  },
  // blog eight
  {
    blog_id: 6,
    img: blog_6,
    tags: ['Business', 'Strategy'],
    title1: 'Scaling Your Startup: From MVP to Market Leader',
    author_name: 'David Wilson',
    date: '25 JUN, 2023',
    short_description:
      'Scaling a startup requires careful planning and execution. This guide walks through the key stages of startup growth, from validating your minimum viable product to building scalable systems and processes. Learn about hiring strategies, funding options, and the common pitfalls to avoid when taking your business to the next level.',
    title: 'blog-eight',
  },
  // blog nine
  {
    blog_id: 8,
    img: blog_8,
    tags: ['AI', 'Machine Learning'],
    title1: 'Getting Started with Machine Learning: A Beginner\'s Guide',
    author_name: 'Lisa Rodriguez',
    date: '28 JUN, 2023',
    featured: true,
    short_description:
      'Machine learning is transforming industries across the globe. This beginner-friendly guide introduces the fundamental concepts of ML, including supervised and unsupervised learning, neural networks, and practical applications. Get started with hands-on examples using popular frameworks and learn how to apply ML techniques to solve real-world problems.',
    title: 'blog-nine',
  },
  // blog ten
  {
    blog_id: 10,
    img: blog_10,
    tags: ['Productivity', 'Tools'],
    title1: 'Essential Developer Tools for 2023',
    author_name: 'Alex Thompson',
    date: '1 JUL, 2023',
    short_description:
      'The right tools can significantly boost developer productivity and code quality. This comprehensive review covers the best code editors, version control systems, testing frameworks, and collaboration tools available in 2023. Learn how to optimize your development workflow and stay efficient in an ever-evolving tech landscape.',
    title: 'blog-ten',
  },
  // blog eleven
  {
    blog_id: 12,
    img: blog_12,
    tags: ['Security', 'Best Practices'],
    title1: 'Web Application Security: Protecting Your Digital Assets',
    author_name: 'Rachel Green',
    date: '5 JUL, 2023',
    featured: true,
    short_description:
      'Cybersecurity threats are constantly evolving, making web application security more critical than ever. This guide covers essential security practices including secure coding techniques, authentication best practices, data encryption, and vulnerability assessment. Learn how to build secure applications and protect user data from common threats.',
    title: 'blog-eleven',
  },
  // blog twelve
  {
    blog_id: 13,
    img: blog_13,
    tags: ['Mobile', 'Development'],
    title1: 'Cross-Platform Mobile Development with React Native',
    author_name: 'Tom Anderson',
    date: '8 JUL, 2023',
    short_description:
      'React Native has revolutionized mobile app development by enabling code sharing across platforms. This tutorial covers the fundamentals of React Native development, including component architecture, navigation, state management, and native module integration. Build high-performance mobile apps for both iOS and Android with a single codebase.',
    title: 'blog-twelve',
  },
  // blog thirteen
  {
    blog_id: 14,
    img: blog_14,
    tags: ['Data Science', 'Analytics'],
    title1: 'Data-Driven Decision Making: A Practical Approach',
    author_name: 'Jennifer Lee',
    date: '12 JUL, 2023',
    short_description:
      'In the age of big data, making informed decisions is crucial for business success. This article explores how to leverage data analytics for strategic decision-making, including data collection methods, statistical analysis techniques, and visualization best practices. Learn to transform raw data into actionable insights that drive business growth.',
    title: 'blog-thirteen',
  },
  // blog fourteen
  {
    blog_id: 15,
    img: blog_15,
    tags: ['Cloud', 'Infrastructure'],
    title1: 'Cloud Computing Fundamentals and Best Practices',
    author_name: 'Mark Stevens',
    date: '15 JUL, 2023',
    featured: true,
    short_description:
      'Cloud computing has become the backbone of modern IT infrastructure. This comprehensive guide covers cloud service models, deployment strategies, and cost optimization techniques. Learn about major cloud providers, containerization with Docker and Kubernetes, and how to design scalable, resilient cloud architectures for your applications.',
    title: 'blog-fourteen',
  },
  // blog fifteen
  {
    blog_id: 16,
    img: blog_16,
    tags: ['Agile', 'Methodology'],
    title1: 'Agile Development: Beyond the Buzzwords',
    author_name: 'Sophie Martin',
    date: '18 JUL, 2023',
    short_description:
      'Agile methodology has transformed software development, but true implementation goes beyond following a framework. This article delves into the principles behind agile practices, team dynamics, continuous improvement, and adapting agile methods to different project types. Discover how to create a truly agile culture that delivers value consistently.',
    title: 'blog-fifteen',
  },
  // blog sixteen
  {
    blog_id: 17,
    img: blog_17,
    tags: ['Blockchain', 'Cryptocurrency'],
    title1: 'Understanding Blockchain Technology and Its Applications',
    author_name: 'Kevin Brown',
    date: '22 JUL, 2023',
    short_description:
      'Blockchain technology extends far beyond cryptocurrencies. This guide explains the core concepts of distributed ledgers, consensus mechanisms, and smart contracts. Explore real-world applications in supply chain management, healthcare, finance, and more, and learn how blockchain is reshaping industries across the globe.',
    title: 'blog-sixteen',
  },];

export default blog_data;
