/* eslint-disable arrow-body-style */
import { lazy } from 'react';

const ChangeNetwork = lazy(() => import('../components/changeNetwork'));

const routes = [
  {
    component: ChangeNetwork,
    path: '/change-network',
  },
];

export default routes;
