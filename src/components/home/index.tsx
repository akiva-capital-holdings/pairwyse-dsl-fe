/* eslint-disable arrow-body-style */
import { useState } from 'react';
import {CheckOutlined, CopyOutlined}  from '@ant-design/icons'
import {notification} from 'antd'
import Header from '../header/index';
import { UpdateRequest, DefinitionRequest, AgreementRequest, ExecutionRequest } from './steps';
import { mock, mockSignatories, mockDefinitions } from './mock';
import { ReactComponent as Copy } from '../../images/copy.svg';

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
  const [valueAgreementRequest, setValueAgreementRequest]  = useState({hash: '', lastAgrAddr: ''})
  // definition request
  const [definition, setDefinition] = useState('');
  const [specifications, setspecification] = useState(mockDefinitions);
  const [agreementDefinition, setAgreementDefinition] = useState('');
  const [valueDefinitionRequest, setValueDefinitionRequest] = useState({agreementAddr: ''})
  // update request
  const [conditions, setConditions] = useState(mock);
  const [signatories, setSignatories] = useState(mockSignatories);
  const [agreement, setAgreement] = useState('');
  const [dslId, setDslID] = useState('');
  const [transaction, setTransaction] = useState('');
  const [valueUpdateRequest, setUpdateRequest] = useState()
  // execition // TODO: fix typo
  const [agreementExecition, setAgreementExecition] = useState('');
  const [dslIdExecition, setDslIdExecition] = useState('');
  const [txValueExecution, setTxValueExecution] = useState('');
  const [execitionValue, setExecitionValue] = useState('')
  
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
        setValueAgreementRequest={setValueAgreementRequest}
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
        setValueDefinitionRequest={setValueDefinitionRequest}
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
        setUpdateRequest={setUpdateRequest}
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
        setDslID={setDslIdExecition} // TODO: fix typo
        dslId={dslIdExecition} // TODO: fix typo
        setExecitionValue={setExecitionValue}
        setAgreement={setAgreementExecition}
        setTxValue={setTxValueExecution}
        agreement={agreementExecition}
        txValue={txValueExecution}
      />
    ),
  };
  const onCopyClick = (text: string) => {
    notification.info({
      message: 'Copied',
      icon: <Copy className="notificationIcon" />,
    });
    navigator.clipboard.writeText(`${text}`);
  };
  const contentCOnteiner = {
    stepOne: (
   valueAgreementRequest?.hash ?
    <div className='contentCOntainer'>
    <div className='content'>
      <div className='title'>Created Agreement Addres</div>
      <div className='valueContainer'>
        <div className='value'>{valueAgreementRequest?.lastAgrAddr}</div>
        <CopyOutlined  onClick={() => onCopyClick(valueAgreementRequest?.lastAgrAddr)}/>
      </div>
    </div>
    <div  style={{marginTop:  '12px'}} className='content'>
      <div className='title'>Agreement Request  <br/>Transaction ID</div>
      <div className='valueContainer'>
        <div className='value'>{valueAgreementRequest?.hash}</div> 
        <CopyOutlined  onClick={() => onCopyClick(valueAgreementRequest?.hash)}/>
      </div>
     </div>
    </div> 
   :  null ),
    stepTwo: (
      valueDefinitionRequest ?
      <div className='contentCOntainer'>
      <div className='content'>
        <div className='title'>Created Agreement Addres</div>
        <div className='valueContainer'>
          <div className='value'>{valueDefinitionRequest?.agreementAddr}</div>
          <CopyOutlined  onClick={() => onCopyClick(valueDefinitionRequest?.agreementAddr)}/>
        </div>
      </div>
      </div> 
      :  null 
    ),
    stepThree: (
      valueUpdateRequest ?
        <div className='contentCOntainer'>
        <div className='content'>
          <div className='title'>Created Agreement Addres</div>
          <div className='valueContainer'>
            <div className='value'>{valueUpdateRequest}</div>
            <CopyOutlined  onClick={() => onCopyClick(valueUpdateRequest)}/>
          </div>
        </div>
        </div> 
        :  null 
    ),
    stepFour: (
      execitionValue ?
       <div className='contentCOntainer'>
       <div className='content'>
         <div className='title'>Created Agreement Addres</div>
         <div className='valueContainer'>
           <div className='value'>{execitionValue}</div>
           <CopyOutlined  onClick={() => onCopyClick(execitionValue)}/>
         </div>
       </div>
       </div> 
       :  null 
    ),
  };
  return (
    <>
      <Header onClick={reset} />
      <div className="homePage">
        <div className="stepsContentContainer">
          <span className="title">Agreement</span>
          <div className="menu">
            <button onClick={() => onChangeStep(1)} className={'navButton'}>
              <span
                style={{ textAlign: 'left', paddingBottom: '8px' }}
                className={`${step === navSteps.stepOne && 'active'}`}
              >
                {' '}
                Creation
              </span>
            </button>
            <button onClick={() => onChangeStep(2)} className={'navButton'}>
              <span
                style={{ textAlign: 'center', margin: '0 auto', paddingBottom: '8px' }}
                className={`${step === navSteps.stepTwo && 'active'}`}
              >
                Definition
              </span>
            </button>
            <button onClick={() => onChangeStep(3)} className={'navButton'}>
              <span
                style={{ textAlign: 'center', margin: '0 auto', paddingBottom: '8px' }}
                className={`${step === navSteps.stepThree && 'active'}`}
              >
                Update
              </span>
            </button>
            <button onClick={() => onChangeStep(4)} className={'navButton'}>
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
        <div>
          <div className="statusContainer">
            <div className="title">Status</div>
              <div className="img" />
              <div className="secondaryTitle">Ready to deploy</div>
          </div>
         {( 
           !!valueAgreementRequest?.hash || 
           !!valueDefinitionRequest?.agreementAddr || 
           !!valueUpdateRequest ||
           !!execitionValue 
          )?  <div className='transactionContainer'>
              <div className='titleContainer'>
              <div className='title'>Transaction</div>
              <div className='titleSeccess'>
                <CheckOutlined color='#61E366' className='iconSuccess'/>Success</div>
                </div>
                {contentCOnteiner[step]}
            </div> : null }
       </div>
     </div>
   </>
  );
};

export default HomePage;
