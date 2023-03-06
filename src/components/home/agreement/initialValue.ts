export const initialAgreementValue = {
  lastAgrAddr: '',
  error: false,
  hash: '',
  message: '',
  submit: false,
};

export const initialMultiTrancheValue = {
  multiTrancheAddr: '',
  error: false,
  message: '',
  submit: false,
};

export const initialVariableDefinitionValue = {
  value: '',
  submit: false,
  hash: '',
  error: false,
  message: '',
};

export const initialRecordCreationValue = {
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
  submit: false,
};

export const titleValueAgrement = (v, createdName: string) => {
  return v ? `Created ${createdName} Address` : 'No transactions yet';
};

export const titleValueDefinition = (v) => {
  return v ? 'Definition Record ID' : 'No transactions yet';
};

export const titleValueRecordCreation = (v) => {
  return v ? 'Update Request Record ID' : 'No transactions yet';
};

export const titleValueExecute = (v) => {
  return v ? 'Execution Record ID' : 'No transactions yet';
};

export default {
  initialVariableDefinitionValue,
  initialRecordCreationValue,
  titleValueRecordCreation,
  initialAgreementValue,
  initialExecutionValue,
  titleValueDefinition,
  titleValueAgrement,
  titleValueExecute,
};
