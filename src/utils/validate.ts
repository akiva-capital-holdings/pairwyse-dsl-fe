import { ethers } from 'ethers';

export const validationAgreementModel = (value, setError) => {
  if (value?.length > 0) {
    setError(null);
  } else {
    setError('This field lander is required');
  }
};

export default function getRule(label: string, name: string, v?, provider?) {
  let BN;

  if (provider) {
    BN = provider.utils.BN;
  }

  const defaultRule = {
    required: true,
    message: 'This field is required',
  };

  const validateId = () => {
    return {
      validator: () => {
        if (v === null || v === undefined || v === '') {
          return Promise.reject(new Error('This field is required'));
        }
        if (v < 1) {
          return Promise.reject(new Error('Invalid number'));
        }
        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        if (BN) {
          if (
            new BN(`${v}`) >
            new BN('115792089237316195423570985008687907853269984665640564039457584007913129639935')
          ) {
            return Promise.reject(new Error('Invalid number'));
          }
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
    return {
      validator: () => {
        if (!v) return Promise.resolve();
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
      return [validateField, validateMinMax(0, 42), validateSpace];
    case 'condition':
      return [validateFieldCondition, validation, validateSpace];
    case 'signatories':
      return [validateAddressEth, validateAddress, validateSpace];
    case 'transaction':
      return [validateSpace];
    case 'dsl-id':
      return [validateId];
    case 'tx-value':
      return [];
    default:
      return [defaultRule];
  }
}
