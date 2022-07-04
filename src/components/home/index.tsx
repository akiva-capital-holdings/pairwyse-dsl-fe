/* eslint-disable arrow-body-style */
import { useState } from 'react';

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
  // execition
  const [agreementExecition, setAgreementExecition] = useState('');
  const [dslIdExecition, setDslIdExecition] = useState('');

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
        setDslID={setDslIdExecition}
        dslId={dslIdExecition}
      />
    ),
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [increment, setIncrement] = useState();
  // const [xValue, setXValue] = useState();
  // const [incrementNumber, setIncrementNumber] = useState<any>();

  // const getX = async () => {
  //   const membershipInstance: any = await createInstance(
  //     '0x5B46AEE383c01BCD4cD2177F93Ebb3d2Cc02fA31',
  //     provider,
  //   );
  //   const x = await membershipInstance?.methods?.x()?.call()
  //   setXValue(x);
  // }

  // const conectContract = async () => {
  //   const membershipInstance: any = await createInstance(
  //     '0x5B46AEE383c01BCD4cD2177F93Ebb3d2Cc02fA31',
  //     provider,
  //   );
  //   const incrementBy = await membershipInstance?.methods
  //   ?.incrementBy(`${incrementNumber}`).call()
  //   console.log({incrementBy});
  //   // setIncrement(incrementBy)
  // }

  return (
    <>
      <div className="homePage">
        <div className="stepsContentContainer">
          <span className="title">Agreement</span>
          <div className="menu">
            <button
              onClick={() => onChangeStep(1)}
              className={`navButton ${step === navSteps.stepOne && 'active'}`}
            >
              Creation
            </button>
            <button
              onClick={() => onChangeStep(2)}
              className={`navButton ${step === navSteps.stepTwo && 'active'}`}
            >
              Definition
            </button>
            <button
              onClick={() => onChangeStep(3)}
              className={`navButton ${step === navSteps.stepThree && 'active'}`}
            >
              Update
            </button>
            <button
              onClick={() => onChangeStep(4)}
              className={`navButton ${step === navSteps.stepFour && 'active'}`}
            >
              Execution
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
