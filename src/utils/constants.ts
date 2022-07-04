/* eslint-disable import/prefer-default-export */
export const NETWORK_OPTIONS = {
  mainnet: {
    chainId: `0x${Number(1).toString(16)}`,
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://api.mycryptoapi.com/eth', 'https://cloudflare-eth.com'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  rinkeby: {
    chainId: `0x${Number(4).toString(16)}`,
    chainName: 'Ethereum Testnet Rinkeby',
    nativeCurrency: {
      name: 'Rinkeby Ether',
      symbol: 'RIN',
      decimals: 18,
    },
    rpcUrls: ['https://blockexplorer.rinkeby.boba.network/api/eth-rpc'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
  },
  local: {
    chainId: `0x${Number()}`,
    chainName: 'castom',
    nativeCurrency: { 
      name: 'castom',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['http://127.0.0.1:7545'],
  },
};
