import { useEffect, useState } from 'react';
import { Form, Button, Menu, Dropdown, Space, Input, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';
import { getContractABI, getContractBytecode } from 'utils/helpers';
import { Contract, ethers } from 'ethers';
import { parseRecords } from 'utils/agreementHelpers';
import getRule, { validationAgreementModel } from '../../../../utils/validate';
import { selectUtils } from '../../../../redux/utilsReducer';
import { changeAgreementAddress, changeContractType } from '../../../../redux/sessionReducer';
import { Agreement } from '../../../../types';
import './index.css';

const { Item } = Form;

/**
 * Creates a new Agreement conract. Either a General Agreement or MultiTranche Agreement
 */
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
  agreementCreator,
  setAgreementCreator,
  multiTrancheCreator,
  setMultiTrancheCreator,
  setValueMultiTrancheRequest,
}: Agreement) => {
  const { account } = useMetaMask();
  const { utilsProvider } = useSelector(selectUtils);
  const [creatorValue, setCreatorValue] = useState<string>();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createGeneralAgreement = async () => {
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
  };

  const createMultiTranche = async () => {
    setLoading(true);
    try {
      if (!error) {
        const multiTrancheInstance = new utilsProvider.eth.Contract(getContractABI('MultiTranche'));
        multiTrancheInstance
          .deploy({
            data: getContractBytecode('MultiTranche'),
            arguments: [process.env.REACT_APP_PARSER, account, process.env.REACT_APP_DSL_CONTEXT],
          })
          .send({ from: account })
          .on('error', (err) => {
            console.error({ err });
          })
          .then(async (multiTranche: Contract) => {
            // Parse MultiTranche records
            try {
              await parseRecords(multiTranche, account);
            } catch (e) {
              console.error({ e });
            }

            setValueMultiTrancheRequest({
              multiTrancheAddr: multiTranche.options.address,
              error: true,
              message: '',
              submit: true,
            });
            dispatch(changeAgreementAddress(multiTranche.options.address));
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
  };

  /**
   * Main function of the file
   */
  const createAgreement = async () => {
    if (agreementCreator) {
      await createGeneralAgreement();
    } else if (multiTrancheCreator) {
      await createMultiTranche();
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

  const mainDropdown = () => {
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

  const agreementFields = () => {
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
        {mainDropdown()}
        <div style={{ marginTop: '24px' }} className="text">
          Agreement template
        </div>
        <div className="value">{value === ' ' ? '' : ethers.constants.AddressZero}</div>
      </div>
    );
  };

  const multiTrancheFeilds = () => {
    return <div></div>;
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
          }}
          type="button"
        >
          Multi Tranche
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
    if (agreementCreator) return agreementFields();
    if (multiTrancheCreator) return multiTrancheFeilds();
    return <span></span>;
  };

  useEffect(() => {
    if (error) {
      validationAgreementModel(value, setError);
    }
  }, [value]);

  return (
    <div className="agreementRequest">
      <div className="title">Create Agreement</div>
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
                Create
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
