/* eslint-disable arrow-body-style */
import { lazy } from 'react';

const Record = lazy(() => import('../components/record'));
const Home = lazy(() => import('../components/home/agreement'));
const Token = lazy(() => import('../components/home/token'));

const privateRoutes = [
  {
    component: Record,
    path: '/',
  },
  {
    component: Home,
    path: '/create-agreement',
  },
  {
    component: Token,
    path: '/token-Interaction',
  },
];

export default privateRoutes;
