/* eslint-disable arrow-body-style */
import { useState } from 'react';
import {notification} from 'antd'
import { ReactComponent as Copy } from '../../images/copy.svg'
import { ReactComponent as CloseIcon } from '../../images/closeIcon.svg'
import { ReactComponent as Success } from '../../images/successIcon.svg'


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
  const [valueAgreementRequest, setValueAgreementRequest]  = useState({lastAgrAddr: '', error: false, hash: '', message: '', submit: false })
  // definition request
  const [definition, setDefinition] = useState('');
  const [specifications, setspecification] = useState(mockDefinitions);
  const [agreementDefinition, setAgreementDefinition] = useState('');
  const [valueDefinitionRequest, setValueDefinitionRequest] = useState({value: '', submit: false, transactionHash: '', error: false, message: ''})
  // update request
  const [conditions, setConditions] = useState(mock);
  const [signatories, setSignatories] = useState(mockSignatories);
  const [agreement, setAgreement] = useState('');
  const [dslId, setDslID] = useState('');
  const [transaction, setTransaction] = useState('');
  const [valueUpdateRequest, setUpdateRequest] = useState({hash: '', submit: false,  error: false, message: ''})
  // execition // TODO: fix typo
  const [agreementExecition, setAgreementExecition] = useState('');
  const [dslIdExecition, setDslIdExecition] = useState('');
  const [txValueExecution, setTxValueExecution] = useState('');
  const [execitionValue, setExecitionValue] = useState({hash: '', submit : false,  error: false, message:  ''})
console.log(valueUpdateRequest);

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
  const iconValue = (v) => {
    console.log(v);
    
    return   v ?
    <div className='red'>   <CloseIcon color='#E61F1F' className='iconSuccess'/>Fail</div>
    : 
    <div className='green'>   <Success color='#61E366' className='iconSuccess'/>Success</div>
  }

  const titleValueAgrement = (v) => {
    return v
    ? 'Created Agreement Address'
    : 'No transactions yet'
  }
  const titleValueDefinition = (v) => {
    return v
    ? 'Definition Transaction ID'
    : 'No transactions yet'
  }
  const titleValueUpdateRequest = (v) => {
    return v
    ? 'Update Request Transaction ID'
    : 'No transactions yet'
  }
  const titleValueExecute = (v) => {
    return v
    ? 'Execution Transaction ID'
    : 'No transactions yet'
  }

  const contentCOnteiner = {
    stepOne: (
   <div className={`transactionContainer  ${ valueAgreementRequest?.error && !valueAgreementRequest?.lastAgrAddr ? 'error' : ''  }`}>
      <div className='titleContainer'>
        <div className='title'>Transaction</div>
      {valueAgreementRequest?.submit && iconValue(valueAgreementRequest?.error && !!valueAgreementRequest?.message )}
      </div>
    <div className={`contentCOntainer ${valueAgreementRequest?.error && 'error'}`}>
    <div className='content'>
      <div className='title'>
        {valueAgreementRequest?.error && valueAgreementRequest?.message  
        ? 'Warning! Error encountered during contract execution'
        : titleValueAgrement(!!valueAgreementRequest?.lastAgrAddr) }
      </div>
      {valueAgreementRequest?.lastAgrAddr &&  <div className='valueContainer'>
        <div className='value'>{valueAgreementRequest?.lastAgrAddr}</div>
        <Copy  onClick={() => onCopyClick(valueAgreementRequest?.lastAgrAddr)}/>
      </div>
      }
    </div>
    {valueAgreementRequest?.hash && <div  style={{marginTop:  '12px'}} className='content'>
      <div className='title'>Agreement Request  <br/>Transaction ID</div>
      <div className='valueContainer'>
        <div className='value'>{valueAgreementRequest?.hash}</div> 
        <Copy  onClick={() => onCopyClick(valueAgreementRequest?.hash)}/>
      </div>
     </div>}
    </div> 
    </div>
   ),
    stepTwo: (
      <div className={`transactionContainer  ${ valueDefinitionRequest?.error && !valueDefinitionRequest?.value ? 'error' : ''  }`}>
      <div className='titleContainer'>
      <div className='title'>Transaction</div>
      {valueDefinitionRequest?.submit && iconValue(valueDefinitionRequest?.error && !!valueDefinitionRequest?.message )}
        </div>
      <div className={`contentCOntainer ${valueDefinitionRequest?.error ? 'error':  '' }`}>
      <div className='content'>
        <div className='title'>
        {valueDefinitionRequest?.error && valueDefinitionRequest?.message  
        ? 'Warning! Error encountered during contract execution'
        : titleValueDefinition(!!valueDefinitionRequest?.value) }</div>
       {!!valueDefinitionRequest?.value  && <div className='valueContainer'>
          <div className='value'>{valueDefinitionRequest?.value}</div>
          <Copy  onClick={() => onCopyClick(valueDefinitionRequest?.value)}/>
        </div>
        }
      </div>
      {valueDefinitionRequest?.value && <div  style={{marginTop:  '12px'}} className='content'>
      <div className='title'>Definition Request  <br/>Transaction ID</div>
      <div className='valueContainer'>
        <div className='value'>{valueDefinitionRequest?.transactionHash}</div> 
        <Copy  onClick={() => onCopyClick(valueDefinitionRequest?.transactionHash)}/>
      </div>
     </div>}
      </div> 
      </div>
    ),
    stepThree: (
      <div className={`transactionContainer  ${ valueUpdateRequest?.error && !valueUpdateRequest?.hash ? 'error' : ''  }`}>
      <div className='titleContainer'>
      <div className='title'>Transaction</div>
      { valueUpdateRequest?.submit  && iconValue(valueUpdateRequest?.error && !!valueUpdateRequest?.message)}
        </div>
        <div className={`contentCOntainer  ${valueUpdateRequest?.error ? 'error':  '' }`}>
        <div className='content'>
          <div className='title'>
          {valueUpdateRequest?.error && valueUpdateRequest?.message  
        ? 'Warning! Error encountered during contract execution'
        : titleValueUpdateRequest(!!valueUpdateRequest?.hash) }</div>
         {!!valueUpdateRequest?.hash && <div className='valueContainer'>
            <div className='value'>{valueUpdateRequest?.hash}</div>
            <Copy  onClick={() => onCopyClick(valueUpdateRequest?.hash)}/>
          </div>}
        </div>
        </div> 
        </div> 
    ),
    stepFour: (
      <div className={`transactionContainer  ${execitionValue?.error &&  !execitionValue?.hash ? 'error' : ''  }`}>
      <div className='titleContainer'>
      <div className='title'>Transaction</div>
        <div className='titleSeccess'>
        { execitionValue?.submit  && iconValue(execitionValue?.error && !!execitionValue?.message)}
        </div>
     </div>
       <div className={`contentCOntainer  ${execitionValue?.error ? 'error':  '' }`}>
       <div className='content'>
         <div className='title'>
         {execitionValue?.error && execitionValue?.message  
        ? 'Warning! Error encountered during contract execution'
        : titleValueExecute(!!execitionValue?.hash) }
        </div>
        {!!execitionValue?.hash && <div className='valueContainer'>
           <div className='value'>{execitionValue?.hash}</div>
           <Copy  onClick={() => onCopyClick(execitionValue?.hash)}/>
         </div>
         }
       </div>
       </div> 
       </div>
    ),
  };
  console.log(valueUpdateRequest?.message);
  
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
            {contentCOnteiner[step]}
       </div>
     </div>
   </>
  );
};

export default HomePage;
