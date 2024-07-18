import React from 'react';
import Navbar_init from './Navbar_init';
import Footer from './Footer';
import { FaUser } from 'react-icons/fa';

function Profile() {
  return (
    <div>
      <Navbar_init />
      <div className='container-fluid container-banner'>
        <div className='profile-banner'></div>
        <div className='profile-icon'>
          <FaUser size={100} color="white" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
