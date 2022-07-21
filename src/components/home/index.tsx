import { useState } from 'react';
import Header from '../header/index';
import { UpdateRequest, DefinitionRequest, AgreementRequest, ExecutionRequest } from './steps';
import { mock, mockSignatories, mockDefinitions } from './mock';

import './index.css';

const navSteps = {
  stepOne: 'stepOne',
  stepTwo: 'stepTwo',
  stepThree: 'stepThree',
  stepFour: 'stepFour',
};

const HomePage = () => {
  const [step, setStep] = useState(navSteps.stepOne);
  // agrement request
  const [value, setValue] = useState(undefined);
  const [lender, setLender] = useState('');
  const [error, setError] = useState(undefined);
  // definition request
  const [definition, setDefinition] = useState('');
  const [specifications, setspecification] = useState(mockDefinitions);
  const [agreementDefinition, setAgreementDefinition] = useState('');
  // update request
  const [conditions, setConditions] = useState(mock);
  const [signatories, setSignatories] = useState(mockSignatories);
  const [agreement, setAgreement] = useState('');
  const [dslId, setDslID] = useState('');
  const [transaction, setTransaction] = useState('');
  // execition // TODO: fix typo
  const [agreementExecition, setAgreementExecition] = useState('');
  const [dslIdExecition, setDslIdExecition] = useState('');
  const [txValueExecution, setTxValueExecution] = useState('');

  const reset = () => {
    setValue(undefined);
    setLender('');
    setError('');
    setDefinition('');
    setspecification(mockDefinitions);
    setAgreementDefinition('');
    setConditions(mock);
    setSignatories(mockSignatories);
    setAgreement('');
    setDslID('');
    setTransaction('');
    setAgreementExecition('');
    setDslIdExecition('');
  };

  const onChangeStep = (v: number) => {
    switch (v) {
      case 1:
        setStep(navSteps.stepOne);
        break;
      case 2:
        setStep(navSteps.stepTwo);
        break;
      case 3:
        setStep(navSteps.stepThree);
        break;
      case 4:
        setStep(navSteps.stepFour);
        break;
      default:
    }
  };

  const steps = {
    stepOne: (
      <AgreementRequest
        setLender={setLender}
        setError={setError}
        setValue={setValue}
        lender={lender}
        error={error}
        value={value}
      />
    ),
    stepTwo: (
      <DefinitionRequest
        setAgreementDefinition={setAgreementDefinition}
        agreementDefinition={agreementDefinition}
        setspecification={setspecification}
        specifications={specifications}
        setDefinition={setDefinition}
        definition={definition}
      />
    ),
    stepThree: (
      <UpdateRequest
        setSignatories={setSignatories}
        setTransaction={setTransaction}
        setConditions={setConditions}
        setAgreement={setAgreement}
        transaction={transaction}
        signatories={signatories}
        conditions={conditions}
        agreement={agreement}
        setDslID={setDslID}
        dslId={dslId}
      />
    ),
    stepFour: (
      <ExecutionRequest
        setAgreement={setAgreementExecition}
        agreement={agreementExecition}
        setDslID={setDslIdExecition} // TODO: fix typo
        dslId={dslIdExecition} // TODO: fix typo
        setTxValue={setTxValueExecution}
        txValue={txValueExecution}
      />
    ),
  };

  return (
    <>
      <Header onClick={reset} />
      <div className="homePage">
        <div className="stepsContentContainer">
          <span className="title">Agreement</span>
          <div className="menu">
            <button onClick={() => {return onChangeStep(1)}} className={'navButton'}>
              <span
                style={{ textAlign: 'left', paddingBottom: '8px' }}
                className={`${step === navSteps.stepOne && 'active'}`}
              >
                {' '}
                Creation
              </span>
            </button>
            <button onClick={() => {return onChangeStep(2)}} 
            className={'navButton'}>
              <span
                style={{ textAlign: 'center', margin: '0 auto', paddingBottom: '8px' }}
                className={`${step === navSteps.stepTwo && 'active'}`}
              >
                Definition
              </span>
            </button>
            <button onClick={() => {return onChangeStep(3)}} className={'navButton'}>
              <span
                style={{ textAlign: 'center', margin: '0 auto', paddingBottom: '8px' }}
                className={`${step === navSteps.stepThree && 'active'}`}
              >
                Update
              </span>
            </button>
            <button onClick={() => {return onChangeStep(4)}} className={'navButton'}>
              <span
                style={{ textAlign: 'right', marginLeft: 'auto', paddingBottom: '8px' }}
                className={`${step === navSteps.stepFour && 'active'}`}
              >
                Execution
              </span>
            </button>
          </div>
          <div>{steps[step]}</div>
        </div>
        <div className="statusContainer">
          <div className="title">Status</div>
          <div className="img" />
          <div className="secondaryTitle">Ready to deploy</div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
