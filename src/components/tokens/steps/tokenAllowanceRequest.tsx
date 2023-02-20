import { useState } from 'react';
import { Button, Input, Form, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';
import { ethers } from 'ethers';
import { createInstance, getTokenDetails } from 'utils/helpers';
import { selectUtils } from '../../../redux/utilsReducer';
import getRule from '../../../utils/validate';
import { TokenAllowance } from '../../../types';

const { Item } = Form;

const TokenAllowanceRequest = ({
  setLoading,
  error,
  loading,
  tokenInfo,
  setAllowanceValue,
}: TokenAllowance) => {
  const { account } = useMetaMask();
  const [tokenAddress, setTokenAddress] = useState(tokenInfo.address);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [spenderAddress, setSpenderAddress] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { utilsProvider } = useSelector(selectUtils);

  const tokenApproval = async () => {
    setLoading(true);
    let tokenDecimals: string;
    try {
      if (!error) {
        const tokenContract = createInstance('Token', tokenAddress, utilsProvider);
        ({ tokenDecimals } = await getTokenDetails(tokenContract));

        const allowance = await tokenContract.methods
          .allowance(ownerAddress, spenderAddress)
          .call();
        const targetAllowanceNoDecimals = ethers.utils.formatUnits(allowance, tokenDecimals);
        setAllowanceValue({
          value: targetAllowanceNoDecimals,
          submit: true,
          error: false,
          message: '',
        });
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setAllowanceValue({
        value: '',
        submit: true,
        error: true,
        message: e?.message,
      });
      setLoading(false);
    }
  };

  return (
    <div className="token tokenAllowanceRequest">
      <div className="title">Allowance Request</div>
      <Spin spinning={loading}>
        <Form
          name="tokenCreationRequestForm"
          form={form}
          autoComplete="off"
          onFinish={tokenApproval}
        >
          <div className="text">Requestor</div>
          <div className="value">{account}</div>

          {/* Token */}
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

          {/* Owner */}
          <div style={{ marginTop: '24px' }} className="text">
            Owner Address
          </div>
          <Item
            name="ownerAddress"
            validateTrigger="onBlur"
            rules={getRule('agreement', 'agreement', ownerAddress)}
          >
            <Input
              className="lender"
              defaultValue={ownerAddress}
              onChange={(e) => {
                return setOwnerAddress(e?.target?.value);
              }}
            />
          </Item>

          {/* Spender */}
          <div style={{ marginTop: '24px' }} className="text">
            Spender Address
          </div>
          <Item
            name="spenderAddress"
            validateTrigger="onBlur"
            rules={getRule('agreement', 'agreement', spenderAddress)}
          >
            <Input
              className="lender"
              defaultValue={spenderAddress}
              onChange={(e) => {
                return setSpenderAddress(e?.target?.value);
              }}
            />
          </Item>

          <div className="btnsContainer">
            <Button disabled={loading} style={{ height: '48px' }} htmlType="submit" className="btn">
              Get Allowance
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

export default TokenAllowanceRequest;
