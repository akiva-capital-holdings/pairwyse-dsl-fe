import { useEffect, Suspense } from 'react';
import { provider } from 'web3-core';
import { useSelector, useDispatch } from 'react-redux';
import { useMetaMask } from 'metamask-react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Footer from './components/footer';
import { initRoutes } from './router';
import { selectSession, changeNetworkAction } from './redux/sessionReducer';
import { utilsProvider, selectUtils } from './redux/utilsReducer';
import './styles/antd.css';
import 'antd/dist/antd.css';

function App() {
  const { network } = useSelector(selectSession);
  const { utilsProvider: providerStore } = useSelector(selectUtils);
  const { status, account, chainId } = useMetaMask();
  const dispatch = useDispatch();

  const setOnboardingRef = async () => {
    if (!providerStore || Object.keys(providerStore).length === 0) {
      const p = (await detectEthereumProvider().catch()) as provider;
      const web3 = new Web3(p);
      dispatch(utilsProvider(web3));
    }
  };

  const checkNetwork = async () => {
    const networks = {
      mainnet: 1,
      rinkeby: 4,
      local: 539,
      dev: '7a69',
    };
    const currentChainId = chainId?.split('x')[1];
    if (networks[process.env.REACT_APP_NETWORK] !== Number(currentChainId)) {
      dispatch(changeNetworkAction(false));
      return;
    }
    dispatch(changeNetworkAction(true));
  };

  useEffect(() => {
    setOnboardingRef();
    if (status === 'connected') {
      checkNetwork();
    }
  }, [status]);

  useEffect(() => {
    checkNetwork();
  }, [network]);

  const redirectF = () => {
    if (!network && !account) {
      return '/';
    }
    if (!network && account && process.env.REACT_APP_NETWORK === 'dev') {
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
            {initRoutes(account, network)}
            {redirect}
          </Routes>
          <Footer />
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
