/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable arrow-body-style */
import React from 'react';
import { Button, Form, Input } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { createInstance } from 'utils/helpers';
// import { selectUtils } from 'redux/utilsReducer';
// import { Contract } from 'ethers';
import { selectSession } from '../../../redux/sessionReducer';
import getRule from '../../../utils/validate';

const { Item } = Form;

const ExecutionRequest = ({ setAgreement, agreement, setDslID, dslId }) => {
  const { address: userWallet } = useSelector(selectSession);
  //   const { provider } = useSelector(selectUtils);
  const navigate = useNavigate();

  const ExecutionSubmit = () => {
    console.log('request');
  };

  return (
    <div className="updateRequest">
      <div className="title">Execution</div>
      <Form name="agreementRequestForm" autoComplete="off" onFinish={() => ExecutionSubmit()}>
        <div style={{ marginTop: '24px' }} className="text">
          Requestor
        </div>
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
          <Input
            className="lander"
            defaultValue={dslId}
            onChange={(e) => {
              return setDslID(e?.target?.value);
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
