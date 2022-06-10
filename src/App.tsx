import React, { useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MetaMaskOnboarding from '@metamask/onboarding';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Header from './components/header';
import Footer from './components/footer';
import { initRoutes } from './router';

import { selectSession, connect, changeNetworkAction } from './redux/sessionReducer';
import {provider, onboarding, selectUtils} from './redux/utilsReducer';
import { fnc, ethereumOff, checkNetwork } from './utils/helpers';
import './styles/antd.css'
import 'antd/dist/antd.css';

function App() {
  const { address, network } = useSelector(selectSession);
  const { onboarding: onboardingStore,  provider: providerStore } = useSelector(selectUtils);
  const dispatch = useDispatch();


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
      // @ts-ignore
      ethereum?.on('chainChanged', () => { return checkNetwork(dispatch, changeNetworkAction); });
    }
    return () => {
      ethereumOff(dispatch, connect);
    };
  }, []);

  useEffect(() => {
    checkNetwork(dispatch, changeNetworkAction)
  }, [network]);

const redirectF = () => {
  // if(!network && !address) {
  //   return '/'
  // }
  // if(!network && address) {
  //   return '/change-network'
  // }
  return '/'
}

const redirect = <Route path="*" element={<Navigate to={redirectF()} />} />;
console.log(redirect);
console.log(initRoutes(address));

  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>Page is loading...</div>}>
            <Header/>
            <Routes>
              {initRoutes(address)}
              {redirect}
            </Routes>
            <Footer/>
        </Suspense>
       </Router>
    </div>
  );
}

export default App;
