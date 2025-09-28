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
  // blog postbox
  {
    blog_id: 11,
    img: blog_11,
    grid_img: blog_grid_1,
    img_full: blog_full_1,
    tags: ['Solution'],
    title1: 'Print, publishing qui visual ux quis layout mockups.',
    author_name: 'Martin Cooley',
    date: '12 MAY, 2023',
    featured: true,
    short_description:
      'Tomfoolery crikey bits and bobs brilliant bamboozled down the pub amongst brolly hanky panky, cack bonnet arse over tit burke bugger all mate bodge. cillum dolore eu fugiat pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Suspendisse interdum consectetur libero id faucibu nisl. Lacus vel facilisis volutpat est velit egestas.Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum. Sit amet ris nullam eget felis. Enim praesent elementum facilisis leo. Ultricies leo integer.',
    title: 'blog-postbox',
  },
];


export default blog_data;