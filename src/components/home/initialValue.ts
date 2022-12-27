export const initialAgreementValue = {
  lastAgrAddr: '',
  error: false,
  hash: '',
  message: '',
  submit: false,
};

export const initialDefinitionRequestValue = {
  value: '',
  submit: false,
  hash: '',
  error: false,
  message: '',
};

export const initialUpdateRequestValue = {
  hash: '',
  submit: false,
  error: false,
  message: '',
};

export const initialExecutionValue = {
  hash: '',
  submit: false,
  error: false,
  message: '',
};

export const initialTokenInfo = {
  name: '',
  symbol: '',
  supply: '',
  address: '',
  error: false,
  message: '',
  submit: true,
};

export const titleValueAgrement = (v) => {
  return v ? 'Created Agreement Address' : 'No records yet';
};

export const titleValueDefinition = (v) => {
  return v ? 'Definition Record ID' : 'No records yet';
};

export const titleValueUpdateRequest = (v) => {
  return v ? 'Update Request Record ID' : 'No records yet';
};

export const titleValueExecute = (v) => {
  return v ? 'Execution Record ID' : 'No records yet';
};

export default {
  initialDefinitionRequestValue,
  initialUpdateRequestValue,
  titleValueUpdateRequest,
  initialAgreementValue,
  initialExecutionValue,
  titleValueDefinition,
  titleValueAgrement,
  titleValueExecute,
};
