// @flow

import loadable from '@loadable/component';

import { INDEX_PATH } from '../constants/paths';

export type RouteType = {
  component: Object,
  path: string,
  exact?: boolean,
};

/* eslint-disable max-len */
const Activity = loadable(() => import('./controllers/ActivityController.react'));
const Calendar = loadable(() => import('./controllers/CalendarController.react'));
const Chart = loadable(() => import('./controllers/ChartController.react'));
const Data = loadable(() => import('./controllers/DataController.react'));
const ErrorRoute = loadable(() => import('./controllers/ErrorController.react'));
const Friends = loadable(() => import('./controllers/FriendsController.react'));
const Garmin = loadable(() => import('./controllers/GarminController.react'));
const Index = loadable(() => import('./controllers/IndexController.react'));
const NotFound = loadable(() => import('./controllers/NotFoundController.react'));
const Privacy = loadable(() => import('./controllers/PrivacyController.react'));
const Profile = loadable(() => import('./controllers/ProfileController.react'));
const Settings = loadable(() => import('./controllers/SettingsController.react'));
const Shoes = loadable(() => import('./controllers/ShoesController.react'));
const Terms = loadable(() => import('./controllers/TermsController.react'));
const Vdot = loadable(() => import('./controllers/VdotController.react'));
/* eslint-enable max-len */

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
    path: '/error',
    component: ErrorRoute,
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
