import React from 'react';
import { useMetaMask } from 'metamask-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/Logo.png';
import './index.css';

const Header = ({ onClick }) => {
  const { account } = useMetaMask();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const reset = (buttonName) => {
    if (buttonName === 'agreement') {
      window.history.pushState('/create-agreement', 'Sample Title', '/create-agreement');
      navigate('/create-agreement');
      if (pathname === '/create-agreement') {
        window.location.reload();
      }
      onClick();
    } else {
      window.history.pushState('/token-Interaction', 'Sample Title', '/token-Interaction');
      navigate('/token-Interaction');
      if (pathname === '/token-Interaction') {
        window.location.reload();
      }
      onClick();
    }
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
        <img src={logo} id="logo" />
      </div>
      {account && (
        <div style={{ display: 'flex' }}>
          <button
            style={{ marginRight: '20px' }}
            onClick={() => {
              return reset('agreement');
            }}
            className="btn"
            type="button"
          >
            Agreement Interaction
          </button>
          <button
            onClick={() => {
              return reset('token');
            }}
            className="btn"
            type="button"
          >
            Token Interaction
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
