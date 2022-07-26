import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectSession } from '../../redux/sessionReducer';
import './index.css';

const Header = ({ onClick }) => {
  const { address } = useSelector(selectSession);
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
      {address && (
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
