/* eslint-disable arrow-body-style */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from 'components/header';
import { connectWallet } from '../../utils/helpers';
import { connect, selectSession } from '../../redux/sessionReducer';
import '../home/index.css';
import './index.css';

const ConnectWallet = () => {
  const dispatch = useDispatch();
  const { onboarding } = useSelector(selectSession);

  return (
    <>
    <Header onClick={() => {}}/>
    <div className="connectForm">
      <div className="title">Please Connect your wallet</div>
      <button className="btn" onClick={() => connectWallet(onboarding, dispatch, connect)}>
        Connect Wallet
      </button>
    </div>
    </>
  );
};

export default ConnectWallet;
