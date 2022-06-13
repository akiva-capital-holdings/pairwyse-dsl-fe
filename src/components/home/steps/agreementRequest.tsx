/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { Form, Button, Menu, Dropdown, Space, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Contract } from 'ethers';
import getRule from '../../../utils/validate'
import { createInstance } from '../../../utils/helpers';
import { selectUtils } from '../../../redux/utilsReducer';
import { selectSession } from '../../../redux/sessionReducer';
import './index.css';


const {Item} = Form; 

const AgreementRequest = () => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);
  const [value, setValue] = useState(' ');
  const [lender, setLender] = useState('');
  const navigate = useNavigate();

  const createAgreement = async () => {
    const agrFactory: Contract = await createInstance(
      'AgreementFactory',
      `${process.env.REACT_APP_AGREEMENT_FACTORY}`,
      provider
    );

    const tx = await agrFactory.methods
      .deployAgreement(process.env.REACT_APP_PARSER)
      .send({ from: userWallet });
    console.log({ tx });

    const agrLen = parseInt(await agrFactory.methods.getDeployedLen().call(), 10);
    console.log({ agrLen });

    const lastAgrAddr = await agrFactory.methods.deployed(agrLen - 1).call();
    console.log({ lastAgrAddr });
  };

  const menu = (
    <Menu className="menu">
      <Menu.Item key="0">
        <button
          onClick={() => {
            return setValue('Lending agreement with capital stack');
          }}
          type="button"
        >
          Lending agreement with capital stack
        </button>
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );

  return (
    <div className="agreementRequest">
      <div className="title">Agreement Request </div>
      <Form name="agreementRequestForm" autoComplete="off" onFinish={createAgreement}>
        <div style={{ marginTop: '24px' }} className="text">
          Requestor
        </div>
        <div className="value">{userWallet}</div>
        <div style={{ marginTop: '24px' }} className="text">
          Requestor label
        </div>
        <Item name='lander' validateTrigger="onBlur" rules={getRule('lander')}>
          <Input
            className="lander"
            placeholder="Lender"
            value={lender}
            onChange={(e) => {
              return setLender(e?.target?.value);
            }}
          />
        </Item>
        <div style={{ marginTop: '24px' }} className="text">
          Agreement model{' '}
        </div>
        <Item name='agreementModel' validateTrigger="onBlur" rules={getRule('agreement model')}>
        <Dropdown overlay={menu}>
          <Button>
            <Space>
              {value}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        </Item>
        <div style={{ marginTop: '24px' }} className="text">
          Agreement template
        </div>
        <div className="value">
          {value === ' ' ? '' : '0x0000000000000000000000000000000000000000'}
        </div>
        <div className="btns">
          <div>
            <Button
              style={{ height: '48px', marginRight: '16px' }}
              htmlType="submit"
              className="btn"
            >
              Create Agreement
            </Button>
            <Button htmlType="button" className="btnSecondary">
              Validate Contract
            </Button>
          </div>
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
    </div>
  );
};

export default AgreementRequest;
