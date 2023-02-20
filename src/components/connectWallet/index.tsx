import React from 'react';
import Header from 'components/header';
import { useMetaMask } from 'metamask-react';
import '../home/agreement/index.css';
import './index.css';

const ConnectWallet = () => {
  const { connect } = useMetaMask();

  return (
    <>
      <Header onClick={() => {}} />
      <div className="connectForm">
        <div className="title">Please Connect your wallet</div>
        <button className="btn" onClick={connect}>
          Connect Wallet
        </button>
      </div>
    </>
  );
};

export default ConnectWallet;
