import { Contract, ethers } from 'ethers';
import _ from 'lodash';
import { AbiItem } from 'web3-utils';
import { MetaMaskError } from '../types';
import { abi as agreementABI, bytecode as agreementBytecode } from '../data/agreement.json';
import { abi as contextFactoryABI } from '../data/contextFactory.json';
import allNetworks from './networks.json';

const contractNames = {
  Agreement: 'Agreement',
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

export const shortenedAddress = (address: string, size = 4) => {
  if (address && size !== 0) {
    if (size && size > 0 && size <= 19) {
      return `${_.slice(address, 0, size).join('')}...${_.slice(address, -size).join('')}`;
    }
    return address;
  }
  return address;
};

export const handleError = ({ code, message }: MetaMaskError) => {
  if (code === 4001 || code === -32603) {
    // EIP-1193 userRejectedRequest error
    // If this happens, the user rejected the connection request.
    console.error(message);
  }
};

export const getNetworksList = () => {
  let networksList = {};
  allNetworks.forEach((item) => {
    networksList = { ...networksList, [item.networkId]: item.name };
  });
  return networksList;
};
