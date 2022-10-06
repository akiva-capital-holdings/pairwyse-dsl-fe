/* eslint-disable arrow-body-style */
import { lazy } from 'react';

const Record = lazy(() => import('../components/record'));
const Home = lazy(() => import('../components/home'));

const privateRoutes = [
  {
    component: Record,
    path: '/',
  },
  {
    component: Home,
    path: '/create-agreement',
  },
];

export default privateRoutes;
