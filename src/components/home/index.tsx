import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet } from '../../utils/helpers';
import { selectSession, connect } from '../../redux/sessionReducer';
import './index.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { onboarding, address } = useSelector(selectSession);
  return (
    <div className="homePage">
      <div className="connectForm">
        <span className="title">Connect to metamask</span>
        <button className="btn" onClick={() => connectWallet(onboarding, dispatch, connect)}>
          connectWallet
        </button>
        {!!address && <span>{address}</span>}
      </div>
    </div>
  );
};

export default HomePage;
