import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInstance } from 'utils/helpers';
import { selectUtils } from 'redux/utilsReducer';
import { selectSession } from '../../../redux/sessionReducer';
import getRule, { validationTxValue } from '../../../utils/validate';

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
  const { address: userWallet, agreementAddress} = useSelector(selectSession);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { provider } = useSelector(selectUtils);
  const navigate = useNavigate();

  const ExecutionSubmit = async () => {
    setLoading(true);
    try {
      const agreementContract = createInstance('Agreement', agreement, provider);
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

  return (
    <div className="updateRequest">
      <div className="title">Execution</div>
      <Spin spinning={loading}>
        <Form
          name="agreementRequestForm"
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
              defaultValue={agreementAddress.length>0?agreementAddress:agreement}
              onChange={(e) => {
                return setAgreement(e?.target?.value);
              }}
            />
          </Item>
          <div style={{ marginTop: '24px' }} className="text">
            ID
          </div>
          <Item name="dsl-id" validateTrigger="onBlur" rules={getRule('dsl-id', 'dsl-id', dslId)}>
            <InputNumber
              className="lander"
              defaultValue={dslId}
              onChange={(e) => {
                return setDslID(e);
              }}
            />
          </Item>
          <div style={{ marginTop: '24px' }} className="text">
            Transaction Value (in Wei)
          </div>
          <input
            onBlur={() => {
              return validationTxValue(txValue, setError, setErrorMessage, true);
            }}
            className={`ant-input lander ${error && 'ant-input-status-error'}`}
            onChange={(e) => {
              return setTxValue(e.target.value);
            }}
            value={String(txValue?.replace(/,/gi, '')).replace(/(.)(?=(\d{3})+$)/g, '$1,')}
          ></input>
          {error && <div className="ant-form-item-explain-error">{errorMessage}</div>}
          <div className="btnsContainer">
            <Button disabled={loading} style={{ height: '48px' }} htmlType="submit" className="btn">
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
