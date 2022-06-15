export default function getRule(label: string, name: string, v?: any) {
    const defaultRule = {
      required: true,
      message: `This field ${label.toLowerCase()} is required`,
    };

    const validateMinMax = (min: number, max: number) => {return {
      validator: (_: any, value: string) => {
        if (value?.length < min) {
          return Promise.reject(
            new Error(`Field ${name} must be more than ${min} symbols`),
          );
        }
        if (value?.length > max) {
          return Promise.reject(
            new Error(`Field ${name} must be more than  ${max} symbols`),
          );
        }
        return Promise.resolve();
      },
    }}


  const simbols = /^[A-Za-z0-9_.]+$/
  const simbol = /^[A-Za-z0-9()=!<>+* _.]+$/


  const validateSimbols = () => {return {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve();
      if(simbol.test(value)) return Promise.resolve();
      return Promise.reject(new Error(`This field ${label.toLowerCase()} is required`),);
    },
  }};

  const validateField = () => {return {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve();
      if (simbols.test(value)) return Promise.resolve();
      return Promise.reject(new Error(`This field ${label.toLowerCase()} is required`),);
    },
  }};

    const validationAgreementModel = () => {return {
      validator: () => {
        if (v && v?.length === 0 || v?.length ===  1) {
          return Promise.reject(
            new Error(`This field ${label.toLowerCase()} is required`),
          );
        }

        return Promise.resolve();
      },
    }}

    switch (name) {
      case 'requestorLabel':
        return [defaultRule, validateMinMax(0, 20)];
      case 'agreementModel':
        return [validationAgreementModel()];
      case 'definition':
        return [defaultRule, validateField(), validateMinMax(0, 20)];
      case 'spetification':
        return [defaultRule, validateField(), validateMinMax(0, 20)];
      case 'condition':
        return [defaultRule, validateSimbols()];
      default:
        return [defaultRule];
    }
  }