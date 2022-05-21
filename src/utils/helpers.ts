import MetaMaskOnboarding from '@metamask/onboarding';

const { ethereum }: any = window;

interface Error {
  code: string | number;
  message: string;
}

// export const createInstanceSizzleIto = async (
//   address: string,
//   provider: any,
// ) => {
//   const abi: any = contract;
//   return new provider.eth.Contract(abi, address);
// };

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
  //   if (address && data[0] && address !== data[0]) {
  //     // info(data[0]);
  //     dispatch(connect({ addressToken: data[0] }));
  //   }
  //   if (address && data[0] && address === data[0]) {
  //     dispatch(connect({ addressToken: data[0] }));
  //   }
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
