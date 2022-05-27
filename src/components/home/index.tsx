import { useState } from 'react';
import {Button} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {UpdateRequest, DefinitionRequest, AgreementRequest} from './steps';
import {createInstance,  connectWallet } from '../../utils/helpers';
import { selectSession, connect } from '../../redux/sessionReducer';
import './index.css';

const steps = {
  stepOne: <AgreementRequest/>,
  stepTwo: <DefinitionRequest/>,
  stepThree: <UpdateRequest/>
}

const navSteps = {
  stepOne: 'stepOne',
  stepTwo: 'stepTwo',
  stepThree: 'stepThree',
};


const HomePage = () => {
  const [step, setStep] = useState(navSteps.stepOne);
  const dispatch = useDispatch();
  const { onboarding, address, provider } = useSelector(selectSession);
  const [connectContent, setConectContent] = useState(false);

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
  const [xValue, setXValue] = useState();
  const [incrementNumber, setIncrementNumber] = useState<any>();

  const getX = async () => {
    const membershipInstance: any = await createInstance(
      '0x5B46AEE383c01BCD4cD2177F93Ebb3d2Cc02fA31',
      provider,
    );
    const x = await membershipInstance?.methods?.x()?.call()
    setXValue(x);
  }

  const conectContract = async () => {
    const membershipInstance: any = await createInstance(
      '0x5B46AEE383c01BCD4cD2177F93Ebb3d2Cc02fA31',
      provider,
    );
    const incrementBy = await membershipInstance?.methods
    ?.incrementBy(`${incrementNumber}`).call()
    console.log({incrementBy});
    // setIncrement(incrementBy)
  }

  return (
    <>
    <Button 
      style={{marginLeft: 'auto', width: '100%'}}
      onClick={() => setConectContent(!connectContent)} 
      className='connectMetamask'
      htmlType='button'>Connect Metamask
    </Button>
    <div className="homePage">
    { connectContent ?
     <>
     <div className='stepsContentContainer'>
      <span className='title'>Create Agreement</span>
        <div className='menu'>
          <button 
            onClick={() => onChangeStep(1)} 
            className={`navButton ${step === navSteps.stepOne && 'active'}`}
          >Agreement Request</button>
          <button onClick={() => onChangeStep(2)} 
            className={`navButton ${step === navSteps.stepTwo && 'active'}`}
          >Definition Request</button>
          <button 
            onClick={() => onChangeStep(3)} 
            className={`navButton ${step === navSteps.stepThree && 'active'}`}
          >Update Request</button>
        </div>
        <div>{steps[step]}</div>
     </div>
     <div className='statusContainer'>
       <div className='title'>Status</div>
       <div className='img'/>
       <div className='secondaryTitle'>Ready to deploy</div>
     </div>
     </>
     :
      <div className="connectForm">
        <span className="title">Connect to metamask</span>
          {!address ? 
          <button className="btn" onClick={() => connectWallet(onboarding, dispatch, connect)}>
              connectWallet
          </button>
          : <div className='secondary'> Address: {address}</div>
          }
          <div style={{
            marginRight: 'auto', 
            marginBottom: '30px', 
            marginTop: '30px',
            display: 'flex',
            alignItems: 'center'
            }}>
              <button  className='btn' onClick={() => getX()}>get x:</button>
              {xValue && <div style={{marginLeft: '20px'}}>{xValue}</div>}
          </div>
          <div style={{
            display: 'flex', 
            marginBottom: '20px', 
            flexDirection: 'row-reverse', 
            justifyContent: 'flex-end'
            }}>
              <input  
              onChange={(e) => setIncrementNumber(e.target.value)}
              type='number' placeholder='Enter number'/>
            <button 
            style={{marginRight: '10px'}}
            className='btn' 
            disabled={!incrementNumber} 
            onClick={conectContract}>incrementBy</button>
          </div>
      </div>}
    </div>
    </>
  );
};

export default HomePage;
