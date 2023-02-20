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
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: 'http://127.0.0.1:8545',
    nativeCurrency: {
      name: 'custom',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['http://127.0.0.1:8545'],
  },
  dev: {
    chainId: `0x${Number(1337).toString(16)}`,
    chainName: 'https://192.168.221.1:8545',
    nativeCurrency: {
      name: 'custom',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://192.168.221.1:8545'],
  },
  goerli: {
    chainId: `0x${Number(5).toString(16)}`,
    chainName: 'Ethereum Testnet Goerli',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'GoerliETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli.infura.io/v3/'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
};

export const contractNames = {
  Agreement: 'Agreement',
  ContextFactory: 'ContextFactory',
  ERC20PremintDecimals: 'ERC20PremintDecimals',
  MultiTranche: 'MultiTranche',
};

export default { NETWORK_OPTIONS, contractNames };
