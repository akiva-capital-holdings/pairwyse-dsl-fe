import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { notification } from 'antd';
import { shortenedAddress } from '../../utils/helpers';
import {
  initialDefinitionRequestValue,
  initialUpdateRequestValue,
  titleValueUpdateRequest,
  initialExecutionValue,
  initialAgreementValue,
  titleValueDefinition,
  titleValueAgrement,
  titleValueExecute,
  initialTokenInfo,
  initialGovernanceValue,
} from './initialValue';
import { selectSession } from '../../redux/sessionReducer';
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
  const { agreementAddress } = useSelector(selectSession);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(navSteps.stepOne);
  // agrement request
  const [value, setValue] = useState(undefined);
  const [lender, setLender] = useState('');
  const [error, setError] = useState(undefined);
  const [tokenInfo, setTokenInfo] = useState(initialTokenInfo);
  const [governanceAgreement, setGovernanceAgreement] = useState('');
  const [valueGovernanceRequest, setValueGovernanceRequest] = useState(initialGovernanceValue);
  const [valueAgreementRequest, setValueAgreementRequest] = useState(initialAgreementValue);
  const [agreementCreator, setAgreementCreator] = useState<boolean>(false);
  const [governanceCreator, setGovernanceCreator] = useState<boolean>(false);
  const [tokenCreator, setTokenCreator] = useState<boolean>(false);
  // definition request
  const [definition, setDefinition] = useState('');
  const [specifications, setspecification] = useState(mockDefinitions);
  const [agreementDefinition, setAgreementDefinition] = useState('');
  const [valueDefinitionRequest, setValueDefinitionRequest] = useState(
    initialDefinitionRequestValue
  );
  // update request
  const [conditions, setConditions] = useState(mock);
  const [signatories, setSignatories] = useState(mockSignatories);
  const [agreement, setAgreement] = useState('');
  const [dslId, setDslID] = useState('');
  const [record, setRecord] = useState('');
  const [valueUpdateRequest, setUpdateRequest] = useState(initialUpdateRequestValue);
  const [numbers, setNumbers] = useState([]);
  // Execution
  const [agreementExecution, setAgreementExecution] = useState('');
  const [dslIdExecution, setDslIdExecution] = useState('');
  const [rdValueExecution, setRecordValueExecution] = useState('');
  const [executionValue, setExecutionValue] = useState(initialExecutionValue);

  useEffect(() => {
    setValueAgreementRequest({
      lastAgrAddr: agreementAddress,
      error: false,
      hash: '',
      message: '',
      submit: false,
    });
  }, []);

  useEffect(() => {
    setAgreementDefinition(valueAgreementRequest.lastAgrAddr);
    setAgreement(valueAgreementRequest.lastAgrAddr);
    setAgreementExecution(valueAgreementRequest.lastAgrAddr);
    setGovernanceAgreement(valueAgreementRequest.lastAgrAddr);
  }, [valueAgreementRequest]);
  useEffect(() => {
    console.log(tokenInfo);
  }, [tokenInfo]);

  const reset = () => {
    setspecification(mockDefinitions);
    setSignatories(mockSignatories);
    setAgreementDefinition('');
    setAgreementExecution('');
    setGovernanceAgreement('');
    setDslIdExecution('');
    setValue(undefined);
    setConditions(mock);
    setRecord('');
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
        setValueGovernanceRequest={setValueGovernanceRequest}
        governanceAgreement={governanceAgreement}
        setGovernanceAgreement={setGovernanceAgreement}
        setLoading={setLoading}
        setLender={setLender}
        setError={setError}
        setValue={setValue}
        loading={loading}
        lender={lender}
        error={error}
        value={value}
        setTokenInfo={setTokenInfo}
        agreementCreator={agreementCreator}
        setAgreementCreator={setAgreementCreator}
        governanceCreator={governanceCreator}
        setGovernanceCreator={setGovernanceCreator}
        tokenCreator={tokenCreator}
        setTokenCreator={setTokenCreator}
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
        setRecord={setRecord}
        setConditions={setConditions}
        setAgreement={setAgreement}
        record={record}
        signatories={signatories}
        conditions={conditions}
        setLoading={setLoading}
        setNumbers={setNumbers}
        agreement={agreement}
        setDslID={setDslID}
        numbers={numbers}
        loading={loading}
        dslId={dslId}
      />
    ),
    stepFour: (
      <ExecutionRequest
        setDslID={setDslIdExecution}
        dslId={dslIdExecution}
        setExecutionValue={setExecutionValue}
        setAgreement={setAgreementExecution}
        setRecordValue={setRecordValueExecution}
        agreementExecution={agreementExecution}
        rdValue={rdValueExecution}
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

  const recordContainer = (recordError, recordAddress, recordMessage, isSubmit, createdName) => {
    return (
      <div className={`recordContainer  ${recordError && !recordAddress ? 'error' : ''}`}>
        <div className="titleContainer">
          <div className="title">Record</div>
          {isSubmit && iconValue(recordError && !!recordMessage)}
        </div>
        <div className={`contentCOntainer ${recordError && 'error'}`}>
          <div className="content">
            <div className="title">
              {recordError && recordMessage
                ? 'Warning! Error encountered during contract execution'
                : titleValueAgrement(!!recordAddress, createdName)}
            </div>
            {recordAddress && (
              <div className="valueContainer">
                <div className="value">{shortenedAddress(recordAddress, 9)}</div>
                <Copy style={{ cursor: 'pointer' }} onClick={() => onCopyClick(recordAddress)} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const recordCheck = () => {
    // if opem governanceCreator show governanceContainer
    if (governanceCreator) {
      return recordContainer(
        valueGovernanceRequest.error,
        valueGovernanceRequest.governanceAddr,
        valueGovernanceRequest.message,
        valueGovernanceRequest.submit,
        'Governance'
      );
    }
    // if open tokenCreator show tokenContainer
    if (tokenCreator) {
      return recordContainer(
        tokenInfo.error,
        tokenInfo.address,
        tokenInfo.message,
        tokenInfo.submit,
        'Token'
      );
    }
    // if open agreementCreator show agreementContainer
    return recordContainer(
      valueAgreementRequest.error,
      valueAgreementRequest.lastAgrAddr,
      valueAgreementRequest.message,
      valueAgreementRequest.submit,
      'Agreement'
    );
  };

  const contentCOnteiner = {
    stepOne: recordCheck(),
    stepTwo: (
      <div
        className={`recordContainer  ${
          valueDefinitionRequest?.error && !valueDefinitionRequest?.value ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Record</div>
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
                <Copy
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCopyClick(valueDefinitionRequest?.value)}
                />
              </div>
            )}
          </div>
          {valueDefinitionRequest?.value && (
            <div style={{ marginTop: '12px' }} className="content">
              <div className="title">
                Definition Request <br />
                Record ID
              </div>
              <div className="valueContainer">
                <div className="value">{shortenedAddress(valueDefinitionRequest?.hash, 9)}</div>
                <Copy
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCopyClick(valueDefinitionRequest?.hash)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    stepThree: (
      <div
        className={`recordContainer  ${
          valueUpdateRequest?.error && !valueUpdateRequest?.hash ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Record</div>
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
                <Copy
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCopyClick(valueUpdateRequest?.hash)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    stepFour: (
      <div
        className={`recordContainer  ${
          executionValue?.error && !executionValue?.hash ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Record</div>
          <div className="titleSeccess">
            {executionValue?.submit &&
              iconValue(executionValue?.error && !!executionValue?.message)}
          </div>
        </div>
        <div className={`contentCOntainer  ${executionValue?.error ? 'error' : ''}`}>
          <div className="content">
            <div className="title">
              {executionValue?.error && executionValue?.message
                ? 'Warning! Error encountered during contract execution'
                : titleValueExecute(!!executionValue?.hash)}
            </div>
            {!!executionValue?.hash && (
              <div className="valueContainer">
                <div className="value">{shortenedAddress(executionValue?.hash, 9)}</div>
                <Copy
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCopyClick(executionValue?.hash)}
                />
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
