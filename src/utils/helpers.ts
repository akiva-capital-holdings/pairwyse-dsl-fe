import { Contract, ethers } from 'ethers';
import _ from 'lodash';
import { AbiItem } from 'web3-utils';
import { MetaMaskError } from '../types';
import { abi as agreementABI, bytecode as agreementBytecode } from '../data/agreement.json';
import { abi as contextFactoryABI } from '../data/contextFactory.json';
import { abi as tokenABI, bytecode as tokenBytecode } from '../data/token.json';
import {
  abi as multiTrancheABI,
  bytecode as multiTrancheBytecode,
} from '../data/multiTranche.json';
import allNetworks from './networks.json';

const contractNames = {
  Agreement: 'Agreement',
  ContextFactory: 'ContextFactory',
  Token: 'Token',
  MultiTranche: 'MultiTranche',
};
type ContractName = keyof typeof contractNames;

// Convert string of record to array of string
export const splitDSLString = (expr: string) =>
  expr
    .replaceAll('(', '@(@')
    .replaceAll(')', '@)@')
    .split(/[@ \n]/g)
    .filter((x: string) => !!x);

export const hex4Bytes = (str: string) => {
  return ethers.utils
    .keccak256(ethers.utils.toUtf8Bytes(str))
    .split('')
    .map((x, i) => {
      return i < 10 ? x : '0';
    })
    .join('');
};

// string decimal number with e symbol (1e18) to string of numbers (in wei)
export const getWei = (amount: string, setErrorRequiredRecords) => {
  let normalAmount: string;
  try {
    normalAmount = Number(amount).toLocaleString('fullwide', { useGrouping: false });
  } catch (e) {
    console.error({ e });
    setErrorRequiredRecords(true);
  }
  return normalAmount;
};

export const getContractABI = (name: ContractName): AbiItem[] => {
  switch (name) {
    case contractNames.Agreement:
      return agreementABI as AbiItem[];
    case contractNames.ContextFactory:
      return contextFactoryABI as AbiItem[];
    case contractNames.Token:
      return tokenABI as AbiItem[];
    case contractNames.MultiTranche:
      return multiTrancheABI as AbiItem[];
    default:
      return [];
  }
};

export const getContractBytecode = (name: ContractName): string => {
  switch (name) {
    case contractNames.Agreement:
      return agreementBytecode;
    case contractNames.Token:
      return tokenBytecode;
    case contractNames.MultiTranche:
      return multiTrancheBytecode;
    default:
      return '';
  }
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

/**
 * @dev Get ERC20 token symbol and decimals
 * @param token ERC20 token instance
 * @return Object that contains token symbol and token decimals
 */
export const getTokenDetails = async (token: Contract) => {
  const tokenSymbol = await token.methods.symbol().call();
  const tokenDecimals = await token.methods.decimals().call();
  return { tokenSymbol, tokenDecimals };
};
