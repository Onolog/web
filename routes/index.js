import Activities from '../components/Activities';
import Activity from '../components/Activity';
import Home from '../components/Home';
import Login from '../components/Login';
import NotFound from '../components/NotFound';
import Shoes from '../components/Shoes';
import Shoe from '../components/Shoe';

export default [
  {
    path: '/home',
    component: Home,
    exact: true,
  },
  {
    path: '/activities',
    component: Activities,
    exact: true,
  },
  {
    path: '/activities/:id',
    component: Activity,
  },
  {
    path: '/shoes',
    component: Shoes,
    exact: true,
  },
  {
    path: '/shoes/:id',
    component: Shoe,
  },
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '*',
    component: NotFound,
  },
];
