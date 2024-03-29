import { useEffect, useState } from 'react';
import { Form, Button, Menu, Dropdown, Space, Input, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';
import { getContractABI, getContractBytecode } from 'utils/helpers';
import { Contract } from 'ethers';
import getRule, { validationAgreementModel } from '../../../../utils/validate';
import { selectUtils } from '../../../../redux/utilsReducer';
import { changeAgreementAddress, changeContractType } from '../../../../redux/sessionReducer';
import { Agreement } from '../../../../types';
import './index.css';

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
  setTokenInfo,
  agreementCreator,
  setAgreementCreator,
  multiTrancheCreator,
  setMultiTrancheCreator,
  tokenCreator,
  setTokenCreator,
  setValueMultiTrancheRequest,
}: Agreement) => {
  const { account } = useMetaMask();
  const { utilsProvider } = useSelector(selectUtils);
  const [creatorValue, setCreatorValue] = useState<string>();
  const [tokenName, setTokenName] = useState<string>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();
  const [tokenSupply, setTokenSupply] = useState<string>();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createAgreement = async () => {
    if (agreementCreator) {
      setLoading(true);
      try {
        if (!error) {
          const agreementInstance = new utilsProvider.eth.Contract(getContractABI('Agreement'));
          let recordHash = '';
          agreementInstance
            .deploy({
              data: getContractBytecode('Agreement'),
              arguments: [
                process.env.REACT_APP_PARSER,
                account, // msg.sender would be the simulation of multisig wallet
                process.env.REACT_APP_DSL_CONTEXT,
              ],
            })
            .send({ from: account })
            .on('error', (err) => {
              console.error({ err });
            })
            .on('transactionHash', (_recordHash: string) => {
              recordHash = _recordHash;
            })
            .then((newContractInstance: Contract) => {
              setValueAgreementRequest({
                lastAgrAddr: newContractInstance.options.address,
                error: false,
                hash: recordHash,
                message: '',
                submit: true,
              });
              dispatch(changeAgreementAddress(newContractInstance.options.address));
              dispatch(changeContractType('Agreement'));
              setLoading(false);
            });
        }
      } catch (e) {
        console.error(e);
        setValueAgreementRequest({
          lastAgrAddr: '',
          error: true,
          hash: '',
          message: e?.message,
          submit: true,
        });
        setLoading(false);
      }
    }
    if (tokenCreator) {
      setLoading(true);
      try {
        if (!error) {
          const tokenInstance = new utilsProvider.eth.Contract(
            getContractABI('ERC20PremintDecimals')
          );
          const tokenSypplyInWei = (Number(tokenSupply) * Number(1e18)).toLocaleString('fullwide', {
            useGrouping: false,
          });
          tokenInstance
            .deploy({
              data: getContractBytecode('ERC20PremintDecimals'),
              arguments: [tokenName, tokenSymbol, tokenSypplyInWei],
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
    }
    if (multiTrancheCreator) {
      setLoading(true);
      try {
        if (!error) {
          const multiTrancheInstance = new utilsProvider.eth.Contract(
            getContractABI('MultiTranche')
          );
          multiTrancheInstance
            .deploy({
              data: getContractBytecode('MultiTranche'),
              arguments: [process.env.REACT_APP_PARSER, account, process.env.REACT_APP_DSL_CONTEXT],
            })
            .send({ from: account })
            .on('error', (err) => {
              console.error({ err });
            })
            .then(async (newMultiTrancheInstance: Contract) => {
              // Parse MultiTranche records
              console.log('Parse MultiTranche records');
              setLoading(true);
              // TODO: replace this block with parseAgreement() function call from `utils/agreementHelpers.ts`
              try {
                do {
                  await newMultiTrancheInstance.methods
                    .parse(process.env.REACT_APP_PREPROCESSOR)
                    .send({ from: account });
                  console.log({
                    parseFinished: await newMultiTrancheInstance.methods.parseFinished().call(),
                  });
                } while ((await newMultiTrancheInstance.methods.parseFinished().call()) === false);

                setLoading(false);
              } catch (e) {
                console.error({ e });
                setLoading(false);
              }

              setValueMultiTrancheRequest({
                multiTrancheAddr: newMultiTrancheInstance.options.address,
                error: true,
                message: '',
                submit: true,
              });
              dispatch(changeAgreementAddress(newMultiTrancheInstance.options.address));
              dispatch(changeContractType('Multitranche'));
              setLoading(false);
            });
        }
      } catch (e) {
        console.error(e);
        setValueMultiTrancheRequest({
          multiTrancheAddr: '',
          error: true,
          message: e?.message,
          submit: true,
        });
        setLoading(false);
      }
    }
  };

  // agreement creator
  const agreementMenu = (
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

  const agreementDropDown = () => {
    return (
      <Item>
        <Dropdown className="dropdown" overlay={agreementMenu}>
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

  const agreementFeilds = () => {
    return (
      <div>
        <div style={{ marginTop: '24px' }} className="text">
          Requestor label
        </div>
        <Item name="label" validateTrigger="onBlur" rules={getRule('label', 'label', lender)}>
          <Input
            className="lender"
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
        {agreementDropDown()}
        <div style={{ marginTop: '24px' }} className="text">
          Agreement template
        </div>
        <div className="value">
          {value === ' ' ? '' : '0x0000000000000000000000000000000000000000'}
        </div>
      </div>
    );
  };

  const multiTrancheFeilds = () => {
    return <div></div>;
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
          Token supply
        </div>
        <Item
          name="value-in-wei"
          validateTrigger="onChange"
          rules={
            tokenSupply?.length === 0
              ? getRule('value-in-wei', 'record-value', tokenSupply)
              : getRule('value-in-wei', 'record-value-in-wei', tokenSupply)
          }
        >
          <Input
            className="lender"
            onChange={(e) => {
              form.validateFields(['value-in-wei']).then(() => {
                const valueFormatting = String(e?.target?.value.replace(/,/gi, '')).replace(
                  /(.)(?=(\d{3})+$)/g,
                  '$1,'
                );
                form.setFieldsValue({
                  'value-in-wei': valueFormatting,
                });
              });
              setTokenSupply(e?.target?.value.replace(/[\s.,%]/g, ''));
            }}
          />
        </Item>
      </div>
    );
  };

  // choosing contract dropdown
  const creationModelMenu = (
    <Menu className="menu">
      <Menu.Item key="0">
        <button
          onClick={() => {
            setCreatorValue('Agreement');
            setAgreementCreator(true);
            setMultiTrancheCreator(false);
            setTokenCreator(false);
          }}
          type="button"
        >
          Agreement
        </button>
        <button
          onClick={() => {
            setCreatorValue('MultiTranche');
            setAgreementCreator(false);
            setMultiTrancheCreator(true);
            setTokenCreator(false);
          }}
          type="button"
        >
          Multi Tranche
        </button>
        <button
          onClick={() => {
            setCreatorValue('Token');
            setAgreementCreator(false);
            setMultiTrancheCreator(false);
            setTokenCreator(true);
          }}
          type="button"
        >
          Token
        </button>
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );

  const creationDropDown = () => {
    return (
      <Item name="creationDropDown">
        <Dropdown className="dropdown" overlay={creationModelMenu}>
          <Button className={error && 'ant-input-status-error'}>
            <Space>
              {creatorValue}
              <DownOutlined className="iconDropDown" />
            </Space>
          </Button>
        </Dropdown>
        <span className="ant-form-item-explain-error">{error}</span>
      </Item>
    );
  };

  const choosingFeilds = () => {
    if (agreementCreator) {
      return agreementFeilds();
    }
    if (tokenCreator) {
      return tokenFields();
    }
    if (multiTrancheCreator) {
      return multiTrancheFeilds();
    }
    return <></>;
  };

  useEffect(() => {
    if (error) {
      validationAgreementModel(value, setError);
    }
  }, [value]);

  return (
    <div className="agreementRequest">
      <div className="title">Agreement Request </div>
      <Spin spinning={loading}>
        <Form name="agreementRequestForm" form={form} autoComplete="off" onFinish={createAgreement}>
          <div className="text">Requestor</div>
          <div style={{ marginBottom: '24px' }} className="value">
            {account}
          </div>
          {creationDropDown()}
          {choosingFeilds()}
          <div className="btns">
            <div style={{ display: 'flex' }}>
              <Button
                style={{ height: '48px', marginRight: '16px' }}
                disabled={loading}
                htmlType="submit"
                className="btn"
                onClick={() => {
                  return validationAgreementModel(creatorValue, setError);
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
