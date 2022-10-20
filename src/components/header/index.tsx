import React from 'react';
import { useMetaMask } from 'metamask-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

const Header = ({ onClick }) => {
  const { account } = useMetaMask();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const reset = () => {
    window.history.pushState('/create-agreement', 'Sample Title', '/create-agreement');
    navigate('/create-agreement');
    if (pathname === '/create-agreement') {
      window.location.reload();
    }
    onClick();
  };

  return (
    <div className="headerContainer">
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => {
          return navigate('/');
        }}
        className="logo"
      >
        Logo
      </div>
      {account && (
        <button
          onClick={() => {
            return reset();
          }}
          className="btn"
          type="button"
        >
          Agreement Interaction
        </button>
      )}
    </div>
  );
};

export default Header;
