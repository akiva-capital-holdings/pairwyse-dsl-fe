import React, { useEffect } from 'react';
import { Form, Button, Menu, Dropdown, Space, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Contract } from 'ethers';
import getRule, { validationAgreementModel } from '../../../utils/validate';
import { createInstance } from '../../../utils/helpers';
import { selectUtils } from '../../../redux/utilsReducer';
import { selectSession } from '../../../redux/sessionReducer';
import './index.css';

const { Item } = Form;

const AgreementRequest = ({
  setLender,
  setError,
  setValue,
  lender,
  error,
  value,
  setValueAgreementRequest,
}) => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);

  const navigate = useNavigate();

  const createAgreement = async () => {
    try {
      if (!error) {
        const agrFactory: Contract = await createInstance(
          'AgreementFactory',
          `${process.env.REACT_APP_AGREEMENT_FACTORY}`,
          provider
        );
        const tx: { transactionHash: string } = await agrFactory.methods
          .deployAgreement(process.env.REACT_APP_PARSER)
          .send({ from: userWallet });
        console.log(tx, agrFactory);

        const agrLen = parseInt(await agrFactory.methods.getDeployedAgreementsLen().call(), 10);
        console.log(agrLen);
        const lastAgrAddr = await agrFactory.methods.deployedAgreements(agrLen - 1).call();
        console.log('submoit', error);
        setValueAgreementRequest({
          lastAgrAddr,
          error: false,
          hash: tx?.transactionHash,
          submit: true,
        });
      }
    } catch (e) {
      console.log('catch');
      console.dir(e);
      setValueAgreementRequest({ lastAgrAddr: '', error: true, message: e?.message, submit: true });
    }
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

  const dropDown = () => {
    return (
      <Item name="agreementModel">
        <Dropdown className="dropdown" overlay={menu}>
          <Button className={error && 'ant-input-status-error'}>
            <Space>
              {value}
              <DownOutlined className="iconDropDown" />
            </Space>
          </Button>
        </Dropdown>
        <span className="ant-form-item-explain-error">{error}</span>
      </Item>
    );
  };
  useEffect(() => {
    if (error) {
      validationAgreementModel(value, setError);
    }
    dropDown();
  }, [value]);

  return (
    <div className="agreementRequest">
      <div className="title">Agreement Request </div>
      <Form name="agreementRequestForm" autoComplete="off" onFinish={createAgreement}>
        <div className="text">Requestor</div>
        <div className="value">{userWallet}</div>
        <div style={{ marginTop: '24px' }} className="text">
          Requestor label
        </div>
        <Item name="lander" validateTrigger="onBlur" rules={getRule('lander', 'lander', lender)}>
          <Input
            className="lander"
            placeholder="Lender"
            defaultValue={lender}
            onChange={(e) => {
              return setLender(e?.target?.value);
            }}
          />
        </Item>
        <div style={{ marginTop: '24px' }} className="text">
          Agreement model{' '}
        </div>
        {dropDown()}
        <div style={{ marginTop: '24px' }} className="text">
          Agreement template
        </div>
        <div className="value">
          {value === ' ' ? '' : '0x0000000000000000000000000000000000000000'}
        </div>
        <div className="btns">
          <div style={{ display: 'flex' }}>
            <Button
              style={{ height: '48px', marginRight: '16px' }}
              htmlType="submit"
              className="btn"
              onClick={() => {
                return validationAgreementModel(value, setError);
              }}
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
