import { IMenuData } from "@/types/menu-data-type";

const menu_data:IMenuData[] = [
  {
    id:1,
    link:'/',
    title:'Home',
    sub_menus:[
      {link:'/',title:'Home 1'},
      // {link:'/home-2',title:'Home 2'},
      // {link:'/home-3',title:'Home 3'},
      // {link:'/home-4',title:'Home 4'},
      // {link:'/home-5',title:'Home 5'},
      // {link:'/home-6',title:'Home 6'},
      // {link:'/home-7',title:'Home 7'},
    ]
  },
  {
    id:2,
    link:'/job-list-v1',
    title:'Jobs',
    sub_menus:[
      {link:'/job-list-v1',title:'Job List style -1'},
      // {link:'/job-list-v2',title:'Job List style -2'},
      // {link:'/job-list-v3',title:'Job List style -3'},
      // {link:'/job-grid-v1',title:'Job Grid style -1'},
      // {link:'/job-grid-v2',title:'Job Grid style -2'},
      // {link:'/job-grid-v3',title:'Job Grid style -3'},
      // {link:'/job-details-v1',title:'Job Details v-1'},
      // {link:'/job-details-v2',title:'Job Details v-2'},
      // {link:'/job-wishlist',title:'Job Wishlist'},
    ]
  },
  {
    id: 3,
    link: '/candidates-v1',
    title: 'Candidates',
    sub_menus: [
      {link: '/candidates-v1', title: 'Candidates'}
    ]
  },
  {
    id:4,
    link:'/blog-v2',
    title:'Blog',
    sub_menus:[
      {link:'/blog-v2',title:'Blog'},
      // {link:'/coming-soon',title:'Blog Grid'},
      // {link:'/blog-v3',title:'Full width'},
      // {link:'/blog-details',title:'Blog Details'},
    ]
  },
  {
    id:5,
    link:'/contact',
    title:'Contact'
  },
  // {
  //   id:6,
  //   link:'/dashboard/employer-dashboard',
  //   title:'Dashboard',
  //   sub_menus:[
  //     {link:'/dashboard/candidate-dashboard',title:'Candidate Dashboard'},
  //     {link:'/dashboard/employ-dashboard',title:'Employer Dashboard'},
  //   ]
  // }
]

export default menu_data;