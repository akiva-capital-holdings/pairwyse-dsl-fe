import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MetaMaskProvider } from 'metamask-react';
import { PersistGate } from 'reduxjs-toolkit-persist/lib/integration/react';
import App from './App';
import { store, persistor } from './redux/store';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MetaMaskProvider>
          <App />
        </MetaMaskProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
