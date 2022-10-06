import { BigNumber, ethers } from 'ethers';

const MAX_UINT256 =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

export const validationAgreementModel = (value, setError) => {
  if (value?.length > 0) {
    setError(null);
  } else {
    setError('This field lander is required');
  }
};

export default function getRule(label: string, name: string, v?: string, type?: string) {
  const defaultRule = {
    required: true,
    message: 'This field is required',
  };

  const validateId = () => {
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
        if (BigNumber.from(v).gt(MAX_UINT256)) {
          return Promise.reject(new Error('Invalid number'));
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

  const simbols = /^[A-Za-z0-9_.]+$/;
  const ruAlfabet = /^[а-яА-ЯёЁ]+$/;

  const validateField = () => {
    const fixValue = v?.replace(/,/gi, '');
    return {
      validator: () => {
        if (!v) return Promise.resolve();
        if (BigNumber.from(fixValue).gt(MAX_UINT256))
          return Promise.reject(new Error('Invalid number'));
        if (parseInt(fixValue, 10) < 1) {
          return Promise.reject(new Error('Invalid number'));
        }
        if (simbols.test(v)) return Promise.resolve();
        return Promise.reject(new Error('This field is required'));
      },
    };
  };

  const validateFieldCondition = () => {
    return {
      validator: () => {
        if (!v) return Promise.resolve();
        if (!ruAlfabet.test(v)) return Promise.resolve();
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
        if (v !== '0x0000000000000000000000000000000000000000') return Promise.resolve();
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

  switch (name) {
    case 'requestorLabel':
      return [validateMinMax(0, 20), validateSpace];
    case 'lander':
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
      return [validateId];
    case 'requiredRecords':
      return [validateId];
    case 'record-value-in-wei':
      return [validateId];
    case 'rd-value':
      return [];
    default:
      return [defaultRule];
  }
}
