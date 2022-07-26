import MetaMaskOnboarding from '@metamask/onboarding';
import { Contract, ethers } from 'ethers';
import _ from 'lodash';
import agreementABI from '../data/contract-abi/agreement.json';
import agreementFactoryABI from '../data/contract-abi/agreementFactory.json';
import conditionalTxsABI from '../data/contract-abi/conditionalTxs.json';
import contextFactoryABI from '../data/contract-abi/contextFactory.json';
import allNetworks from './networks.json';

const { ethereum }: any = window;

interface Error {
  code: string | number;
  message: string;
}

const contractNames = {
  Agreement: 'Agreement',
  AgreementFactory: 'AgreementFactory',
  ConditionalTxs: 'ConditionalTxs',
  ContextFactory: 'ContextFactory',
};
type ContractName = keyof typeof contractNames;

export const hex4Bytes = (str: string) => {
  return ethers.utils
    .keccak256(ethers.utils.toUtf8Bytes(str))
    .split('')
    .map((x, i) => {
      return i < 10 ? x : '0';
    })
    .join('');
};

const getContractABI = (name: ContractName): string => {
  switch (name) {
    case contractNames.Agreement:
      return agreementABI as unknown as string;
    case contractNames.AgreementFactory:
      return agreementFactoryABI as unknown as string;
    case contractNames.ConditionalTxs:
      return conditionalTxsABI as unknown as string;
    case contractNames.ContextFactory:
      return contextFactoryABI as unknown as string;
    default:
      return '';
  }
};

export const createInstance = async (
  name: ContractName,
  address: string,
  provider
): Promise<Contract> => {
  const abi = getContractABI(name);
  return new provider.eth.Contract(abi, address);
};

export const checkNetwork = async (dispatch, checkNetworkAction, changeNetworkName) => {
  const networks = {
    mainnet: 1,
    rinkeby: 4,
    local: 539,
    dev: '7a69',
  };
  // @ts-ignore

  const currentChainId  = (await ethereum?.request({method: 'eth_chainId'}))?.split('x')[1]
  if (networks[process.env.REACT_APP_NETWORK] !== currentChainId) {
    dispatch(changeNetworkName(currentChainId));
    dispatch(checkNetworkAction(false));
    return;
  }
  dispatch(changeNetworkName(currentChainId));
  dispatch(checkNetworkAction(true));
};

export const shortenedAddress = (address: string, size = 4) => {
  if (address && size !== 0) {
    if (size && size > 0 && size <= 19) {
      return `${_.slice(address, 0, size).join('')}...${_.slice(address, -size).join('')}`;
    }
    return address;
  }
  return address;
};

export const handleError = ({ code, message }: Error) => {
  if (code === 4001 || code === -32603) {
    // EIP-1193 userRejectedRequest error
    // If this happens, the user rejected the connection request.
    console.error(message);
  }
};

export const setToken = (data, dispatch, connect) => {
  if (data?.length === 0) {
    dispatch(connect(''));
  }
  if (data[0]) {
    dispatch(connect(data[0]));
  }
};

export const connectWallet = (onboarding, dispatch, connect) => {
  if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((data) => {
        return setToken(data, dispatch, connect);
      })
      .catch(handleError);
  } else {
    onboarding.startOnboarding();
  }
};

export const sign = async (from: string, provider: any) => {
  const method = 'personal_sign';
  const currProvider: any = provider.currentProvider;
  const signature = await currProvider.send(
    { method, params: [process.env.REACT_APP_SIGN_MESSAGE, from], from },
    async (err: any, result: any) => {
      if (err || result.error) {
        console.error('Error');
      }
      return result.result;
    }
  );
  return signature;
};

export const fnc = (dispatch, connect) => {
  ethereum?.on('accountsChanged', (data) => {
    return setToken(data, dispatch, connect);
  });
};

export const ethereumOff = (dispatch, connect) => {
  if (ethereum?.off) {
    ethereum?.off('accountsChanged', (data) => {
      return setToken(data, dispatch, connect);
    });
  }
};
export const getNetworksList = () => {
  let networksList = {};
  allNetworks.forEach((item) => {
    networksList = { ...networksList, [item.chainId]: item.name };
  });

  return networksList;
};
