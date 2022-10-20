import React, { useState } from 'react';
import {
  Button,
  Input,
  Form,
  Spin,
  //  Dropdown, Menu, Space
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { selectUtils } from 'redux/utilsReducer';
import { createInstance, hex4Bytes } from 'utils/helpers';
import { selectSession } from 'redux/sessionReducer';
import getRule from '../../../utils/validate';
import { ReactComponent as Delete } from '../../../images/delete.svg';

const { Item } = Form;

interface Definition {
  setAgreementDefinition:React.Dispatch<React.SetStateAction<string>>;
  agreementDefinition:string;
  setValueDefinitionRequest:React.Dispatch<React.SetStateAction<{
    value: string;
    submit: boolean;
    hash: string;
    error: boolean;
    message: string;
}>>;
  setspecification:React.Dispatch<React.SetStateAction<{
    title: string;
    value: string;
    id: number;
    type: string;
}[]>>;
  specifications:{
    title: string;
    value: string;
    id: number;
    type: string;
}[];
  setDefinition:React.Dispatch<React.SetStateAction<string>>;
  definition:string;
  setLoading:React.Dispatch<React.SetStateAction<boolean>>;
  loading:boolean;
}

const DefinitionRequest = ({
  setAgreementDefinition: setAgreement,
  agreementDefinition: agreement,
  setValueDefinitionRequest,
  setspecification,
  specifications,
  setDefinition,
  definition,
  setLoading,
  loading,
}: Definition) => {
  const { address: userWallet } = useSelector(selectSession);
  const { provider } = useSelector(selectUtils);
  const [visible, setVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState(undefined);
  const navigate = useNavigate();

  const defineVariable = async () => {
    setLoading(true);
    try {
      const AGREEMENT_ADDR = agreement;
      const DEFINITION = definition;
      const SPETIFICATION = specifications[0].value;

      const agreementInstance = createInstance('Agreement', AGREEMENT_ADDR, provider);
      const rd = await agreementInstance.methods
        .setStorageAddress(hex4Bytes(DEFINITION), SPETIFICATION)
        .send({ from: userWallet });
      setValueDefinitionRequest({
        value: 'definition',
        submit: true,
        hash: rd?.transactionHash,
        error: false,
        message: '',
      });
      setLoading(false);
    } catch (e) {
      console.error(e);
      setValueDefinitionRequest({
        value: '',
        submit: true,
        hash: '',
        error: true,
        message: e?.message,
      });
      setLoading(false);
    }
  };

  const updateTypeSpetification = (id, type) => {
    const update = specifications?.map((c) => {
      return c?.id === id ? { ...c, type } : { ...c };
    });
    setspecification(update);
    setActiveMenu(undefined);
    setVisible(!visible);
  };

  const menuType = (value) => {
    return (
      <div className="menuType">
        <button onClick={() => updateTypeSpetification(value.id, 'text')} type="button">
          Address
        </button>
        <button onClick={() => updateTypeSpetification(value.id, 'number')} type="button">
          Number
        </button>
      </div>
    );
  };

  const typeContent = {
    text: 'Address',
    number: 'Number',
  };
  return (
    <div className="definitionRequest">
      <div className="title">Definition Request</div>
      <Spin spinning={loading}>
        <Form name="agreementRequestForm" autoComplete="off" onFinish={defineVariable}>
          <div className="text">Requestor</div>
          <div className="value">{userWallet}</div>
          <div style={{ marginTop: '24px' }} className="text">
            Agreement
          </div>
          <Item
            name="agreement"
            validateTrigger="onBlur"
            rules={getRule('agreement', 'agreement', agreement)}
          >
            <Input
              className="lender"
              defaultValue={agreement}
              onChange={(e) => {
                return setAgreement(e?.target?.value);
              }}
            />
          </Item>
          <div style={{ marginTop: '24px' }} className="text">
            Definition
          </div>
          <Item
            name="borrower"
            validateTrigger="onBlur"
            rules={getRule('definition', 'definition', definition)}
          >
            <Input
              maxLength={20}
              placeholder="Borrower"
              className="lender"
              defaultValue={definition}
              onChange={(e) => {
                return setDefinition(e?.target?.value);
              }}
            />
          </Item>
          <div className="specification">
            {specifications.map((el) => {
              return (
                <div className="specificationInput" key={el.id}>
                  {el?.id === 1 && (
                    <div style={{ marginTop: '24px' }} className="text">
                      Specifications
                    </div>
                  )}
                  <div className="container">
                    <div className="type">
                      <span>Type</span>
                      <button
                        type="button"
                        className={`btnType ${el?.id === activeMenu ? 'open' : ''}`}
                        onClick={() => {
                          setActiveMenu(activeMenu === el?.id ? undefined : el?.id);
                          setVisible(!visible);
                        }}
                      >
                        {typeContent[el?.type]} <div className="icon" />
                      </button>
                      {visible && activeMenu === el?.id && menuType(el)}
                    </div>
                    <div>
                      <span>Value</span>
                      <Item
                        name={`specification${el.id}`}
                        validateTrigger="onBlur"
                        rules={getRule(
                          'specification',
                          'specification',
                          el.value,
                          typeContent[el?.type]
                        )}
                      >
                        <Input
                          type={el?.type}
                          defaultValue={el.value}
                          onChange={(e) => {
                            return setspecification(
                              specifications?.map((c) => {
                                return c?.id === el?.id
                                  ? { ...c, value: e?.target.value }
                                  : { ...c };
                              })
                            );
                          }}
                          className="lender inputMenuType"
                        />
                      </Item>
                    </div>
                  </div>
                  <Button
                    htmlType="button"
                    onClick={() => {
                      return setspecification(
                        specifications.filter((s) => {
                          return s.id !== el.id;
                        })
                      );
                    }}
                    className="del"
                  >
                    {el.id !== 1 && <Delete />}
                  </Button>
                </div>
              );
            })}

            {specifications?.length < 5 && (
              <Button
                htmlType="button"
                className="add"
                onClick={() => {
                  setspecification([
                    ...specifications,
                    {
                      title: `Specification ${specifications?.length}`,
                      value: '',
                      id: uuidv4(),
                      type: 'text',
                    },
                  ]);
                  setActiveMenu(undefined);
                  setVisible(false);
                }}
              >
                Add Specification
              </Button>
            )}
          </div>
          <div className="btnsContainer">
            <Button disabled={loading} style={{ height: '48px' }} htmlType="submit" className="btn">
              Request Approval
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

export default DefinitionRequest;
