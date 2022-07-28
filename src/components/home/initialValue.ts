export const initialAgreementValue = {
    lastAgrAddr: '',
    error: false,
    hash: '',
    message: '',
    submit: false,
  }

  export const initialDefinitionRequestValue = {
    value: '',
    submit: false,
    transactionHash: '',
    error: false,
    message: '',
  }

  export const initialUpdateRequestValue = {
    hash: '',
    submit: false,
    error: false,
    message: '',
  }

  export const initialExecitionValue = {
    hash: '',
    submit: false,
    error: false,
    message: '',
  }

  export const titleValueAgrement = (v) => {
    return v ? 'Created Agreement Address' : 'No transactions yet';
  };
  
  export const titleValueDefinition = (v) => {
    return v ? 'Definition Transaction ID' : 'No transactions yet';
  };

  export const titleValueUpdateRequest = (v) => {
    return v ? 'Update Request Transaction ID' : 'No transactions yet';
  };

  export const titleValueExecute = (v) => {
    return v ? 'Execution Transaction ID' : 'No transactions yet';
  };

  export default   {
      initialDefinitionRequestValue,
      initialUpdateRequestValue,
      titleValueUpdateRequest,
      initialAgreementValue,
      initialExecitionValue,
      titleValueDefinition,
      titleValueAgrement,
      titleValueExecute
  }