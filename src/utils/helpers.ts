/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import MetaMaskOnboarding from '@metamask/onboarding';
import { Contract, ethers } from 'ethers';
// import contractDefinition from ''; @Misha path to contract
// import contractUpdateRequest from ''; @Misha path to contract
import agreementABI from '../data/contract-abi/agreement.json';
import agreementFactoryABI from '../data/contract-abi/agreementFactory.json';
import conditionalTxsABI from '../data/contract-abi/conditionalTxs.json';
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
};
type ContractName = keyof typeof contractNames;

export const hex4Bytes = (str: string) =>
  ethers.utils
    .keccak256(ethers.utils.toUtf8Bytes(str))
    .split('')
    .map((x, i) => (i < 10 ? x : '0'))
    .join('');

const getContractABI = (name: ContractName): string => {
  switch (name) {
    case contractNames.Agreement:
      return agreementABI as unknown as string;
    case contractNames.AgreementFactory:
      return agreementFactoryABI as unknown as string;
    case contractNames.ConditionalTxs:
      return conditionalTxsABI as unknown as string;
    default:
      return '';
  }
};

export const createInstance = async (
  name: ContractName,
  address: string,
  provider: any
): Promise<Contract> => {
  const abi = getContractABI(name);
  return new provider.eth.Contract(abi, address);
};

export const checkNetwork = async (dispatch, checkNetworkAction) => {
  const networks: any = {
    mainnet: 1,
    rinkeby: 4,
  };
  // @ts-ignore
  const currentChainId: any = Number(
    (
      await ethereum?.request({
        method: 'eth_chainId',
      })
    ).split('x')[1]
  );
  // @ts-ignore
  if (networks[process.env.REACT_APP_NETWORK] !== currentChainId) {
    // modalNetwork();
    dispatch(checkNetworkAction(false));
    return;
  }
  dispatch(checkNetworkAction(true));
};
// @Misha instance  for DefinitionRequest
// export const definitionInstance = async (address: string, provider: any) => {
//   const abi: any = contractDefinition
//   return new provider.eth.Contract(abi, address)
// }

// @Misha instance  for UpdateRequest
// export const updateInstance = async (address: string, provider: any) => {
//   const abi: any = contractUpdateRequest
//   return new provider.eth.Contract(abi, address)
// }

export const handleError = ({ code, message }: Error) => {
  if (code === 4001) {
    // EIP-1193 userRejectedRequest error
    // If this happens, the user rejected the connection request.
    console.error(message);
  }
};

export const setToken = (data: any, dispatch: any, connect: any) => {
  if (data?.length === 0) {
    dispatch(connect(''));
  }
  if (data[0]) {
    dispatch(connect(data[0]));
  }
};

export const connectWallet = (onboarding: any, dispatch: any, connect: any) => {
  if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((data: any) => setToken(data, dispatch, connect))
      .catch(handleError);
  } else {
    onboarding.startOnboarding();
  }
};

export const sign = async (from: any, provider: any) => {
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

export const fnc = (dispatch: any, connect: any) => {
  ethereum?.on('accountsChanged', (data: any) => setToken(data, dispatch, connect));
};

export const ethereumOff = (dispatch: any, connect: any) => {
  if (ethereum?.off) {
    ethereum?.off('accountsChanged', (data: any) => setToken(data, dispatch, connect));
  }
};
export const getNetworksList = () => {
  let networksList = {};
  // eslint-disable-next-line array-callback-return
  allNetworks.map((item) => {
    networksList = { ...networksList, [item.chainId]: item.name };
  });

  return networksList;
};
