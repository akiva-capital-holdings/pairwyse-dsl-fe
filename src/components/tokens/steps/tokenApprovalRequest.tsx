import React, { useState } from 'react';
import { Button, Input, Form, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';
import { TransactionReceipt } from 'web3-core';
import { createInstance, getMultiplication } from 'utils/helpers';
import { selectUtils } from '../../../redux/utilsReducer';
import getRule from '../../../utils/validate';
import { TokenApproval } from '../../../types';

const { Item } = Form;

const TokenApprovalRequest = ({
  setLoading,
  error,
  loading,
  tokenInfo,
  setApprovalValue,
}: TokenApproval) => {
  const { account } = useMetaMask();
  const [tokenAddress, setTokenAddress] = useState(tokenInfo.address);
  const [errorTransactionValue, setErrorTransactionValue] = useState(false);
  const [spender, setSpender] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { utilsProvider } = useSelector(selectUtils);

  const tokenApproval = async () => {
    setLoading(true);
    try {
      if (!error) {
        const tokenContract = createInstance('Token', tokenAddress, utilsProvider);
        // Check thet sender has anougth ERC20 tokens
        const accountBalance = await tokenContract.methods.balanceOf(account).call();
        // Check current allowance
        const currentAllowance = await tokenContract.methods.allowance(account, spender).call();
        if (currentAllowance < amount && accountBalance >= amount) {
          // Approve the account to spend ERC20 tokens
          const tx: TransactionReceipt = await tokenContract.methods
            .approve(spender, amount)
            .send({ from: account });
          setApprovalValue({
            submit: true,
            hash: tx?.transactionHash,
            error: false,
            message: '',
          });
        } else {
          setApprovalValue({
            submit: true,
            hash: '',
            error: true,
            message: 'insufficient funds or the allowance has already been granted',
          });
        }
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setApprovalValue({
        submit: true,
        hash: '',
        error: true,
        message: e?.message,
      });
      setLoading(false);
    }
  };

  return (
    <div className="tokenApprovalRequest">
      <div className="title">Approval Request</div>
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
            Spender Address
          </div>
          <Item
            name="spenderAddress"
            validateTrigger="onBlur"
            rules={getRule('agreement', 'agreement', spender)}
          >
            <Input
              className="lender"
              defaultValue={spender}
              onChange={(e) => {
                return setSpender(e?.target?.value);
              }}
            />
          </Item>
          <div style={{ marginTop: '24px' }} className="text">
            Transaction Value (in Wei)
          </div>
          <Item
            name="approval-value-in-wei"
            validateTrigger="onBlur"
            rules={
              amount?.length === 0
                ? getRule('approval-value-in-wei', 'record-value', amount)
                : getRule('approval-value-in-wei', 'approval-value-in-wei', amount)
            }
          >
            <Input
              className="lender"
              onChange={(e) => {
                if (e?.target?.value.length === 0 || e?.target?.value === '0') {
                  return;
                }
                const normalValue = getMultiplication(
                  e?.target?.value.replace(/[\s.,%]/g, ''),
                  setErrorTransactionValue
                );
                if (!errorTransactionValue) {
                  form.validateFields(['approval-value-in-wei']).then(() => {
                    const valueFormatting = String(e?.target?.value.replace(/,/gi, '')).replace(
                      /(.)(?=(\d{3})+$)/g,
                      '$1,'
                    );
                    form.setFieldsValue({
                      'approval-value-in-wei': valueFormatting,
                    });
                  });
                }
                setAmount(normalValue);
              }}
            />
          </Item>
          <div className="btnsContainer">
            <Button disabled={loading} style={{ height: '48px' }} htmlType="submit" className="btn">
              Approve
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

export default TokenApprovalRequest;
