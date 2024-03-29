/* eslint-disable arrow-body-style */
import { Route } from 'react-router-dom';
import routes from './routes';
import changeNetwork from './changeNetwork';
import privateRoutes from './privateRoutes';

export default function initRoutes(address, network) {
  if (address && !network) {
    return [...changeNetwork].map(({ path, component: Component }) => (
      <Route key={path} path={path} element={<Component />} />
    ));
  }
  if (address) {
    return [...privateRoutes].map(({ path, component: Component }) => (
      <Route key={path} path={path} element={<Component />} />
    ));
  }
  return [...routes].map(({ path, component: Component }) => (
    <Route key={path} path={path} element={<Component />} />
  ));
}
