/* eslint-disable arrow-body-style */
import { useState } from 'react';
import {CheckOutlined, CopyOutlined, CloseOutlined}  from '@ant-design/icons'
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
  const [valueAgreementRequest, setValueAgreementRequest]  = useState({hash: '', lastAgrAddr: '', submit: false})
  // definition request
  const [definition, setDefinition] = useState('');
  const [specifications, setspecification] = useState(mockDefinitions);
  const [agreementDefinition, setAgreementDefinition] = useState('');
  const [valueDefinitionRequest, setValueDefinitionRequest] = useState({agreementAddr: '', submit: false})
  // update request
  const [conditions, setConditions] = useState(mock);
  const [signatories, setSignatories] = useState(mockSignatories);
  const [agreement, setAgreement] = useState('');
  const [dslId, setDslID] = useState('');
  const [transaction, setTransaction] = useState('');
  const [valueUpdateRequest, setUpdateRequest] = useState({hash: '', submit: false})
  // execition // TODO: fix typo
  const [agreementExecition, setAgreementExecition] = useState('');
  const [dslIdExecition, setDslIdExecition] = useState('');
  const [txValueExecution, setTxValueExecution] = useState('');
  const [execitionValue, setExecitionValue] = useState({value: '', submit: false})
  
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
    return   v ?
      <div className='green'>   <CheckOutlined color='#61E366' className='iconSuccess'/>Success</div>
         : 
      <div className='red'>   <CloseOutlined color='#E61F1F' className='iconSuccess'/>Fail</div>
  }
  const titleValue = (v) => {
    console.log(v);
    
    return v
      ? 'Created Agreement Addres'
      : 'Warning! Error encounteredduring contract execution'

  }
  const contentCOnteiner = {
    stepOne: (
      valueAgreementRequest?.submit || valueAgreementRequest?.hash ?
   <div className={`transactionContainer  ${ !valueAgreementRequest?.submit &&  execitionValue?.value ? 'error' : ''  }`}>
              <div className='titleContainer'>
              <div className='title'>Transaction</div>
              {iconValue(!!valueAgreementRequest?.lastAgrAddr)}
                </div>
    <div className={`contentCOntainer ${valueAgreementRequest?.submit && 'error'}`}>
    <div className='content'>
      <div className='title'>{titleValue(!!valueAgreementRequest?.lastAgrAddr)}</div>
    {valueAgreementRequest?.hash &&  <div className='valueContainer'>
        <div className='value'>{valueAgreementRequest?.lastAgrAddr}</div>
        <CopyOutlined  onClick={() => onCopyClick(valueAgreementRequest?.lastAgrAddr)}/>
      </div>
      }
    </div>
    {valueAgreementRequest?.hash && <div  style={{marginTop:  '12px'}} className='content'>
      <div className='title'>Agreement Request  <br/>Transaction ID</div>
      <div className='valueContainer'>
        <div className='value'>{valueAgreementRequest?.hash}</div> 
        <CopyOutlined  onClick={() => onCopyClick(valueAgreementRequest?.hash)}/>
      </div>
     </div>}
    </div> 
    </div>
   :  null ),
    stepTwo: (
       valueDefinitionRequest?.submit || !!valueDefinitionRequest?.agreementAddr ?
      <div className={`transactionContainer  ${ !valueDefinitionRequest?.agreementAddr && 'error' }`}>
      <div className='titleContainer'>
      <div className='title'>Transaction</div>
      {iconValue(!!valueDefinitionRequest?.agreementAddr)}
        </div>
      <div className={`contentCOntainer ${valueAgreementRequest?.submit && 'error'}`}>
      <div className='content'>
        <div className='title'>{titleValue(valueDefinitionRequest?.agreementAddr)}</div>
      {!!valueDefinitionRequest?.agreementAddr  && <div className='valueContainer'>
          <div className='value'>{!!valueDefinitionRequest?.agreementAddr}</div>
          <CopyOutlined  onClick={() => onCopyClick(valueDefinitionRequest?.agreementAddr)}/>
        </div>}
      </div>
      </div> 
      </div>
      :  null 
    ),
    stepThree: (
      !!valueUpdateRequest?.hash || valueUpdateRequest?.submit ?
      <div className={`transactionContainer  ${ !valueUpdateRequest?.hash && 'error' }`}>
      <div className='titleContainer'>
      <div className='title'>Transaction</div>
      {iconValue(!!valueUpdateRequest?.hash)}
        </div>
        <div className={`contentCOntainer ${!valueUpdateRequest?.hash && 'error'}`}>
        <div className='content'>
          <div className='title'>{titleValue(!!valueUpdateRequest?.hash)}</div>
         {!!valueUpdateRequest?.hash && <div className='valueContainer'>
            <div className='value'>{valueUpdateRequest?.hash}</div>
            <CopyOutlined  onClick={() => onCopyClick(valueUpdateRequest?.hash)}/>
          </div>}
        </div>
        </div> 
              </div> 
        :  null 
    ),
    stepFour: (
       execitionValue?.submit ||  execitionValue?.value  ?
      <div className={`transactionContainer  ${ execitionValue?.submit ||  execitionValue?.value ? 'error' : ''  }`}>
      <div className='titleContainer'>
      <div className='title'>Transaction</div>
        <div className='titleSeccess'>
        {iconValue(!!execitionValue?.value)}
        </div>
     </div>
       <div className={'contentCOntainer'}>
       <div className='content'>
         <div className='title'>
         {titleValue(!!execitionValue?.value )}
        </div>
        {!!execitionValue?.value && <div className='valueContainer'>
           <div className='value'>{execitionValue?.value}</div>
           <CopyOutlined  onClick={() => onCopyClick(execitionValue?.value)}/>
         </div>
         }
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
          )?<>
            {contentCOnteiner[step]}
            </>
          : null }
       </div>
     </div>
   </>
  );
};

export default HomePage;
