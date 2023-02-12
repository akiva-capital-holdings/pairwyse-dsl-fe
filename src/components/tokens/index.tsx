import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { notification } from 'antd';
import { shortenedAddress } from '../../utils/helpers';
import { initialTokenInfo } from './initialValue';
import { selectSession } from '../../redux/sessionReducer';
import { ReactComponent as Copy } from '../../images/copy.svg';
import { ReactComponent as CloseIcon } from '../../images/closeIcon.svg';
import { ReactComponent as Success } from '../../images/successIcon.svg';

import Header from '../header/index';
import { TokenApprovalRequest, TokenCreationRequest, TokenBalanceOfRequest } from './steps';
// import { mock, mockSignatories, mockDefinitions } from './mock';

import './index.css';

const navSteps = {
  stepOne: 'stepOne',
  stepTwo: 'stepTwo',
  stepThree: 'stepThree',
};

const TokenPage = () => {
  const { tokenAddress } = useSelector(selectSession);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(navSteps.stepOne);
  const [error, setError] = useState(undefined);
  const [tokenInfo, setTokenInfo] = useState(initialTokenInfo);
  // token approval request
  const [approvalSuccess, setApprovalSuccess] = useState(true);
  const [approvalSubmit, setapprovalSubmit] = useState(false);
  // token balance of request
  const [accountBalance, setAccountBalance] = useState('');
  const [balanceOfSubmit, setbalanceOfSubmit] = useState(false);

  useEffect(() => {
    setTokenInfo({
      name: '',
      symbol: '',
      supply: '',
      address: tokenAddress,
      error: false,
      message: '',
      submit: false,
    });
  }, []);

  useEffect(() => {
    console.log(tokenInfo);
  }, [tokenInfo]);

  const reset = () => {
    setapprovalSubmit(false);
    setbalanceOfSubmit(false);
    setAccountBalance('');
    setError('');
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
      default:
    }
  };

  const steps = {
    stepOne: (
      <TokenCreationRequest
        setLoading={setLoading}
        setError={setError}
        error={error}
        loading={loading}
        setTokenInfo={setTokenInfo}
      />
    ),
    stepTwo: (
      <TokenApprovalRequest
        setLoading={setLoading}
        error={error}
        setError={setError}
        loading={loading}
        tokenInfo={tokenInfo}
        setApprovalSuccess={setApprovalSuccess}
        setapprovalSubmit={setapprovalSubmit}
      />
    ),
    stepThree: (
      <TokenBalanceOfRequest
        setLoading={setLoading}
        error={error}
        setError={setError}
        loading={loading}
        tokenInfo={tokenInfo}
        setAccountBalance={setAccountBalance}
        setbalanceOfSubmit={setbalanceOfSubmit}
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
      <div className={`recordContainer  ${tokenInfo?.error && !tokenInfo?.address ? 'error' : ''}`}>
        <div className="titleContainer">
          <div className="title">Token</div>
          {tokenInfo?.submit && iconValue(tokenInfo?.error && !!tokenInfo?.message)}
        </div>
        <div className={`contentCOntainer ${tokenInfo?.error ? 'error' : ''}`}>
          {tokenInfo?.address && (
            <div style={{ marginTop: '12px' }} className="content">
              <div className="title">
                {tokenInfo?.error && tokenInfo?.message ? (
                  'Warning! Error encountered during token creation'
                ) : (
                  <div>
                    Token Creation Request
                    <br />
                    Token ID
                  </div>
                )}
              </div>
              <div className="valueContainer">
                <div className="value">{shortenedAddress(tokenInfo?.address, 9)}</div>
                <Copy
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCopyClick(tokenInfo?.address)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    stepTwo: (
      <div className={`recordContainer  ${error && approvalSuccess ? 'error' : ''}`}>
        <div className="titleContainer">
          <div className="title">Token</div>
          {approvalSubmit && iconValue(error && approvalSuccess)}
        </div>
        <div className={`contentCOntainer ${error ? 'error' : ''}`}>
          {approvalSuccess && (
            <div style={{ marginTop: '12px' }} className="content">
              <div className="title">
                {tokenInfo?.error && tokenInfo?.message
                  ? 'Warning! Error encountered during token approval'
                  : 'Token Approval Request'}
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    stepThree: (
      <div className={`recordContainer  ${error && !accountBalance ? 'error' : ''}`}>
        <div className="titleContainer">
          <div className="title">Token</div>
          {balanceOfSubmit && iconValue(error && !!accountBalance)}
        </div>
        <div className={`contentCOntainer  ${error ? 'error' : ''}`}>
          <div className="content">
            <div className="title">
              {error && accountBalance ? (
                'Warning! Error encountered during contract execution'
              ) : (
                <div>
                  Balance Of Request
                  <br />
                  {accountBalance}
                </div>
              )}
            </div>
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
          <span className="title">Token</span>
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
                Approval
              </span>
            </button>
            <button
              onClick={() => {
                return onChangeStep(3);
              }}
              className={'navButton'}
            >
              <span
                style={{ textAlign: 'right', marginLeft: 'auto', paddingBottom: '8px' }}
                className={`${step === navSteps.stepThree && 'active'}`}
              >
                Balance Of
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
          {contentCOnteiner[step]}
        </div>
      </div>
    </>
  );
};

export default TokenPage;
