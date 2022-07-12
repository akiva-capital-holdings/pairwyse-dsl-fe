import React, { useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MetaMaskOnboarding from '@metamask/onboarding';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Footer from './components/footer';
import { initRoutes } from './router';

import {
  selectSession,
  connect,
  changeNetworkAction,
  changeNetworkName,
} from './redux/sessionReducer';
import { provider, onboarding, selectUtils } from './redux/utilsReducer';
import { fnc, ethereumOff, checkNetwork } from './utils/helpers';
import './styles/antd.css';
import 'antd/dist/antd.css';

function App() {
  const { address, network } = useSelector(selectSession);
  const { onboarding: onboardingStore, provider: providerStore } = useSelector(selectUtils);
  const dispatch = useDispatch();
  const { ethereum }: any = window;

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

  useEffect(() => {
    fnc(dispatch, connect);
    setOnboardingRef();
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      ethereum?.on('chainChanged', () => {
        return checkNetwork(dispatch, changeNetworkAction, changeNetworkName);
      });
    }
    return () => {
      ethereumOff(dispatch, connect);
    };
  }, []);

  useEffect(() => {
    checkNetwork(dispatch, changeNetworkAction, changeNetworkName);
  }, [network]);

  const redirectF = () => {
    if (!network && !address) {
      return '/';
    }
    if (!network && address && process.env.REACT_APP_NETWORK === 'dev') {
      return '/change-network';
    }
    return '/';
  };

  const redirect = <Route path="*" element={<Navigate to={redirectF()} />} />;

  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>Page is loading...</div>}>
          <Routes>
            {initRoutes(address, network)}
            {redirect}
          </Routes>
          <Footer />
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
