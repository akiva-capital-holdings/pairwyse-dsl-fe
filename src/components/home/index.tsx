/* eslint-disable arrow-body-style */
import { useState } from 'react';

import { UpdateRequest, DefinitionRequest, AgreementRequest } from './steps';

import './index.css';

const steps = {
  stepOne: <AgreementRequest />,
  stepTwo: <DefinitionRequest />,
  stepThree: <UpdateRequest />,
};

const navSteps = {
  stepOne: 'stepOne',
  stepTwo: 'stepTwo',
  stepThree: 'stepThree',
};

const HomePage = () => {
  const [step, setStep] = useState(navSteps.stepOne);

  const onChangeStep = (value: number) => {
    switch (value) {
      case 1:
        setStep(navSteps.stepOne);
        break;
      case 2:
        setStep(navSteps.stepTwo);
        break;
      case 3:
        setStep(navSteps.stepThree);
        break;
      default:
    }
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
          <span className="title">Create Agreement</span>
          <div className="menu">
            <button
              onClick={() => onChangeStep(1)}
              className={`navButton ${step === navSteps.stepOne && 'active'}`}
            >
              Agreement Request
            </button>
            <button
              onClick={() => onChangeStep(2)}
              className={`navButton ${step === navSteps.stepTwo && 'active'}`}
            >
              Definition Request
            </button>
            <button
              onClick={() => onChangeStep(3)}
              className={`navButton ${step === navSteps.stepThree && 'active'}`}
            >
              Update Request
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
