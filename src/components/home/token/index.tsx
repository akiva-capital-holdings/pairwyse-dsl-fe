import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { notification } from 'antd';
import { shortenedAddress } from '../../../utils/helpers';
import {
  initialTokenInfo,
  titleValueApprove,
  titleValueBalanceOf,
  initialTokenApprove,
  initialTokenAllowance,
  initialTokenBalanceOf,
  titleValueAllowance,
} from './initialValue';
import { selectSession } from '../../../redux/sessionReducer';
import { ReactComponent as Copy } from '../../../images/copy.svg';
import { ReactComponent as CloseIcon } from '../../../images/closeIcon.svg';
import { ReactComponent as Success } from '../../../images/successIcon.svg';

import Header from '../../header/index';
import {
  TokenApprovalRequest,
  TokenAllowanceRequest,
  TokenCreationRequest,
  TokenBalanceOfRequest,
} from './steps';

import './index.css';

const navSteps = {
  stepOne: 'stepOne',
  stepTwo: 'stepTwo',
  stepThree: 'stepThree',
  stepFour: 'stepFour',
};

const TokenPage = () => {
  const { tokenAddress } = useSelector(selectSession);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(navSteps.stepOne);
  const [error, setError] = useState(undefined);
  const [tokenInfo, setTokenInfo] = useState(initialTokenInfo);
  // token approval request
  const [approvalValue, setApprovalValue] = useState(initialTokenApprove);

  // token allowance sub-page
  const [allowanceValue, setAllowanceValue] = useState(initialTokenAllowance);

  // token balance of request
  const [balanceOfValue, setbalanceOfValue] = useState(initialTokenBalanceOf);

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

  const reset = () => {
    setError('');
    setApprovalValue(initialTokenApprove);
    setbalanceOfValue(initialTokenBalanceOf);
    setAllowanceValue(initialTokenAllowance);
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
        console.error('no step is selected');
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
        loading={loading}
        tokenInfo={tokenInfo}
        setApprovalValue={setApprovalValue}
      />
    ),
    stepThree: (
      <TokenAllowanceRequest
        setLoading={setLoading}
        error={error}
        loading={loading}
        tokenInfo={tokenInfo}
        setAllowanceValue={setAllowanceValue}
      />
    ),
    stepFour: (
      <TokenBalanceOfRequest
        setLoading={setLoading}
        error={error}
        loading={loading}
        tokenInfo={tokenInfo}
        setbalanceOfValue={setbalanceOfValue}
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

  const contentConteiner = {
    stepOne: (
      <div className={`recordContainer  ${tokenInfo?.error && !tokenInfo?.address ? 'error' : ''}`}>
        <div className="titleContainer">
          <div className="title">Token</div>
          {tokenInfo?.submit && iconValue(tokenInfo?.error && !!tokenInfo?.message)}
        </div>
        <div className={`contentContainer ${tokenInfo?.error ? 'error' : ''}`}>
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
      <div
        className={`recordContainer  ${
          approvalValue?.error && !approvalValue?.hash ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Token</div>
          {approvalValue?.submit && iconValue(approvalValue?.error && !!approvalValue?.message)}
        </div>
        <div className={`contentContainer  ${approvalValue?.error ? 'error' : ''}`}>
          <div className="content">
            <div className="title">
              {approvalValue?.error && approvalValue?.message
                ? 'Warning! Error encountered during contract execution'
                : titleValueApprove(!!approvalValue?.hash)}
            </div>
            {!!approvalValue?.hash && (
              <div className="valueContainer">
                <div className="value">{shortenedAddress(approvalValue?.hash, 9)}</div>
                <Copy
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCopyClick(approvalValue?.hash)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    stepThree: (
      <div
        className={`recordContainer  ${
          allowanceValue?.error && !allowanceValue?.value ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Token</div>
          {allowanceValue?.submit && iconValue(allowanceValue?.error && !!allowanceValue?.message)}
        </div>
        <div className={`contentContainer  ${allowanceValue?.error ? 'error' : ''}`}>
          <div className="content">
            <div className="title">
              {allowanceValue?.error && allowanceValue?.message
                ? 'Warning! Error encountered during contract execution'
                : titleValueAllowance(!!allowanceValue?.value)}
            </div>
            {!!allowanceValue?.value && (
              <div className="valueContainer">
                <div className="value">{allowanceValue?.value}</div>
                <Copy
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCopyClick(allowanceValue?.value)}
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
          balanceOfValue?.error && !balanceOfValue?.value ? 'error' : ''
        }`}
      >
        <div className="titleContainer">
          <div className="title">Token</div>
          {balanceOfValue?.submit && iconValue(balanceOfValue?.error && !!balanceOfValue?.message)}
        </div>
        <div className={`contentContainer  ${balanceOfValue?.error ? 'error' : ''}`}>
          <div className="content">
            <div className="title">
              {balanceOfValue?.error && balanceOfValue?.message
                ? 'Warning! Error encountered during contract execution'
                : titleValueBalanceOf(!!balanceOfValue?.value)}
            </div>
            {!!balanceOfValue?.value && (
              <div className="valueContainer">
                <div className="value">{balanceOfValue?.value}</div>
                <Copy
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCopyClick(balanceOfValue?.value)}
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
          <span className="title">Token</span>
          <div className="menu">
            {/* Step 1 */}
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

            {/* Step 2 */}
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

            {/* Step 3 */}
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
                Allowance
              </span>
            </button>

            {/* Step 4 */}
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
          {contentConteiner[step]}
        </div>
      </div>
    </>
  );
};

export default TokenPage;
