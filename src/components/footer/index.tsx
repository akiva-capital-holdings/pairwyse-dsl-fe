import React from 'react';
import './index.css';

const Footer = () => {
  return (
    <div className="footerContainer">
      <div className="logoContainer">
        <div className="logo">Logo</div>
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
          <div className="text">Phone: 123-123-123</div>
          <div className="text">Email: aciva@gmail.com</div>
        </div>
        <div className="social">
          <div className="title">Social</div>
          <div className="iconContainer">
            <div className="icon instagram" />
            <div className="icon facebook" />
            <div className="icon youtube" />
            <div className="icon twitter" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
