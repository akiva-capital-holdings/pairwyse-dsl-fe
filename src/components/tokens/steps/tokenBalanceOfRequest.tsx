import React, { useState } from 'react';
import { Button, Input, Form, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';
import { createInstance } from 'utils/helpers';
import { selectUtils } from '../../../redux/utilsReducer';
import getRule from '../../../utils/validate';
import { TokenBalanceOf } from '../../../types';

const { Item } = Form;

const TokenBalanceOfRequest = ({
  setLoading,
  error,
  loading,
  tokenInfo,
  setbalanceOfValue,
}: TokenBalanceOf) => {
  const { account } = useMetaMask();
  const [tokenAddress, setTokenAddress] = useState(tokenInfo.address);
  const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { utilsProvider } = useSelector(selectUtils);

  const tokenApproval = async () => {
    setLoading(true);
    try {
      if (!error) {
        const tokenContract = createInstance('Token', tokenAddress, utilsProvider);
        const tx = await tokenContract.methods.balanceOf(walletAddress).call();
        setbalanceOfValue({
          value: tx,
          submit: true,
          error: false,
          message: '',
        });
        console.log(tx);
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setbalanceOfValue({
        value: '',
        submit: true,
        error: true,
        message: e?.message,
      });
      setLoading(false);
    }
  };

  return (
    <div className="tokenBalanceOfRequest">
      <div className="title">Balance Of Request</div>
      <Spin spinning={loading}>
        <Form
          name="tokenCreationRequestForm"
          form={form}
          autoComplete="off"
          onFinish={tokenApproval}
        >
          <div className="text">Requestor</div>
          <div className="value">{account}</div>
          <div style={{ marginTop: '24px' }} className="text">
            Token Address
          </div>
          <Item
            name="tokenAddress"
            validateTrigger="onBlur"
            rules={getRule('agreement', 'agreement', tokenAddress)}
          >
            <Input
              className="lender"
              defaultValue={tokenAddress}
              onChange={(e) => {
                return setTokenAddress(e?.target?.value);
              }}
            />
          </Item>
          <div style={{ marginTop: '24px' }} className="text">
            Wallet Address
          </div>
          <Item
            name="spenderAddress"
            validateTrigger="onBlur"
            rules={getRule('agreement', 'agreement', walletAddress)}
          >
            <Input
              className="lender"
              defaultValue={walletAddress}
              onChange={(e) => {
                return setWalletAddress(e?.target?.value);
              }}
            />
          </Item>
          <div className="btnsContainer">
            <Button disabled={loading} style={{ height: '48px' }} htmlType="submit" className="btn">
              Get Balance
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

export default TokenBalanceOfRequest;
