/* eslint-disable arrow-body-style */
import { Route } from 'react-router-dom';
import routes from './routes';
import privateRoutes from './privateRoutes';

export default function initRoutes(addess) {
  if (addess) {
    return [...privateRoutes].map(({ path, component: Component }) => (
      <Route key={path} path={path} element={<Component />} />
    ));
  }
  return routes.map(({ path, component: Component }) => (
    <Route key={path} path={path} element={<Component />} />
  ));
}
