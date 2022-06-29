import { ethers } from 'ethers';

export default function getRule(label: string, name: string, v?) {
  const defaultRule = {
    required: true,
    message: `This field ${label.toLowerCase()} is required`,
  };
  const validateMinMax = (min: number, max: number) => {
    return {
      validator: (_: any, value: string) => {
        console.log({ valLen: value?.length });
        if (value?.length < min) {
          return Promise.reject(new Error(`Field ${name} must be less than ${min} symbols`));
        }
        if (value?.length > max) {
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
      validator: (_: any, value: string) => {
        if (!value) return Promise.resolve();
        if (simbols.test(value)) return Promise.resolve();
        return Promise.reject(new Error(`This field ${label.toLowerCase()} is required`));
      },
    };
  };

  const validateFieldCondition = () => {
    return {
      validator: (_: any, value: string) => {
        if (!value) return Promise.resolve();
        if (!ruAlfabet.test(value)) return Promise.resolve();
        return Promise.reject(new Error('Invalid format'));
      },
    };
  };

  const validationAgreementModel = () => {
    return {
      validator: () => {
        if ((v && v?.length === 0) || v?.length === 1) {
          return Promise.reject(new Error(`This field ${label.toLowerCase()} is required`));
        }

        return Promise.resolve();
      },
    };
  };

  const validateAddressEth = () => {
    return {
      validator: (_: any, value: string) => {
        if (!value) return Promise.resolve();
        if (ethers.utils.isAddress(value)) return Promise.resolve();
        return Promise.reject(new Error('Invalid format'));
      },
    };
  };

  const validateAddress = () => {
    return {
      validator: (_: any, value: string) => {
        if (!value) return Promise.resolve();
        if (value !== '0x0000000000000000000000000000000000000000') return Promise.resolve();
        return Promise.reject(new Error('Invalid address'));
      },
    };
  };
  switch (name) {
    case 'requestorLabel':
      return [defaultRule, validateMinMax(0, 20)];
    case 'agreement':
      return [defaultRule, validateAddressEth(), validateAddress()];
    case 'agreement model':
      return [validationAgreementModel()];
    case 'definition':
      return [defaultRule, validateField(), validateMinMax(0, 20)];
    case 'specification':
      return [defaultRule, validateField(), validateMinMax(0, 42)];
    case 'condition':
      return [defaultRule, validateFieldCondition()];
    case 'signatories':
      return [defaultRule, validateAddressEth(), validateAddress()];
    default:
      return [defaultRule];
  }
}
