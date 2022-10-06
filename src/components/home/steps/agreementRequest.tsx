import { useEffect } from 'react';
import Web3 from 'web3';
import { Form, Button, Menu, Dropdown, Space, Input, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getContractABI, getContractBytecode } from 'utils/helpers';
import getRule, { validationAgreementModel } from '../../../utils/validate';
import { selectUtils } from '../../../redux/utilsReducer';
import { selectSession, changeAgreementAddress } from '../../../redux/sessionReducer';
import './index.css';

// TODO: in all project `"lander" -> "lender"`

const { Item } = Form;

const AgreementRequest = ({
  setLoading,
  setLender,
  setError,
  setValue,
  loading,
  lender,
  error,
  value,
  setValueAgreementRequest,
}) => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils) as { provider: Web3 };
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const createAgreement = async () => {
    setLoading(true);
    try {
      if (!error) {
        // @ts-ignore
        const agreementInstance = new provider.eth.Contract(getContractABI('Agreement'));

        let recordHash = '';
        agreementInstance
          .deploy({
            data: getContractBytecode('Agreement'),
            arguments: [
              process.env.REACT_APP_PARSER,
              userWallet, // msg.sender would be the simulation of multisig wallet
            ],
          })
          .send({ from: userWallet })
          .on('error', (err) => {
            console.error({ err });
          })
          .on('transactionHash', (rdHash) => {
            recordHash = rdHash;
            // console.log({ recordHash });
          })
          // .on('receipt', (receipt) => {
          //   // contains the new contract address
          //   console.log({ agreementAddr: receipt.contractAddress });
          // })
          .then((newContractInstance) => {
            setValueAgreementRequest({
              lastAgrAddr: newContractInstance.options.address,
              error: false,
              hash: recordHash,
              submit: true,
            });
            dispatch(changeAgreementAddress(newContractInstance.options.address));
            setLoading(false);
          });
      }
    } catch (e) {
      console.error(e);
      setValueAgreementRequest({ lastAgrAddr: '', error: true, message: e?.message, submit: true });
      setLoading(false);
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
      <Spin spinning={loading}>
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
                disabled={loading}
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
      </Spin>
    </div>
  );
};

export default AgreementRequest;
