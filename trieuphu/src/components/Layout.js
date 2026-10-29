import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => {
  const { pathname } = useLocation();

  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <div key={pathname} className="page">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;