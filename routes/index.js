import About from '../components/About';
import Home from '../components/Home';
import Login from '../components/Login';

export default [
  {
    path: '/home',
    component: Home,
    exact: true,
  },
  {
    path: '/about',
    component: About,
    exact: true,
  },
  {
    path: '/login',
    component: Login,
    exact: true,
  },
];
