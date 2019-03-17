import Activity from './controllers/ActivityController.react';
import Calendar from './controllers/CalendarController.react';
import Chart from './controllers/ChartController.react';
import Data from './controllers/DataController.react';
import Friends from './controllers/FriendsController.react';
import Garmin from './controllers/GarminController.react';
import Index from './controllers/IndexController.react';
import NotFound from './controllers/NotFoundController.react';
import Privacy from './controllers/PrivacyController.react';
import Profile from './controllers/ProfileController.react';
import Settings from './controllers/SettingsController.react';
import Shoes from './controllers/ShoesController.react';
import Terms from './controllers/TermsController.react';
import Vdot from './controllers/VdotController.react';

import { INDEX_PATH } from '../constants/paths';

export default [
  {
    path: INDEX_PATH,
    component: Index,
    exact: true,
  },
  {
    path: '/activities/:activityId',
    component: Activity,
  },
  {
    path: '/users/:userId',
    component: Profile,
  },
  {
    path: '/shoes',
    component: Shoes,
    exact: true,
  },
  {
    path: '/data',
    component: Data,
    exact: true,
  },
  {
    path: '/friends',
    component: Friends,
    exact: true,
  },
  {
    path: '/settings',
    component: Settings,
    exact: true,
  },
  {
    path: '/chart',
    component: Chart,
    exact: true,
  },
  {
    path: '/garmin',
    component: Garmin,
    exact: true,
  },
  {
    path: '/privacy',
    component: Privacy,
    exact: true,
  },
  {
    path: '/terms',
    component: Terms,
    exact: true,
  },
  {
    path: '/vdot',
    component: Vdot,
    exact: true,
  },
  {
    path: '/:year/:month',
    component: Calendar,
  },
  {
    path: '*',
    component: NotFound,
  },
];
