import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ? (
    <li>
      <ProfileButton user={sessionUser} />
    </li>
  ) : (
    <>
      <li className='nav-links'>
        <NavLink className="nav-link" to="/login">Log In</NavLink>
      </li>
      <li className='nav-links'>
        <NavLink className="nav-link" to="/signup">Sign Up</NavLink>
      </li>
    </>
  );

  return (
    <ul className='nav-bar'>
      <li className='nav-links'>
        <NavLink className="nav-link" to="/">Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;