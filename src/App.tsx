import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HomePage from 'components/home';
import MetaMaskOnboarding from '@metamask/onboarding';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { selectSession, connect, provider, onboarding } from './redux/sessionReducer';
import { fnc, ethereumOff } from './utils/helpers';
import './App.css';

function App() {
  const { onboarding: onboardingStore, provider: providerStore } = useSelector(selectSession);
  const dispatch = useDispatch();

  const setOnboardingRef = async () => {
    if (!onboardingStore) {
      const meta: any = new MetaMaskOnboarding();
      dispatch(onboarding({ meta }));
    }
    if (!providerStore) {
      const p: any = await detectEthereumProvider().catch();
      const web3 = new Web3(p);
      dispatch(provider(web3));
    }
  };

  useEffect(() => {
    fnc(dispatch, connect);
    setOnboardingRef();
    return () => {
      ethereumOff(dispatch, connect);
    };
  }, []);

  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
