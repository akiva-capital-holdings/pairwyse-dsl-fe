import MetaMaskOnboarding from '@metamask/onboarding';
import { Contract, ethers } from 'ethers';
// import { useSelector } from 'react-redux';
import _ from 'lodash';
import { AbiItem } from 'web3-utils';
import { abi as agreementABI, bytecode as agreementBytecode } from '../data/agreement.json';
import { abi as contextFactoryABI } from '../data/contextFactory.json';
import allNetworks from './networks.json';


const { ethereum }: any = window;

interface Error {
  code: string | number;
  message: string;
}

const contractNames = {
  Agreement: 'Agreement',
  ContextFactory: 'ContextFactory',
};
type ContractName = keyof typeof contractNames;

// const { chainId } = useSelector(selectUtils);

export const hex4Bytes = (str: string) => {
  return ethers.utils
    .keccak256(ethers.utils.toUtf8Bytes(str))
    .split('')
    .map((x, i) => {
      return i < 10 ? x : '0';
    })
    .join('');
};

export const getContractABI = (name: ContractName): AbiItem[] => {
  switch (name) {
    case contractNames.Agreement:
      return agreementABI as AbiItem[];
    case contractNames.ContextFactory:
      return contextFactoryABI as AbiItem[];
    default:
      return [];
  }
};

export const getContractBytecode = (name: ContractName): string => {
  if (name === contractNames.Agreement) return agreementBytecode;
  return '';
};

export const createInstance = (name: ContractName, address: string, provider): Contract => {
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

  const currentChainId = (await ethereum?.request({ method: 'eth_chainId' }))?.split('x')[1];
  // console.log(chainId.split('x')[1]);
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
      console.log(data);
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
