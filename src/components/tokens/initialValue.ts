export const initialTokenInfo = {
  name: '',
  symbol: '',
  supply: '',
  address: '',
  error: false,
  message: '',
  submit: false,
};

export const initialTokenApprove = {
  submit: false,
  hash: '',
  error: false,
  message: '',
};

export const initialTokenBalanceOf = {
  value: '',
  submit: false,
  error: false,
  message: '',
};

export const titleValueApprove = (v) => {
  return v ? 'Approval Record ID' : 'No transactions yet';
};

export const titleValueBalanceOf = (v) => {
  return v ? 'Balance' : 'No transactions yet';
};

export default {
  initialTokenApprove,
  initialTokenBalanceOf,
  titleValueApprove,
  titleValueBalanceOf,
};
