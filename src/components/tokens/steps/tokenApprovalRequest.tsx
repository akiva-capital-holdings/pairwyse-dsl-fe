import React, { useState } from 'react';
import {
  Button,
  Input,
  Form,
  Spin,
  //  Dropdown, Menu, Space
} from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';
import { createInstance } from 'utils/helpers';
import { selectUtils } from '../../../redux/utilsReducer';
import getRule from '../../../utils/validate';
import { TokenApproval } from '../../../types';

const { Item } = Form;

const TokenApprovalRequest = ({
  setLoading,
  error,
  loading,
  tokenInfo,
  setApprovalSuccess,
  setapprovalSubmit,
}: TokenApproval) => {
  const { account } = useMetaMask();
  const [tokenAddress, setTokenAddress] = useState(tokenInfo.address);
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
        const accountBalance = await tokenContract.methods.balanceOf(account).call();

        const currentAllowance = await tokenContract.methods.allowance(account, spender).call();
        if (currentAllowance < amount && accountBalance >= amount) {
          // Approve the Agreement to spend ERC20 tokens
          await tokenContract.methods.approve(spender, amount).send({ from: account });
          setapprovalSubmit(true);
          setApprovalSuccess(true);
        }
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setapprovalSubmit(true);
      setApprovalSuccess(false);
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
            validateTrigger="onChange"
            rules={
              amount?.length === 0
                ? getRule('approval-value-in-wei', 'record-value', amount)
                : getRule('approval-value-in-wei', 'approval-value-in-wei', amount)
            }
          >
            <Input
              className="lender"
              onChange={(e) => {
                form.validateFields(['approval-value-in-wei']).then(() => {
                  const valueFormatting = String(e?.target?.value.replace(/,/gi, '')).replace(
                    /(.)(?=(\d{3})+$)/g,
                    '$1,'
                  );
                  form.setFieldsValue({
                    'approval-value-in-wei': valueFormatting,
                  });
                });
                setAmount(e?.target?.value.replace(/[\s.,%]/g, ''));
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
