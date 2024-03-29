import { useState } from 'react';
import * as math from 'mathjs';
import { Button, Input, Form, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';
import { TransactionReceipt } from 'web3-core';
import { createInstance } from 'utils/helpers';
import { selectUtils } from '../../../../redux/utilsReducer';
import getRule from '../../../../utils/validate';
import { TokenApproval } from '../../../../types';

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
  const [, setErrorTransactionValue] = useState(false);
  const [spender, setSpender] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { utilsProvider } = useSelector(selectUtils);

  const tokenApproval = async () => {
    setLoading(true);
    try {
      if (!error) {
        const tokenContract = createInstance('ERC20PremintDecimals', tokenAddress, utilsProvider);
        // Check thet sender has anougth ERC20 tokens
        const amountWithDecimals = Number(amount).toLocaleString('fullwide', {
          useGrouping: false,
        });
        const accountBalance = await tokenContract.methods.balanceOf(account).call();
        if (Number(accountBalance) >= Number(amountWithDecimals)) {
          // Approve the account to spend ERC20 tokens
          const tx: TransactionReceipt = await tokenContract.methods
            .approve(spender, amountWithDecimals)
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
            message: 'insufficient funds',
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
              placeholder="ERC20 token address"
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
              placeholder="Spender address"
              defaultValue={spender}
              onChange={(e) => {
                return setSpender(e?.target?.value);
              }}
            />
          </Item>
          <div style={{ marginTop: '24px' }} className="text">
            Amount (with decimals)
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
              placeholder="Amount to approve with decimals"
              onChange={(e) => {
                if (e?.target?.value.length === 0 || e?.target?.value === '0') {
                  return;
                }

                try {
                  const normalValue = math.evaluate(e?.target?.value.replaceAll(',', ''));
                  form.validateFields(['value-in-wei']);
                  setAmount(normalValue);
                } catch (err) {
                  console.error(err);
                  setErrorTransactionValue(true);
                }
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
