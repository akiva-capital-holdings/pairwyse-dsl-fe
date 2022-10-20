export interface MetaMaskError {
  code: string | number;
  message: string;
}

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
