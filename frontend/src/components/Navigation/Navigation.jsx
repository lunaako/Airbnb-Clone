import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import navLogo from '../../images/nav-logo.jpg';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const isSessionUser = sessionUser!== null;
  const navigate = useNavigate();

  return (
    <>
      <ul>
        <li className='nav-link'>
          <NavLink to="/" className='home-link'>
            <img src={navLogo} alt='site logo' className='site-logo' />
            <span>WoofBnB</span>
          </NavLink>
        </li>

        {isSessionUser &&(
            <li>
              <button
                className='navbar-create-spot'
                onClick={() => navigate('/spots/new')}
              >
                Create a New Spot
              </button>
            </li>
          )}


        {isLoaded && (
          <li className='nav-link'>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
      <div className='nav-bar-divider'></div>
    </>

  );
}

export default Navigation;