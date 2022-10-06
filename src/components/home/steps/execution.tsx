import { Button, Form, Menu, Space, Dropdown, Input, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInstance } from 'utils/helpers';
import { selectUtils } from 'redux/utilsReducer';
import { selectSession } from '../../../redux/sessionReducer';
import getRule from '../../../utils/validate';

const { Item } = Form;

const ExecutionRequest = ({
  setExecitionValue,
  setAgreement,
  setTxValue,
  setLoading,
  agreement,
  setDslID,
  txValue,
  loading,
  dslId,
}) => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);
  const [recordIds, setRecordIds] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [requiredRecirds, setRequiredRecirds] = useState([]);
  const [signatories, setSignatories] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const agreementContract = createInstance('Agreement', agreement, provider);
  const ExecutionSubmit = async () => {
    setLoading(true);
    try {
      const executeTx = await agreementContract.methods
        .execute(dslId)
        .send({ from: userWallet, value: txValue?.replace(/,/gi, '') });
      setExecitionValue({
        hash: executeTx.transactionHash,
        submit: true,
        error: false,
        message: '',
      });
    } catch (err) {
      console.error(err);
      setExecitionValue({ hash: '', submit: true, error: true, message: err?.message });
    }
    setLoading(false);
  };

  const GetRecordValues = async () => {
    try {
      const {
        txsConditions,
        txsRequiredRecords,
        txsSignatories,
        txsTransaction } = await agreementContract.methods.getRecord(dslId).call();
      setConditions(txsConditions);
      setRequiredRecirds(txsRequiredRecords);
      setSignatories(txsSignatories);
      setTransaction(txsTransaction);
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
            <button
              onClick={() => {
                return setDslID(v);
              }}
              type="button"
            >
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
          <div className="lander">There is no active records in the Agreement</div>
        ) : (
          <Dropdown className="dropdown" overlay={menu}>
            <Button>
              {dslId ?
                <Space>
                  {dslId}
                  <DownOutlined className="iconDropDown" />
                </Space> :
                <Space className="mainButton">
                  Select Record ID to execute
                  <DownOutlined className="iconDropDown" />
                </Space>}
            </Button>
          </Dropdown>
        )}
      </Item>
    );
  };
  function recordReview(){
    if (dslId) {
      return (
        <div>
          <div style={{ marginTop: '24px' }} className="text">Required Records</div>
          <div className="numTransactionCoontainer">
            {requiredRecirds?.map((el) => {
              return (
                <div key={el?.id} className="numTransaction">
                  <div className="textNum">{el}</div>
                </div>
              );
            })}
          </div>
          {signatories?.map((el, id) => {
              return (
                <div key={el?.id}>
                  <div style={{ marginTop: '24px' }} className="text">
                    Signatory {id+1}
                  </div>
                  <div className="value">{el}</div>
                </div>
              );
          })}
          {conditions?.map((el, id) => {
              return (
                <div key={el?.id}>
                  <div style={{ marginTop: '24px' }} className="text">
                    Condition {id+1}
                  </div>
                  <div className="lander">{el}</div>
                </div>
              );
          })}
          <div style={{ marginTop: '24px' }} className="text">
            Record Transaction
          </div>
          <div className="lander">{transaction}</div>
        </div>
      )
    } return false
  }
  useEffect(() => {
    GetActiveRecordIds();
  }, []);
  useEffect(() => {
    GetRecordValues();
  }, [dslId]);

  return (
    <div className="executeRequest">
      <div className="title">Execution</div>
      <Spin spinning={loading}>
        <Form
          name="agreementRequestForm"
          form={form}
          autoComplete="off"
          onFinish={() => {
            return ExecutionSubmit();
          }}
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
            {userWallet}
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
              className="lander"
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
            Transaction Value (in Wei)
          </div>
          <Item
            name="transaction-value-in-wei"
            validateTrigger="onChange"
            rules={
              txValue?.length === 0
                ? getRule('transaction-value-in-wei', 'tx-value', txValue)
                : getRule('transaction-value-in-wei', 'transaction-value-in-wei', txValue)
            }
          >
            <Input
              className={'ant-input lander'}
              onChange={(e) => {
                form.validateFields(['transaction-value-in-wei']).then(() => {
                  const valueFormatting = String(e?.target?.value.replace(/,/gi, '')).replace(
                    /(.)(?=(\d{3})+$)/g,
                    '$1,'
                  );
                  form.setFieldsValue({
                    'transaction-value-in-wei': valueFormatting,
                  });
                });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                setTxValue(e?.target?.value.replace(/[\s.,%]/g, ''));
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
            <Button
              onClick={() => {
                return navigate('/');
              }}
              htmlType="button"
              className="cancel"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default ExecutionRequest;
