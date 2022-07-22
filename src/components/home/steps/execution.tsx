/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable arrow-body-style */
import React from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
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
  agreement,
  setDslID,
  txValue, 
  dslId, 
  }) => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);
  const navigate = useNavigate();

  const ExecutionSubmit = async () => {
   try  {
    const agreementContract = await createInstance('Agreement', agreement, provider);
    const executeTx = await agreementContract.methods
      .execute(dslId)
      .send({ from: userWallet, value: txValue });
    console.log({ txHash: executeTx.transactionHash });
    setExecitionValue({hash:  executeTx.transactionHash, submit : true,  error: false, message:  ''})
   } catch (e) {
    console.dir(e)
    setExecitionValue({hash: '', submit: true, error: true, message: e?.message})
   }
  };

  return (
    <div className="updateRequest">
      <div className="title">Execution</div>
      <Form name="agreementRequestForm" autoComplete="off" onFinish={() => ExecutionSubmit()}>
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
        <Item name="dsl-id" validateTrigger="onBlur" rules={getRule('dsl-id', 'dsl-id', dslId)}>
          <InputNumber className="lander" defaultValue={dslId} onChange={(e) => setDslID(e)} />
        </Item>
        <div style={{ marginTop: '24px' }} className="text">
          Transaction Value (in Wei)
        </div>
        <Item
          name="tx-value"
          validateTrigger="onBlur"
          rules={getRule('tx-value', 'tx-value', txValue)}
        >
          <Input
            className="lander"
            defaultValue={txValue}
            onChange={(e) => {
              return setTxValue(e?.target?.value);
            }}
          />
        </Item>
        <div className="btnsContainer">
          <Button style={{ height: '48px' }} htmlType="submit" className="btn">
            Execute
          </Button>
          <Button onClick={() => navigate('/')} htmlType="button" className="cancel">
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ExecutionRequest;
