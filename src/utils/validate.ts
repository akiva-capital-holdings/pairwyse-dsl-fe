import { BigNumber, ethers } from 'ethers';
import { ruAlphabet, symbols } from './constants';

export const validationAgreementModel = (value, setError) => {
  if (value?.length > 0) {
    setError(null);
  } else {
    setError('This field lender is required');
  }
};

export default function getRule(label: string, name: string, v?: string, type?: string) {
  const defaultRule = {
    required: true,
    message: 'This field is required',
  };

  /**
   * Validates input of type "Record ID" that is required
   */
  const validateRequiredRecordID = () => {
    return {
      validator: () => {
        if (!Number.isInteger(+v)) {
          return Promise.reject(new Error('Invalid number'));
        }
        if (v === null || v === undefined || v === '') {
          return Promise.reject(new Error('This field is required'));
        }
        if (parseInt(v, 10) < 1) {
          return Promise.reject(new Error('Invalid number'));
        }
        if (Number(v) > Number(ethers.constants.MaxUint256)) {
          return Promise.reject(new Error('Too big number'));
        }
        return Promise.resolve();
      },
    };
  };

  /**
   * Validates input of type "Record ID" that is optional (may be undefined)
   */
  const validateOptionalRecordID = () => {
    return {
      validator: () => {
        if (!Number.isInteger(+v)) {
          return Promise.reject(new Error('Invalid number'));
        }
        if (parseInt(v, 10) < 1) {
          return Promise.reject(new Error('Invalid number'));
        }
        if (Number(v) > Number(ethers.constants.MaxUint256)) {
          return Promise.reject(new Error('Too big number'));
        }
        return Promise.resolve();
      },
    };
  };

  const validateMinMax = (min: number, max: number) => {
    return {
      validator: () => {
        if (v?.length < min) {
          return Promise.reject(new Error(`Field ${name} must be less than ${min} symbols`));
        }
        if (v?.length > max) {
          return Promise.reject(new Error(`Field ${name} must be more than  ${max} symbols`));
        }
        return Promise.resolve();
      },
    };
  };

  const validateField = () => {
    const fixValue = v?.replace(/,/gi, '');
    return {
      validator: () => {
        if (!v) return Promise.resolve();
        if (BigNumber.from(fixValue).gt(ethers.constants.MaxUint256))
          return Promise.reject(new Error('Invalid number'));
        if (parseInt(fixValue, 10) < 0) {
          return Promise.reject(new Error('Invalid number'));
        }
        if (symbols.test(v)) return Promise.resolve();
        return Promise.reject(new Error('This field is required'));
      },
    };
  };

  const validateFieldCondition = () => {
    return {
      validator: () => {
        if (!v) return Promise.resolve();
        if (!ruAlphabet.test(v)) return Promise.resolve();
        return Promise.reject(new Error('Invalid format'));
      },
    };
  };

  const validateAddressEth = () => {
    return {
      validator: () => {
        if (!v) return Promise.resolve();
        if (ethers.utils.isAddress(v)) return Promise.resolve();
        return Promise.reject(new Error('Invalid format'));
      },
    };
  };

  const validateAddress = () => {
    return {
      validator: () => {
        if (!v) return Promise.resolve();
        if (v !== ethers.constants.AddressZero) return Promise.resolve();
        return Promise.reject(new Error('Invalid address'));
      },
    };
  };

  const validation = () => {
    return {
      validator: () => {
        if ((v && v?.length === 0) || v?.length === 1) {
          return Promise.reject(new Error('This field is required'));
        }
        return Promise.resolve();
      },
    };
  };

  const validateSpace = () => {
    return {
      validator: () => {
        if (v?.trim() === '' || v === undefined) {
          return Promise.reject(new Error('This field is required'));
        }
        return Promise.resolve();
      },
    };
  };

  const validateDecimalValue = () => {
    return {
      validator: () => {
        if (Number(v) < 0 || Number(v) > 255) {
          return Promise.reject(new Error('Invalid number'));
        }
        return Promise.resolve();
      },
    };
  };

  switch (name) {
    case 'requestorLabel':
      return [validateMinMax(0, 20), validateSpace];
    case 'lender':
      return [validateSpace];
    case 'agreement':
      return [validateAddressEth, validateAddress, validateSpace];
    case 'definition':
      return [validateSpace];
    case 'specification':
      if (type === 'Address') return [validateAddressEth, validateAddress, validateSpace];
      return [validateField, validateSpace];
    case 'condition':
      return [validateFieldCondition, validation, validateSpace];
    case 'signatories':
      return [validateAddressEth, validateAddress, validateSpace];
    case 'record':
      return [validateSpace];
    case 'dsl-id':
      return [validateRequiredRecordID];
    case 'requiredRecords':
      return [validateOptionalRecordID];
    case 'record-value-in-wei':
      return [validateRequiredRecordID];
    case 'approval-value-in-wei':
      return [validateRequiredRecordID];
    case 'decimal-value':
      return [validateRequiredRecordID, validateDecimalValue];
    case 'record-value':
      return [];
    default:
      return [defaultRule];
  }
}
