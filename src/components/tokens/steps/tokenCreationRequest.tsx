import { useState } from 'react';
import { Form, Button, Input, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';
import { getContractABI, getContractBytecode, getMultiplication } from 'utils/helpers';
import { Contract } from 'ethers';
import getRule, { validationAgreementModel } from '../../../utils/validate';
import { changeTokenAddress } from '../../../redux/sessionReducer';
import { selectUtils } from '../../../redux/utilsReducer';
import { Token } from '../../../types';
import './index.css';

const { Item } = Form;

const TokenCreationRequest = ({ setLoading, error, setError, loading, setTokenInfo }: Token) => {
  const { account } = useMetaMask();
  const { utilsProvider } = useSelector(selectUtils);
  const [tokenName, setTokenName] = useState<string>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();
  const [tokenSupply, setTokenSupply] = useState<string>();
  const [tokenDecimal, setTokenDecimal] = useState<string>();
  const [errorTransactionValue, setErrorTransactionValue] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createToken = async () => {
    setLoading(true);
    try {
      if (!error) {
        const tokenInstance = new utilsProvider.eth.Contract(getContractABI('Token'));
        const tokenSypplyInWei = (Number(tokenSupply) * Number(1e18)).toLocaleString('fullwide', {
          useGrouping: false,
        });
        tokenInstance
          .deploy({
            data: getContractBytecode('Token'),
            arguments: [tokenName, tokenSymbol, tokenSypplyInWei, tokenDecimal],
          })
          .send({ from: account })
          .on('error', (err) => {
            console.error({ err });
          })
          .then((newTokenInstance: Contract) => {
            setTokenInfo({
              name: tokenName,
              symbol: tokenSymbol,
              supply: tokenSypplyInWei,
              address: newTokenInstance.options.address,
              error: false,
              message: '',
              submit: true,
            });
            dispatch(changeTokenAddress(newTokenInstance.options.address));
            setLoading(false);
          });
      }
    } catch (e) {
      console.error(e);
      setTokenInfo({
        name: '',
        symbol: '',
        supply: '',
        address: '',
        error: true,
        message: e?.message,
        submit: true,
      });
      setLoading(false);
    }
  };

  // Token creator
  const tokenFields = () => {
    return (
      <div>
        <div style={{ marginTop: '24px' }} className="text">
          Token name
        </div>
        <Item
          name="tokenName"
          validateTrigger="onBlur"
          rules={getRule('tokenName', 'lender', tokenName)}
        >
          <Input
            className="lender"
            placeholder="Enter name of Token"
            defaultValue={tokenName}
            onChange={(e) => {
              return setTokenName(e?.target?.value);
            }}
          />
        </Item>
        <div style={{ marginTop: '24px' }} className="text">
          Token symbol
        </div>
        <Item
          name="tokenSymbol"
          validateTrigger="onBlur"
          rules={getRule('tokenSymbol', 'lender', tokenSymbol)}
        >
          <Input
            className="lender"
            placeholder="Enter symbol of Token"
            defaultValue={tokenSymbol}
            onChange={(e) => {
              return setTokenSymbol(e?.target?.value);
            }}
          />
        </Item>
        <div style={{ marginTop: '24px' }} className="text">
          Decimal place
        </div>
        <Item
          name="token-decimal"
          validateTrigger="onChange"
          rules={
            tokenSupply?.length === 0
              ? getRule('token-decimal', 'record-value', tokenDecimal)
              : getRule('token-decimal', 'decimal-value', tokenDecimal)
          }
        >
          <Input
            className="lender"
            onChange={(e) => {
              setTokenDecimal(e?.target?.value);
            }}
          />
        </Item>
        <div style={{ marginTop: '24px' }} className="text">
          Token supply
        </div>
        <Item
          name="value-in-wei"
          validateTrigger="onBlur"
          rules={
            tokenSupply?.length === 0
              ? getRule('value-in-wei', 'record-value', tokenSupply)
              : getRule('value-in-wei', 'record-value-in-wei', tokenSupply)
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
                form.validateFields(['value-in-wei']).then(() => {
                  const valueFormatting = String(e?.target?.value.replace(/,/gi, '')).replace(
                    /(.)(?=(\d{3})+$)/g,
                    '$1,'
                  );
                  form.setFieldsValue({
                    'value-in-wei': valueFormatting,
                  });
                });
              }
              setTokenSupply(normalValue);
            }}
          />
        </Item>
      </div>
    );
  };

  return (
    <div className="tokenCreationRequest">
      <div className="title">Token Creation Request</div>
      <Spin spinning={loading}>
        <Form name="tokenCreationRequestForm" form={form} autoComplete="off" onFinish={createToken}>
          <div className="text">Requestor</div>
          <div style={{ marginBottom: '24px' }} className="value">
            {account}
          </div>
          {tokenFields()}
          <div className="btns">
            <div style={{ display: 'flex' }}>
              <Button
                style={{ height: '48px', marginRight: '16px' }}
                disabled={loading}
                htmlType="submit"
                className="btn"
                onClick={() => {
                  return validationAgreementModel(tokenName, setError);
                }}
              >
                Create Token
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

export default TokenCreationRequest;
