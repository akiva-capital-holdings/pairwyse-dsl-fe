import { useEffect, useState } from 'react';
import { useMetaMask } from 'metamask-react';
import { MetaMaskError } from '../../types';
import { NETWORK_OPTIONS } from '../../utils/constants';
import { getNetworksList } from '../../utils/helpers';

import '../home/index.css';
import './index.css';

const ChangeNetwork = () => {
  const { addChain, switchChain, ethereum, chainId } = useMetaMask();
  const networksList: {} = getNetworksList();
  const [nameNetwork, setNameNetwork] = useState<string>('');

  const handleClick = async () => {
    try {
      if (!ethereum) throw new Error('No crypto wallet found');
      await switchChain(NETWORK_OPTIONS[process.env.REACT_APP_NETWORK].chainId);
    } catch (err) {
      const { code } = err as MetaMaskError;
      if (code === 4902) {
        try {
          await addChain({
            ...NETWORK_OPTIONS[process.env.REACT_APP_NETWORK],
          });
        } catch (error) {
          const { message } = error as MetaMaskError;
          console.error(message);
        }
      }
      console.error(err?.message);
    }
  };

  useEffect(() => {
    setNameNetwork(networksList[ethereum?.networkVersion]);
  }, [chainId]);

  return (
    <div className="changeNetwork">
      <div className="title">You Must Change Network</div>
      <div className="secondaryTitle">
        We've detected that you need to switch your wallet's network from <br />{' '}
        <span className="network">{nameNetwork}</span> to{' '}
        <span className="network">{process.env.REACT_APP_NETWORK}</span> for this app.
      </div>
      <div className="textInfo">
        Some wallets may not support changing networks. If you cannot change networks in your
        wallet, consider switching to a different wallet.
      </div>
      <button onClick={() => handleClick()} className="btn">
        Change Network
      </button>
    </div>
  );
};

export default ChangeNetwork;
