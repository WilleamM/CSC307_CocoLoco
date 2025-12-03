// this will be the header for the rest of the pages

import './Page_Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUserGroup,
  faArrowUp,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Page_Header() {
  const location = useLocation(); //gets the current path
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); //will be for the control of dropdown visibility

  if (location.pathname === '/login') {
    return null; // will return null once it goes to login page so the header won't render
  }
  const goToHome = () => {
    navigate('/'); //this will take the user home once clicked
  };
  const goToFriendsOnly = () => {
    navigate('/friends-only'); // this will take the user to the friends only page
  };
  const goToMakePost = () => {
    navigate('/create-post');
  };
  const goToProfilePage = () => {
    navigate('/profile/:userId'); //this will take the user to their profile page
  };
  const goToSignInPage = () => {
    navigate('/login'); //this will take the user to login page once they click to sign out
  };
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // this will toggle the dropdown menu visibility
  };

  return (
    <header className="front-page-header">
      <div className="left-section">
        <div className="main-logo">
          <img src="/Locobook.png" alt="Logo" />
        </div>
        <div className="search-icon">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search Locobook" />
        </div>
      </div>

      <div className="middle-section">
        <button className="home-icon" onClick={goToHome}>
          <FontAwesomeIcon icon={faHouse} />
        </button>
        <button className="friends-only-icon" onClick={goToFriendsOnly}>
          <FontAwesomeIcon icon={faUserGroup} />
        </button>
      </div>

      <div className="right-section">
        <div className="upload">
          <button onClick={goToMakePost}>
            <div className="up-arrow">
              <FontAwesomeIcon icon={faArrowUp} />
            </div>
            <span className="upload-text">Upload</span>
          </button>
        </div>
        <div className="profile-icon" onClick={toggleDropdown}>
          {/* will toggle the dropdown menu to true once clicked */}
          {/* will add a click on button so that it can go to the profile page */}
          <img src="/profile.png" alt="profile" className="profile-picture" />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                <li>
                  <button onClick={goToProfilePage}>Profile</button>{' '}
                  {/*still got to put it to go to specific user id  */}
                </li>
                <li>
                  <button onClick={goToSignInPage}>Sign Out</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Page_Header;
