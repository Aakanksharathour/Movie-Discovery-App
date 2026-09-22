import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">
          Movie Discovery
        </NavLink>

        <nav className="navbar__links" aria-label="Main">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
            end
          >
            Discover
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Search
          </NavLink>
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Wishlist
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
