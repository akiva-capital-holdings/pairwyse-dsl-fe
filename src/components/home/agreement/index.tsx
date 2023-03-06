import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { notification } from 'antd';
import { shortenedAddress } from '../../../utils/helpers';
import {
  initialVariableDefinitionValue,
  initialRecordCreationValue,
  titleValueRecordCreation,
  initialExecutionValue,
  initialAgreementValue,
  titleValueAgrement,
  titleValueExecute,
  initialTokenInfo,
  initialMultiTrancheValue,
} from './initialValue';
import { selectSession } from '../../../redux/sessionReducer';
import { ReactComponent as Copy } from '../../../images/copy.svg';
import { ReactComponent as CloseIcon } from '../../../images/closeIcon.svg';
import { ReactComponent as Success } from '../../../images/successIcon.svg';

import Header from '../../header/index';
import { RecordCreation, VariableDefinition, AgreementCreation, AgreementExecution } from './funcs';
import { mock, mockSignatories, mockDefinitions } from './mock';

import './index.css';

const navSteps = {
  stepOne: 'stepOne',
  stepTwo: 'stepTwo',
  stepThree: 'stepThree',
  stepFour: 'stepFour',
};

const HomePage = () => {
  const { agreementAddress, contractType } = useSelector(selectSession);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(navSteps.stepOne);
  // agrement request
  const [value, setValue] = useState(undefined);
  const [lender, setLender] = useState('');
  const [error, setError] = useState(undefined);
  const [tokenInfo, setTokenInfo] = useState(initialTokenInfo);
  const [multiTrancheAgreement, setMultiTrancheAgreement] = useState('');
  const [valueMultiTrancheRequest, setValueMultiTrancheRequest] =
    useState(initialMultiTrancheValue);
  const [valueAgreementCreation, setValueAgreementCreation] = useState(initialAgreementValue);
  const [agreementCreator, setAgreementCreator] = useState<boolean>(false);
  const [multiTrancheCreator, setMultiTrancheCreator] = useState<boolean>(false);
  const [tokenCreator, setTokenCreator] = useState<boolean>(false);
  // definition request
  const [definition, setDefinition] = useState('');
  const [specifications, setspecification] = useState(mockDefinitions);
  const [agreementDefinition, setAgreementDefinition] = useState('');
  const [valueVariableDefinition, setValueVariableDefinition] = useState(
    initialVariableDefinitionValue
  );
  // update request
  const [conditions, setConditions] = useState(mock);
  const [signatories, setSignatories] = useState(mockSignatories);
  const [agreement, setAgreement] = useState('');
  const [dslId, setDslID] = useState('');
  const [record, setRecord] = useState('');
  const [valueRecordCreation, setRecordCreation] = useState(initialRecordCreationValue);
  const [numbers, setNumbers] = useState([]);
  // Execution
  const [agreementExecution, setAgreementExecution] = useState('');
  const [dslIdExecution, setDslIdExecution] = useState('');
  const [rdValueExecution, setRecordValueExecution] = useState('');
  const [executionValue, setExecutionValue] = useState(initialExecutionValue);

  useEffect(() => {
    if (contractType?.includes('Agreement')) {
      setValueAgreementCreation({
        lastAgrAddr: agreementAddress,
        error: false,
        hash: '',
        message: '',
        submit: false,
      });
    } else {
      setValueMultiTrancheRequest({
        multiTrancheAddr: agreementAddress,
        error: false,
        message: '',
        submit: false,
      });
    }
  }, []);

  useEffect(() => {
    if (contractType?.includes('Agreement')) {
      setAgreementDefinition(valueAgreementCreation.lastAgrAddr);
      setAgreement(valueAgreementCreation.lastAgrAddr);
      setAgreementExecution(valueAgreementCreation.lastAgrAddr);
      setMultiTrancheAgreement(valueAgreementCreation.lastAgrAddr);
    } else {
      setAgreementDefinition(valueMultiTrancheRequest.multiTrancheAddr);
      setAgreement(valueMultiTrancheRequest.multiTrancheAddr);
      setAgreementExecution(valueMultiTrancheRequest.multiTrancheAddr);
      setMultiTrancheAgreement(valueMultiTrancheRequest.multiTrancheAddr);
    }
  }, [valueMultiTrancheRequest, valueAgreementCreation]);
  useEffect(() => {
    console.log(tokenInfo);
  }, [tokenInfo]);

  const reset = () => {
    setspecification(mockDefinitions);
    setSignatories(mockSignatories);
    setAgreementDefinition('');
    setAgreementExecution('');
    setMultiTrancheAgreement('');
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
      <AgreementCreation
        setValueAgreementCreation={setValueAgreementCreation}
        setValueMultiTrancheRequest={setValueMultiTrancheRequest}
        multiTrancheAgreement={multiTrancheAgreement}
        setMultiTrancheAgreement={setMultiTrancheAgreement}
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
        multiTrancheCreator={multiTrancheCreator}
        setMultiTrancheCreator={setMultiTrancheCreator}
        tokenCreator={tokenCreator}
        setTokenCreator={setTokenCreator}
      />
    ),
    stepTwo: (
      <VariableDefinition
        setValueVariableDefinition={setValueVariableDefinition}
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
      <RecordCreation
        setRecordCreation={setRecordCreation}
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
      <AgreementExecution
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
        <div className={`contentContainer ${recordError && 'error'}`}>
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
    // if open MultiTrancheCreator show MultiTrancheContainer
    if (multiTrancheCreator) {
      return recordContainer(
        valueMultiTrancheRequest.error,
        valueMultiTrancheRequest.multiTrancheAddr,
        valueMultiTrancheRequest.message,
        valueMultiTrancheRequest.submit,
        'MultiTranche'
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
      valueAgreementCreation.error,
      valueAgreementCreation.lastAgrAddr,
      valueAgreementCreation.message,
      valueAgreementCreation.submit,
      'Agreement'
    );
  };

  const contentConteiner = {
    stepOne: recordCheck(),
    stepTwo: (
      <div
        className={`recordContainer  ${
          valueVariableDefinition?.error && !valueVariableDefinition?.value ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Record</div>
          {valueVariableDefinition?.submit &&
            iconValue(valueVariableDefinition?.error && !!valueVariableDefinition?.message)}
        </div>
        <div className={`contentContainer ${valueVariableDefinition?.error ? 'error' : ''}`}>
          {valueVariableDefinition?.value && (
            <div style={{ marginTop: '12px' }} className="content">
              <div className="title">
                Definition Request <br />
                Record ID
              </div>
              <div className="valueContainer">
                <div className="value">{shortenedAddress(valueVariableDefinition?.hash, 9)}</div>
                <Copy
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCopyClick(valueVariableDefinition?.hash)}
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
          valueRecordCreation?.error && !valueRecordCreation?.hash ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Record</div>
          {valueRecordCreation?.submit &&
            iconValue(valueRecordCreation?.error && !!valueRecordCreation?.message)}
        </div>
        <div className={`contentContainer  ${valueRecordCreation?.error ? 'error' : ''}`}>
          <div className="content">
            <div className="title">
              {valueRecordCreation?.error && valueRecordCreation?.message
                ? 'Warning! Error encountered during contract execution'
                : titleValueRecordCreation(!!valueRecordCreation?.hash)}
            </div>
            {!!valueRecordCreation?.hash && (
              <div className="valueContainer">
                <div className="value">{shortenedAddress(valueRecordCreation?.hash, 9)}</div>
                <Copy
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCopyClick(valueRecordCreation?.hash)}
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
        <div className={`contentContainer  ${executionValue?.error ? 'error' : ''}`}>
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
                Variable
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
                Record
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
          <div hidden className="statusContainer">
            <div className="title">Status</div>
            <div className="img" />
            <div className="secondaryTitle">Ready to deploy</div>
          </div>
          {contentConteiner[step]}
        </div>
      </div>
    </>
  );
};

export default HomePage;
