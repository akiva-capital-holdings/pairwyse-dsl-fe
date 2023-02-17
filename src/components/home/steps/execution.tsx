import { Button, Form, Menu, Space, Dropdown, Input, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInstance, hex4Bytes, splitDSLString, getWei, getTokenDetails } from 'utils/helpers';
import { selectUtils } from 'redux/utilsReducer';
import { useMetaMask } from 'metamask-react';
import { ethers } from 'ethers';
import { Execution, TransactionValues } from '../../../types';
import getRule from '../../../utils/validate';

const { Item } = Form;

const ExecutionRequest = ({
  setExecutionValue,
  setAgreement,
  setRecordValue,
  setLoading,
  agreementExecution,
  setDslID,
  rdValue,
  loading,
  dslId,
}: Execution) => {
  const { account } = useMetaMask();
  const { utilsProvider } = useSelector(selectUtils);
  const [recordIds, setRecordIds] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [requiredRecirds, setRequiredRecirds] = useState([]);
  const [signatories, setSignatories] = useState([]);
  const [transferFromError, setTransferFromError] = useState(false);
  const [record, setRecord] = useState('');
  const [transactionValue, setTransactionValue] = useState<TransactionValues>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const agreementContract = createInstance('Agreement', agreementExecution, utilsProvider);

  // If the record exists 'transferFrom' then auto-approve is activated
  const transferFromApprove = async (conditionOrRecord: string) => {
    const inputCode = splitDSLString(conditionOrRecord);
    const transferFromIndex = inputCode.indexOf('transferFrom');
    const isTransferFromPresentInInput = transferFromIndex !== -1;
    let tokenName: string;
    let tokenSymbol: string;
    let tokenDecimals: string;
    let tokenAddress: string;
    let fromName: string;
    let fromAddress: string;
    let toName: string;
    let toAddress: string;
    let targetAllowance: string;
    let currentAllowance: string;
    let isError: boolean;
    let targetAllowanceNoDecimals: string;
    let currentAllowanceNoDecimals: string;

    if (isTransferFromPresentInInput) {
      // Parse DSL input code and get the necessary variables
      tokenName = inputCode[transferFromIndex + 1];
      fromName = inputCode[transferFromIndex + 2];
      toName = inputCode[transferFromIndex + 3];
      targetAllowance = getWei(inputCode[transferFromIndex + 4], setTransferFromError);

      console.log(agreementContract._address);

      fromAddress = await agreementContract.methods.getStorageAddress(hex4Bytes(fromName)).call();
      toAddress = await agreementContract.methods.getStorageAddress(hex4Bytes(toName)).call();
      tokenAddress = await agreementContract.methods.getStorageAddress(hex4Bytes(tokenName)).call();

      const tokenContract = createInstance('Token', tokenAddress, utilsProvider);
      ({ tokenSymbol, tokenDecimals } = await getTokenDetails(tokenContract));
      currentAllowance = await tokenContract.methods
        .allowance(fromAddress, agreementContract._address)
        .call();

      targetAllowanceNoDecimals = ethers.utils.formatUnits(targetAllowance, tokenDecimals);
      currentAllowanceNoDecimals = ethers.utils.formatUnits(currentAllowance, tokenDecimals);

      if (fromAddress.toLowerCase() === account.toLowerCase()) {
        if (currentAllowance < targetAllowance) {
          // Approve the Agreement to spend ERC20 tokens
          await tokenContract.methods
            .approve(agreementContract._address, targetAllowance)
            .send({ from: fromAddress });
        }
      } else if (currentAllowance < targetAllowance) {
        isError = true;
        setTransactionValue({
          fromName,
          fromAddress,
          tokenName,
          tokenSymbol,
          tokenAddress,
          toName,
          toAddress,
          targetAllowance: targetAllowanceNoDecimals,
          currentAllowance: currentAllowanceNoDecimals,
          error: isError,
        });
      }
    }
    return {
      fromName,
      fromAddress,
      tokenName,
      tokenSymbol,
      tokenAddress,
      toName,
      toAddress,
      targetAllowance: targetAllowanceNoDecimals,
      currentAllowance: currentAllowanceNoDecimals,
      error: isError,
    };
  };

  const ExecutionSubmit = async () => {
    setLoading(true);
    try {
      const executeRecord = await agreementContract.methods
        .execute(dslId)
        .send({ from: account, value: rdValue?.replace(/,/gi, '') });
      setExecutionValue({
        hash: executeRecord.transactionHash,
        submit: true,
        error: false,
        message: '',
      });
    } catch (err) {
      console.error(err);
      setExecutionValue({ hash: '', submit: true, error: true, message: err?.message });
    }
    setLoading(false);
  };

  // A function that calls a modal window in the case when there are not enough tokens to execute the command
  function warningWindow() {
    const errorText: string = `The transaction may fail due to insufficient token allowance from
          ${transactionValue?.fromName} to AGREEMENT. Target allowance is
          ${transactionValue?.targetAllowance} ${transactionValue?.tokenSymbol}, \
while the current allowance is ${transactionValue?.currentAllowance} ${transactionValue?.tokenSymbol}`;
    return (
      <div
        className={transferFromError ? 'transactionWarningBack active' : 'transactionWarningBack'}
        onClick={() => {
          setTransferFromError(false);
        }}
      >
        <div className="transactionWarningContainer">
          {errorText}
          <div className="btnsContainer">
            <Button
              onClick={() => {
                ExecutionSubmit();
                setTransferFromError(false);
              }}
              style={{ height: '48px' }}
              htmlType="button"
              className="btn"
            >
              Proceed anyway
            </Button>
            <Button
              onClick={() => {
                setTransferFromError(false);
              }}
              htmlType="button"
              className="cancel"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Сhecking for the presence of the "TransferFrom" in the condition or transaction.
  // if "TransferFrom" present => Execute the autoApprove "TransferFrom" command and transaction
  // if "TransferFrom" upsent => Execute only transaction
  const preExecute = async () => {
    let transferFromErrors = false;
    conditions.forEach(async (value) => {
      if ((await transferFromApprove(value)).error) {
        transferFromErrors = (await transferFromApprove(value)).error;
        setTransferFromError(true);
      }
    });
    if ((await transferFromApprove(record)).error) {
      transferFromErrors = (await transferFromApprove(record)).error;
      setTransferFromError(true);
    }
    if (!transferFromErrors) {
      ExecutionSubmit();
      setTransferFromError(false);
    }
  };

  const GetRecordValues = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { _requiredRecords, _signatories, _conditions, _record } =
        await agreementContract.methods.getRecord(dslId).call();
      console.log({
        _requiredRecords,
        _signatories,
        _conditions,
        _record,
      });
      setConditions(_conditions);
      setRequiredRecirds(_requiredRecords);
      if (_signatories[0] === '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF') {
        setSignatories(['ANYONE']);
      } else {
        setSignatories(_signatories);
      }
      setRecord(_record);
    } catch (err) {
      console.error(err);
    }
  };

  const GetActiveRecordIds = async () => {
    try {
      const array = await agreementContract.methods.getActiveRecords().call();
      setRecordIds(array);
    } catch (err) {
      console.error(err);
    }
  };

  const menu = (
    <Menu className="menu">
      {recordIds.map((v, i) => {
        return (
          <Menu.Item key={i}>
            <button onClick={() => setDslID(v)} type="button">
              {v}
            </button>
          </Menu.Item>
        );
      })}
      <Menu.Divider />
    </Menu>
  );

  const dropDown = () => {
    return (
      <Item name="agreementModel">
        {recordIds.length === 0 ? (
          <div className="lender">There is no active records in the Agreement</div>
        ) : (
          <Dropdown className="dropdown" overlay={menu}>
            <Button>
              {dslId ? (
                <Space>
                  {dslId}
                  <DownOutlined className="iconDropDown" />
                </Space>
              ) : (
                <Space className="mainButton">
                  Select Record ID to execute
                  <DownOutlined className="iconDropDown" />
                </Space>
              )}
            </Button>
          </Dropdown>
        )}
      </Item>
    );
  };

  function recordReview() {
    if (dslId) {
      return (
        <div>
          <div style={{ marginTop: '24px' }} className="text">
            Required Records
          </div>
          <div className="numRecordCoontainer">
            {requiredRecirds.length === 0 ? (
              <div className="numRecord">
                <div className="textNum">None</div>
              </div>
            ) : (
              requiredRecirds?.map((el, elId) => {
                return (
                  <div key={elId} className="numRecord">
                    <div className="textNum">{el}</div>
                  </div>
                );
              })
            )}
          </div>
          {signatories?.map((el, elId) => {
            return (
              <div key={elId}>
                <div style={{ marginTop: '24px' }} className="text">
                  Signatory {elId + 1}
                </div>
                <div className="value">{el}</div>
              </div>
            );
          })}
          {conditions?.map((el, elId) => {
            return (
              <div key={elId}>
                <div style={{ marginTop: '24px' }} className="text">
                  Condition {elId + 1}
                </div>
                <div className="lender text">{el}</div>
              </div>
            );
          })}
          <div style={{ marginTop: '24px' }} className="text">
            Create a Transaction
          </div>
          <div className="lender text">{record}</div>
        </div>
      );
    }
    return false;
  }

  useEffect(() => {
    GetActiveRecordIds();
  }, []);
  useEffect(() => {
    GetActiveRecordIds();
  }, [agreementExecution]);

  useEffect(() => {
    if (dslId) {
      GetRecordValues();
    }
  }, [dslId]);

  return (
    <div className="executeRequest">
      <div className="title">Execution</div>
      <Spin spinning={loading}>
        <Form
          name="agreementRequestForm"
          form={form}
          autoComplete="off"
          onFinish={() => preExecute()}
        >
          <div className="text">Requestor</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
            className="value"
          >
            {account}
          </div>
          <div style={{ marginTop: '24px' }} className="text">
            Agreement
          </div>
          <Item
            name="agreement"
            validateTrigger="onBlur"
            rules={getRule('agreement', 'agreement', agreementExecution)}
          >
            <Input
              className="lender"
              defaultValue={agreementExecution}
              onChange={(e) => {
                return setAgreement(e?.target?.value);
              }}
            />
          </Item>
          <div style={{ marginTop: '24px' }} className="text">
            ID
          </div>
          {dropDown()}
          {recordReview()}
          <div style={{ marginTop: '24px' }} className="text">
            Transaction Value (in Wei)
          </div>
          <Item
            name="record-value-in-wei"
            validateTrigger="onChange"
            rules={
              rdValue?.length === 0
                ? getRule('record-value-in-wei', 'record-value', rdValue)
                : getRule('record-value-in-wei', 'record-value-in-wei', rdValue)
            }
          >
            <Input
              className="lender"
              onChange={(e) => {
                if (e?.target?.value.length === 0 || e?.target?.value === '0') {
                  return;
                }
                const normalValue = getWei(
                  e?.target?.value.replace(/[\s.,%]/g, ''),
                  setTransferFromError
                );
                console.log(normalValue);
                if (!transferFromError) {
                  form.validateFields(['record-value-in-wei']).then(() => {
                    const valueFormatting = String(e?.target?.value.replace(/,/gi, '')).replace(
                      /(.)(?=(\d{3})+$)/g,
                      '$1,'
                    );
                    form.setFieldsValue({
                      'record-value-in-wei': valueFormatting,
                    });
                  });
                }
                setRecordValue(normalValue);
              }}
            />
          </Item>
          <div className="btnsContainer">
            <Button
              disabled={dslId === ''}
              style={{ height: '48px' }}
              htmlType="submit"
              className="btn"
            >
              Execute
            </Button>
            <Button onClick={() => navigate('/')} htmlType="button" className="cancel">
              Cancel
            </Button>
          </div>
        </Form>
      </Spin>
      {warningWindow()}
    </div>
  );
};

export default ExecutionRequest;
