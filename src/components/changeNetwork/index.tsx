/* eslint-disable no-console */
import React, { useMemo } from 'react';
import {useSelector} from 'react-redux'
import { NETWORK_OPTIONS } from '../../utils/constants';
import { getNetworksList } from '../../utils/helpers';
import {selectSession} from '../../redux/sessionReducer'
import '../home/index.css';
import './index.css';

const networksList: {} = getNetworksList();
const { ethereum }: any = window;
console.log(NETWORK_OPTIONS[process.env.REACT_APP_NETWORK].chainId);

const handleClick = async () => {
  try {
    if (!ethereum) throw new Error('No crypto wallet found');
   await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: NETWORK_OPTIONS[process.env.REACT_APP_NETWORK].chainId,
        },
      ],
    });
    
  } catch (err: any) {
    if (err?.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...NETWORK_OPTIONS[process.env.REACT_APP_NETWORK],
            },
          ],
        });
      } catch (error: any) {
        console.error(error?.message);
      }
    }
    console.error(err?.message);
  }
};
console.log(ethereum?.networkVersion);

const nameNetwork = () => {return useMemo(() => {
  console.log(ethereum?.networkVersion, networksList[ethereum?.networkVersion]);
  
  return networksList[ethereum?.networkVersion]
}, [ethereum?.networkVersion])}

const ChangeNetwork = () => {
  const {network } = useSelector(selectSession);
  console.log('network', network);
  
  return (
    <div className="changeNetwork">
      <div className="title">You Must Change Network</div>
      <div className="secondaryTitle">
        We've detected that you need to switch your wallet's network from <br />{' '}
        <span className="network">{nameNetwork()}</span> to{' '}
        <span className="network">{process.env.REACT_APP_NETWORK}</span> for this app.
      </div>
      <div className="textInfo">
        Some wallets may not support changing networks. If you cannot change networks in your
        wallet, consider switching to a different wallet.
      </div>
      <button onClick={handleClick} className="btn">
        Change Network
      </button>
    </div>
  );
};

export default ChangeNetwork;
