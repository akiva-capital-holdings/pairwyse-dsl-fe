import { useState } from 'react';
import { notification } from 'antd';
import { shortenedAddress } from '../../utils/helpers';
import {
  initialDefinitionRequestValue, 
  initialUpdateRequestValue,
  titleValueUpdateRequest,
  initialExecitionValue,
  initialAgreementValue, 
  titleValueDefinition,
  titleValueAgrement,
  titleValueExecute,
} from './initialValue'
import { ReactComponent as Copy } from '../../images/copy.svg';
import { ReactComponent as CloseIcon } from '../../images/closeIcon.svg';
import { ReactComponent as Success } from '../../images/successIcon.svg';

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
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(navSteps.stepOne);
  // agrement request
  const [value, setValue] = useState(undefined);
  const [lender, setLender] = useState('');
  const [error, setError] = useState(undefined);
  const [valueAgreementRequest, setValueAgreementRequest] = useState(initialAgreementValue);
  // definition request
  const [definition, setDefinition] = useState('');
  const [specifications, setspecification] = useState(mockDefinitions);
  const [agreementDefinition, setAgreementDefinition] = useState('');
  const [valueDefinitionRequest, setValueDefinitionRequest] = useState(initialDefinitionRequestValue);
  // update request
  const [conditions, setConditions] = useState(mock);
  const [signatories, setSignatories] = useState(mockSignatories);
  const [agreement, setAgreement] = useState('');
  const [dslId, setDslID] = useState('');
  const [transaction, setTransaction] = useState('');
  const [valueUpdateRequest, setUpdateRequest] = useState(initialUpdateRequestValue);
  // execition // TODO: fix typo
  const [agreementExecition, setAgreementExecition] = useState('');
  const [dslIdExecition, setDslIdExecition] = useState('');
  const [txValueExecution, setTxValueExecution] = useState('');
  const [execitionValue, setExecitionValue] = useState(initialExecitionValue);

  const reset = () => {
    setspecification(mockDefinitions);
    setSignatories(mockSignatories);
    setAgreementDefinition('');
    setAgreementExecition('');
    setDslIdExecition('');
    setValue(undefined);
    setConditions(mock);
    setTransaction('');
    setDefinition('');
    setAgreement('');
    setLender('');
    setError('');
    setDslID('');
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
        setLoading={setLoading}
        setLender={setLender}
        setError={setError}
        setValue={setValue}
        loading={loading}
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
        setLoading={setLoading}
        definition={definition}
        loading={loading}
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
        setLoading={setLoading}
        agreement={agreement}
        setDslID={setDslID}
        loading={loading}
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
        setLoading={setLoading}
        loading={loading}
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
    return v ? (
      <div className="red">
        {' '}
        <CloseIcon color="#E61F1F" className="iconSuccess" />
        Fail
      </div>
    ) : (
      <div className="green">
        {' '}
        <Success color="#61E366" className="iconSuccess" />
        Success
      </div>
    );
  };



  const contentCOnteiner = {
    stepOne: (
      <div
        className={`transactionContainer  ${
          valueAgreementRequest?.error && !valueAgreementRequest?.lastAgrAddr ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Transaction</div>
          {valueAgreementRequest?.submit &&
            iconValue(valueAgreementRequest?.error && !!valueAgreementRequest?.message)}
        </div>
        <div className={`contentCOntainer ${valueAgreementRequest?.error && 'error'}`}>
          <div className="content">
            <div className="title">
              {valueAgreementRequest?.error && valueAgreementRequest?.message
                ? 'Warning! Error encountered during contract execution'
                : titleValueAgrement(!!valueAgreementRequest?.lastAgrAddr)}
            </div>
            {valueAgreementRequest?.lastAgrAddr && (
              <div className="valueContainer">
                <div className="value">
                  {shortenedAddress(valueAgreementRequest?.lastAgrAddr, 9)}
                </div>
                <Copy onClick={() => onCopyClick(valueAgreementRequest?.lastAgrAddr)} />
              </div>
            )}
          </div>
          {valueAgreementRequest?.hash && (
            <div style={{ marginTop: '12px' }} className="content">
              <div className="title">
                Agreement Request <br />
                Transaction ID
              </div>
              <div className="valueContainer">
                <div className="value">{shortenedAddress(valueAgreementRequest?.hash, 9)}</div>
                <Copy onClick={() => onCopyClick(valueAgreementRequest?.hash)} />
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    stepTwo: (
      <div
        className={`transactionContainer  ${
          valueDefinitionRequest?.error && !valueDefinitionRequest?.value ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Transaction</div>
          {valueDefinitionRequest?.submit &&
            iconValue(valueDefinitionRequest?.error && !!valueDefinitionRequest?.message)}
        </div>
        <div className={`contentCOntainer ${valueDefinitionRequest?.error ? 'error' : ''}`}>
          <div className="content">
            <div className="title">
              {valueDefinitionRequest?.error && valueDefinitionRequest?.message
                ? 'Warning! Error encountered during contract execution'
                : titleValueDefinition(!!valueDefinitionRequest?.value)}
            </div>
            {!!valueDefinitionRequest?.value && (
              <div className="valueContainer">
                <div className="value">{shortenedAddress(valueDefinitionRequest?.value, 9)}</div>
                <Copy onClick={() => onCopyClick(valueDefinitionRequest?.value)} />
              </div>
            )}
          </div>
          {valueDefinitionRequest?.value && (
            <div style={{ marginTop: '12px' }} className="content">
              <div className="title">
                Definition Request <br />
                Transaction ID
              </div>
              <div className="valueContainer">
                <div className="value">
                  {shortenedAddress(valueDefinitionRequest?.transactionHash, 9)}
                </div>
                <Copy onClick={() => onCopyClick(valueDefinitionRequest?.transactionHash)} />
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    stepThree: (
      <div
        className={`transactionContainer  ${
          valueUpdateRequest?.error && !valueUpdateRequest?.hash ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Transaction</div>
          {valueUpdateRequest?.submit &&
            iconValue(valueUpdateRequest?.error && !!valueUpdateRequest?.message)}
        </div>
        <div className={`contentCOntainer  ${valueUpdateRequest?.error ? 'error' : ''}`}>
          <div className="content">
            <div className="title">
              {valueUpdateRequest?.error && valueUpdateRequest?.message
                ? 'Warning! Error encountered during contract execution'
                : titleValueUpdateRequest(!!valueUpdateRequest?.hash)}
            </div>
            {!!valueUpdateRequest?.hash && (
              <div className="valueContainer">
                <div className="value">{shortenedAddress(valueUpdateRequest?.hash, 9)}</div>
                <Copy onClick={() => onCopyClick(valueUpdateRequest?.hash)} />
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    stepFour: (
      <div
        className={`transactionContainer  ${
          execitionValue?.error && !execitionValue?.hash ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Transaction</div>
          <div className="titleSeccess">
            {execitionValue?.submit &&
              iconValue(execitionValue?.error && !!execitionValue?.message)}
          </div>
        </div>
        <div className={`contentCOntainer  ${execitionValue?.error ? 'error' : ''}`}>
          <div className="content">
            <div className="title">
              {execitionValue?.error && execitionValue?.message
                ? 'Warning! Error encountered during contract execution'
                : titleValueExecute(!!execitionValue?.hash)}
            </div>
            {!!execitionValue?.hash && (
              <div className="valueContainer">
                <div className="value">{shortenedAddress(execitionValue?.hash, 9)}</div>
                <Copy onClick={() => onCopyClick(execitionValue?.hash)} />
              </div>
            )}
          </div>
        </div>
      </div>
    ),
  };

  return (
    <>
      <Header onClick={reset} />
      <div className="homePage">
        <div className="stepsContentContainer">
          <span className="title">Agreement</span>
          <div className="menu">
            <button
              onClick={() => {
                return onChangeStep(1);
              }}
              className={'navButton'}
            >
              <span
                style={{ textAlign: 'left', paddingBottom: '8px' }}
                className={`${step === navSteps.stepOne && 'active'}`}
              >
                {' '}
                Creation
              </span>
            </button>
            <button
              onClick={() => {
                return onChangeStep(2);
              }}
              className={'navButton'}
            >
              <span
                style={{ textAlign: 'center', margin: '0 auto', paddingBottom: '8px' }}
                className={`${step === navSteps.stepTwo && 'active'}`}
              >
                Definition
              </span>
            </button>
            <button
              onClick={() => {
                return onChangeStep(3);
              }}
              className={'navButton'}
            >
              <span
                style={{ textAlign: 'center', margin: '0 auto', paddingBottom: '8px' }}
                className={`${step === navSteps.stepThree && 'active'}`}
              >
                Update
              </span>
            </button>
            <button
              onClick={() => {
                return onChangeStep(4);
              }}
              className={'navButton'}
            >
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
