export interface MetaMaskError {
  code: string | number;
  message: string;
}
export interface BalanceOf {}

export interface MockType {
  date: string;
  recordID: string;
  agreementAddress: string;
  recordOriginator: string;
  recordType: string;
  recordStatus: string;
}

export interface ISession {
  network: boolean;
  agreementAddress: string;
}

export interface Utils {
  utilsProvider: object;
}

export interface Agreement {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLender: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<string>;
  setValue: React.Dispatch<string>;
  loading: boolean;
  lender: string;
  error: string;
  value: string;
  setValueAgreementRequest: React.Dispatch<
    React.SetStateAction<{
      lastAgrAddr: string;
      error: boolean;
      hash: string;
      message: string;
      submit: boolean;
    }>
  >;
  setValueMultiTrancheRequest: React.Dispatch<
    React.SetStateAction<{
      multiTrancheAddr: string;
      error: boolean;
      message: string;
      submit: boolean;
    }>
  >;
  multiTrancheAgreement: string;
  setTokenInfo: React.Dispatch<
    React.SetStateAction<{
      name: string;
      symbol: string;
      supply: string;
      address: string;
      error: boolean;
      message: string;
      submit: boolean;
    }>
  >;
  agreementCreator: boolean;
  setAgreementCreator: React.Dispatch<React.SetStateAction<boolean>>;
  multiTrancheCreator: boolean;
  setMultiTrancheCreator: React.Dispatch<React.SetStateAction<boolean>>;
  tokenCreator: boolean;
  setTokenCreator: React.Dispatch<React.SetStateAction<boolean>>;
  setMultiTrancheAgreement: React.Dispatch<React.SetStateAction<string>>;
}

export interface Token {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<string>;
  error: string;
  loading: boolean;
  setTokenInfo: React.Dispatch<
    React.SetStateAction<{
      name: string;
      symbol: string;
      supply: string;
      address: string;
      error: boolean;
      message: string;
      submit: boolean;
    }>
  >;
}

export interface TokenApproval {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  loading: boolean;
  tokenInfo: {
    name: string;
    symbol: string;
    supply: string;
    address: string;
    error: boolean;
    message: string;
    submit: boolean;
  };
  setApprovalValue: React.Dispatch<
    React.SetStateAction<{
      submit: boolean;
      hash: string;
      error: boolean;
      message: string;
    }>
  >;
}

export interface TokenAllowance {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  loading: boolean;
  tokenInfo: {
    name: string;
    symbol: string;
    supply: string;
    address: string;
    error: boolean;
    message: string;
    submit: boolean;
  };
  setAllowanceValue: React.Dispatch<
    React.SetStateAction<{
      value: string;
      submit: boolean;
      error: boolean;
      message: string;
    }>
  >;
}

export interface TokenBalanceOf {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  loading: boolean;
  tokenInfo: {
    name: string;
    symbol: string;
    supply: string;
    address: string;
    error: boolean;
    message: string;
    submit: boolean;
  };
  setbalanceOfValue: React.Dispatch<
    React.SetStateAction<{
      value: string;
      submit: boolean;
      error: boolean;
      message: string;
    }>
  >;
}

export interface TransactionValues {
  fromName: string;
  fromAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  toName: string;
  toAddress: string;
  targetAllowance: string;
  currentAllowance: string;
  error: boolean;
}

export interface Definition {
  setAgreementDefinition: React.Dispatch<React.SetStateAction<string>>;
  agreementDefinition: string;
  setValueDefinitionRequest: React.Dispatch<
    React.SetStateAction<{
      value: string;
      submit: boolean;
      hash: string;
      error: boolean;
      message: string;
    }>
  >;
  setspecification: React.Dispatch<
    React.SetStateAction<
      {
        title: string;
        value: string;
        id: number;
        type: string;
      }[]
    >
  >;
  specifications: {
    title: string;
    value: string;
    id: number;
    type: string;
  }[];
  setDefinition: React.Dispatch<React.SetStateAction<string>>;
  definition: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export interface Execution {
  setExecutionValue: React.Dispatch<
    React.SetStateAction<{
      hash: string;
      submit: boolean;
      error: boolean;
      message: string;
    }>
  >;
  setAgreement: React.Dispatch<React.SetStateAction<string>>;
  setRecordValue: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  agreementExecution: string;
  setDslID: React.Dispatch<React.SetStateAction<string>>;
  rdValue: string;
  loading: boolean;
  dslId: string;
}

export interface Update {
  setUpdateRequest: React.Dispatch<
    React.SetStateAction<{
      hash: string;
      submit: boolean;
      error: boolean;
      message: string;
    }>
  >;
  setSignatories: React.Dispatch<
    React.SetStateAction<
      {
        title: string;
        value: string;
        id: number;
      }[]
    >
  >;
  setRecord: React.Dispatch<React.SetStateAction<string>>;
  setConditions: React.Dispatch<
    React.SetStateAction<
      {
        title: string;
        value: string;
        id: number;
      }[]
    >
  >;
  setAgreement: React.Dispatch<React.SetStateAction<string>>;
  record: string;
  signatories: {
    title: string;
    value: string;
    id: number;
  }[];
  conditions: {
    title: string;
    value: string;
    id: number;
  }[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  agreement: string;
  setDslID: React.Dispatch<React.SetStateAction<string>>;
  numbers: number[];
  loading: boolean;
  dslId: string;
}
