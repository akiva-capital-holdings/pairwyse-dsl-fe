import React from 'react';
import './index.css';

const Footer = () => {
  return (
    <div className="footerContainer">
      <div className="logoContainer">
        <div style={{cursor: 'pointer'}} className="logo">Logo</div>
        <div className="text">© 2022 Akiva | All Rights Reserved</div>
      </div>
      <div className="contactContainer">
        <div className="learnMore">
          <div className="title">Learn More</div>
          <div className="text">About</div>
          <div className="text">Jobs</div>
          <div className="text">Privacy Policy</div>
        </div>
        <div className="contactUs">
          <div className="title">Contact Us</div>
          <div className="text">Phone: 123-456-7890</div>
          <div className="text">Email: akiva@mail.com</div>
        </div>
        <div className="social">
          <div className="title">Social</div>
          <div className="iconContainer">
            <div className="icon facebook" />
            <div className="icon instagram" />
            <div className="icon twitter" />
            <div className="icon youtube" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
