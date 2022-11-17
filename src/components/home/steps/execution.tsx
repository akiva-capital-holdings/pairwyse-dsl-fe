import { Button, Form, Menu, Space, Dropdown, Input, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInstance, hex4Bytes } from 'utils/helpers';
import { selectUtils } from 'redux/utilsReducer';
import { useMetaMask } from 'metamask-react';
import { Execution } from '../../../types';
import getRule from '../../../utils/validate';

const { Item } = Form;

const ExecutionRequest = ({
  setExecutionValue,
  setAgreement,
  setRecordValue,
  setLoading,
  agreement,
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
  const agreementContract = createInstance('Agreement', agreement, utilsProvider);

  type TransactionValues = {
    fromName: string;
    fromAddress: string;
    tokenName: string;
    tokenAddress: string;
    toName: string;
    toAddress: string;
    amount: string;
    isAllowance: string;
    error: boolean;
  };

  // Convert string of record to array of string
  const splitDSLString = (expr: string) =>
    expr
      .replaceAll('(', '@(@')
      .replaceAll(')', '@)@')
      .split(/[@ \n]/g)
      .filter((x: string) => !!x);

  // If the record exists 'transferFrom' then auto-approve is activated
  const transferFromApprove = async (conditionOrRecord: string) => {
    const inputCode = splitDSLString(conditionOrRecord);
    const transferFromIndex = inputCode.indexOf('transferFrom');
    const isTransferFromPresentInInput = transferFromIndex !== -1;
    let token: string;
    let tokenAddress: string;
    let from: string;
    let fromAddress: string;
    let to: string;
    let toAddress: string;
    let amount: string;
    let isAllowance: string;

    if (isTransferFromPresentInInput) {
      // Parse DSL input code and get the necessary variables
      token = inputCode[transferFromIndex + 1];
      from = inputCode[transferFromIndex + 2];
      to = inputCode[transferFromIndex + 3];
      amount = inputCode[transferFromIndex + 4];
      fromAddress = await agreementContract.methods.getStorageAddress(hex4Bytes(from)).call();
      toAddress = await agreementContract.methods.getStorageAddress(hex4Bytes(to)).call();
      tokenAddress = await agreementContract.methods.getStorageAddress(hex4Bytes(token)).call();
      const tokenContract = createInstance('Token', tokenAddress, utilsProvider);
      isAllowance = await tokenContract.methods.allowance(account, toAddress).call();
      if (fromAddress.toLowerCase() === account.toLowerCase()) {
        if (isAllowance < amount) {
          // Approve the Agreement to spend ERC20 tokens
          await tokenContract.methods.approve(toAddress, amount).send({ from: fromAddress });
        }
      } else if (isAllowance < amount) {
        setTransferFromError(true);
        setTransactionValue({
          fromName: from,
          fromAddress,
          tokenName: token,
          tokenAddress,
          toName: to,
          toAddress,
          amount,
          isAllowance,
          error: true,
        });
        return {
          fromName: from,
          fromAddress,
          tokenName: token,
          tokenAddress,
          toName: to,
          toAddress,
          amount,
          isAllowance,
          error: true,
        };
      }
    }
    return {
      fromName: from,
      fromAddress,
      tokenName: token,
      tokenAddress,
      toName: to,
      toAddress,
      amount,
      isAllowance,
      error: false,
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

  function warningWindow() {
    return (
      <div
        className={transferFromError ? 'transactionWarningBack active' : 'transactionWarningBack'}
        onClick={() => {
          setTransferFromError(false);
        }}
      >
        <div className="transactionWarningContainer">
          The transaction may fail due to insufficient token allowance from{' '}
          {transactionValue?.fromName} to {transactionValue?.toName}. Target allowance is{' '}
          {transactionValue?.amount}, while the current allowance is {transactionValue?.isAllowance}
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

  const preExecute = async () => {
    let transferFromErrors = false;
    conditions.forEach(async (value) => {
      if ((await transferFromApprove(value)).error) {
        transferFromErrors = (await transferFromApprove(value)).error;
      }
    });
    if ((await transferFromApprove(record)).error) {
      transferFromErrors = (await transferFromApprove(record)).error;
    }
    if (transferFromErrors) {
      ExecutionSubmit();
    }
  };

  const GetRecordValues = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { _requiredRecords, _signatories, _conditions, _transaction } =
        await agreementContract.methods.getRecord(dslId).call();
      setConditions(_conditions);
      setRequiredRecirds(_requiredRecords);
      setSignatories(_signatories);
      setRecord(_transaction);
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
            {requiredRecirds?.map((el, elId) => {
              return (
                <div key={elId} className="numRecord">
                  <div className="textNum">{el}</div>
                </div>
              );
            })}
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
                <div className="lender">{el}</div>
              </div>
            );
          })}
          <div style={{ marginTop: '24px' }} className="text">
            Create a Record
          </div>
          <div className="lender">{record}</div>
        </div>
      );
    }
    return false;
  }

  useEffect(() => {
    GetActiveRecordIds();
  }, []);

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
            rules={getRule('agreement', 'agreement', agreement)}
          >
            <Input
              className="lender"
              defaultValue={agreement}
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
            Record Value (in Wei)
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
                form.validateFields(['record-value-in-wei']).then(() => {
                  const valueFormatting = String(e?.target?.value.replace(/,/gi, '')).replace(
                    /(.)(?=(\d{3})+$)/g,
                    '$1,'
                  );
                  form.setFieldsValue({
                    'record-value-in-wei': valueFormatting,
                  });
                });
                setRecordValue(e?.target?.value.replace(/[\s.,%]/g, ''));
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
