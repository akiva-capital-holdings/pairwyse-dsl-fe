/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
import React, { useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import HomePage from 'components/home';
import MetaMaskOnboarding from '@metamask/onboarding';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Web3 from 'web3';
import { Modal } from 'antd';
import detectEthereumProvider from '@metamask/detect-provider';
import Header from './components/header';
import Footer from './components/footer';
import { initRoutes } from './router';
import { NETWORK_OPTIONS } from './utils/constants';
import { selectSession, connect } from './redux/sessionReducer';
import { provider, onboarding, selectUtils } from './redux/utilsReducer';
import { fnc, ethereumOff, getNetworksList } from './utils/helpers';
import './styles/antd.css';
import 'antd/dist/antd.css';

function App() {
  const { address } = useSelector(selectSession);
  const { onboarding: onboardingStore, provider: providerStore } = useSelector(selectUtils);
  console.log(onboardingStore);

  const dispatch = useDispatch();

  const { ethereum }: any = window;
  const networksList: any = getNetworksList();

  const setOnboardingRef = async () => {
    if (!onboardingStore || Object.keys(onboardingStore).length === 0) {
      const meta: any = new MetaMaskOnboarding();
      await dispatch(onboarding({ meta }));
    }
    if (!providerStore || Object.keys(providerStore).length === 0) {
      const p: any = await detectEthereumProvider().catch();
      const web3 = new Web3(p);
      await dispatch(provider(web3));
    }
  };
  console.log(providerStore);

  const modalNetwork = () => {
    Modal.info({
      closable: true,
      // @ts-ignore
      onOk: () => {
        return handleClick(process.env.REACT_APP_NETWORK);
      },
      okText: 'Change Network',
      content: (
        <div className="modalInfoCountry">
          <div className="title">You Must Change Network</div>
          <p className="text">
            We’ve detected that you need to switch your wallet’s network from
            <span style={{ color: 'black', fontWeight: '900' }}>
              {networksList[ethereum?.networkVersion]}{' '}
            </span>
            to <span style={{ color: 'black', fontWeight: '900' }}>Rinkeby</span> for this App
            <br />
            <br />
            *Some wallets may not support changing networks. If you can not change networks in your
            wallet you may consider switching to a different wallet.
          </p>
        </div>
      ),
    });
  };

  const checkNetwork = async () => {
    // const networks: any = {
    //   mainnet: 1,
    //   rinkeby: 4,
    // };
    // // @ts-ignore
    // const currentChainId: any = Number((await ethereum?.request({
    //   method: 'eth_chainId',
    // })).split('x')[1]);
    // // @ts-ignore
    // if (networks[process.env.REACT_APP_NETWORK] !== currentChainId) {
    //   modalNetwork();
    // }
  };

  useEffect(() => {
    checkNetwork();
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      // @ts-ignore
      ethereum?.on('chainChanged', () => {
        return checkNetwork();
      });
    }
  }, []);

  const handleClick = async (name: any) => {
    try {
      if (!ethereum) throw new Error('No crypto wallet found');
      // @ts-ignore
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            // @ts-ignore
            chainId: NETWORK_OPTIONS[name].chainId,
          },
        ],
      });
    } catch (err: any) {
      if (err?.code === 4001) {
        modalNetwork();
      }
      if (err?.code === 4902) {
        try {
          // @ts-ignore
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                // @ts-ignore
                ...NETWORK_OPTIONS[name],
              },
            ],
          });
        } catch (error: any) {
          console.error(error?.message);
        }
      }
      // @eslint-ignore
      console.error(err?.message);
    }
  };

  useEffect(() => {
    fnc(dispatch, connect);
    setOnboardingRef();
    return () => {
      ethereumOff(dispatch, connect);
    };
  }, []);

  const redirect = <Route path="*" element={<Navigate to={'/'} />} />;

  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>Page is loading...</div>}>
          <Header />
          <Routes>
            {initRoutes(address)}
            {redirect}
          </Routes>
          <Footer />
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
