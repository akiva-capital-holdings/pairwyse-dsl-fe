import { useMemo } from 'react';
import { useMetaMask } from 'metamask-react';
import { MetaMaskError } from '../../types';
import { NETWORK_OPTIONS } from '../../utils/constants';
import { getNetworksList } from '../../utils/helpers';

import '../home/index.css';
import './index.css';

const ChangeNetwork = () => {
  const { ethereum } = useMetaMask();
  const networksList: {} = getNetworksList();

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
    } catch (err) {
      const { code } = err as MetaMaskError;
      if (code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                ...NETWORK_OPTIONS[process.env.REACT_APP_NETWORK],
              },
            ],
          });
        } catch (error) {
          const { message } = error as Error;
          console.error(message);
        }
      }
      console.error(err?.message);
    }
  };

  const nameNetwork = () => {
    return useMemo(() => {
      return networksList[ethereum?.networkVersion];
    }, [ethereum?.networkVersion]);
  };

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
